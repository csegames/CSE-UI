/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { AddDispatch, RootState } from '../../redux/store';
import {
  InventoryStackSplit,
  ItemActionTargetingData,
  ItemActionTargetingTag,
  updateItemActionTargeting,
  updateStackSplit
} from '../../redux/inventorySlice';
import {
  attemptItemMoves,
  canItemsStack,
  findItem,
  getMoveErrors,
  isItemDroppable,
  MoveItemRequest,
  isItemTrashable,
  getItemEquippedInGearSlot,
  getItemsUnitCount,
  useInventoryItem,
  getItemResourceByID,
  getItemIsLowDurability,
  getItemIsBroken
} from '../../helpers/itemHelpers';
import { ContextMenuItem, ContextMenuParams, hideContextMenu } from '../../redux/contextMenuSlice';
import { Faction, MoveItemRequestLocationType } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import TooltipSource from '../TooltipSource';
import { ModalModel, hideModal, showModal, updateModalContent } from '../../redux/modalsSlice';
import { NumberInput } from '../input/NumberInput';
import { ItemCompareTooltip } from './ItemCompareTooltip';
import ContextMenuSource from '../ContextMenuSource';
import Draggable from '../Draggable';
import DraggableHandle, { MOUSE_UP_NEEDED_REASON_DRAGGING } from '../DraggableHandle';
import DropTarget from '../DropTarget';
import { addConditionalWidgetExiting, addMouseUpNeededReason, removeMouseUpNeededReason } from '../../redux/hudSlice';
import { game } from '@csegames/library/dist/_baseGame';
import { updateForcedDraggableID } from '../../redux/dragAndDropSlice';
import { WIDGET_ID_INVENTORY } from '../inventory/Inventory';
import { EntityStat, TagState } from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { Item, ItemAction, ItemLocationType } from '@csegames/library/dist/camelotunchained/game/types/Items';
import {
  getStringTableValue,
  getTokenizedStringTableValue,
  StringIDGeneralAmount,
  StringIDGeneralCancel,
  StringIDGeneralConfirm
} from '../../helpers/stringTableHelpers';
import { StringTableEntryDef } from '../../dataSources/manifest/stringTableManifest';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { SoundEvents } from '@csegames/library/dist/camelotunchained/game/types/SoundEvents';
import { getStringFromTagAffixIDs } from '../../helpers/tagHelpers';
import { TradeSnapshot } from '@csegames/library/dist/camelotunchained/game/GameClientModels/TradeSnapshot';
import { setTradeItemPosition, swapTradeItemPositions } from '../../redux/tradeSlice';
import { GameDefsState } from '../../redux/gameDefsSlice';
import { AbilityDisplayDef } from '../../dataSources/manifest/abilityDisplayManifest';
import { EntityResourceIDs } from '@csegames/library/dist/camelotunchained/game/types/EntityResourceIDs';
import { showToaster } from '../../redux/toastersSlice';

import RepairCursorCursorPath from '../../../cursors/cursor-repair.cur';
import CannotRepairCursorPath from '../../../cursors/cursor-cannot-repair.cur';

import FallbackItemIconURL from '../../../images/unknown-item.jpg';

const ModalID = 'InventoryStack';
export const MOUSE_UP_NEEDED_REASON_REPAIRING = 'Repairing';

// CSS classes
const Root = 'HUD-ItemIcon-Root';
const SplitStack = 'HUD-ItemIcon-SplitStack';
const Slot = 'HUD-ItemIcon-Slot';
const Icon = 'HUD-ItemIcon-Icon';
const IconCount = 'HUD-ItemIcon-IconCount';
const Overlay = 'HUD-ItemIcon-Overlay';
const DurabilityOverlay = 'HUD-ItemIcon-DurabilityOverlay';
const TrashItemAmount = 'HUD-ItemIcon-TrashItemAmount';

// String IDs
const StringIDItemIconActionDeploy = 'ItemIconActionDeploy';
const StringIDItemIconActionEquip = 'ItemIconActionEquip';
const StringIDItemIconActionDrop = 'ItemIconActionDrop';
const StringIDItemIconActionTrash = 'ItemIconActionTrash';
const StringIDItemIconActionAbility = 'ItemIconActionAbility';
const StringIDItemIconTrashModalTitle = 'ItemIconTrashModalTitle';
const StringIDItemIconTrashModalMessage = 'ItemIconTrashModalMessage';
const StringIDItemCantBeRepaired = 'ItemIconCantBeRepaired';
const ItemIconSplitStackModalTitle = 'ItemIconSplitStackModalTitle';

const RepairCursor = formatCursorUrl(RepairCursorCursorPath);
const CannotRepairCursor = formatCursorUrl(CannotRepairCursorPath);

enum ItemMoveColor {
  Valid = 'rgba(46, 213, 80, 0.4)',
  Invalid = 'rgba(186, 50, 50, 0.4)',
  Stack = 'rgba(234, 211, 171, 0.4)'
}

export interface ItemIconDropData {
  type: ItemLocationType;
  slotIndex: number | null;
  slotID: string | null;
}

interface ReactProps {
  size: string;
  type: ItemLocationType;
  items?: Item[];
  slotIndex?: number;
  slotID?: string;
  slotImageURL?: string;
}

interface InjectedProps {
  entityID: string;
  stackSplit: InventoryStackSplit | null;
  inventoryItems: Item[];
  accountBank: Item[];
  equippedItems: Item[];
  faction: Faction;
  race: number;
  classID: number;
  selfTags: Record<number, TagState>;
  myStats: Record<number, EntityStat>;
  stringTable: Record<string, StringTableEntryDef>;
  tradeSnapshot: TradeSnapshot;
  tradeItemPositions: Record<number, string>;
  defs: GameDefsState;
  itemActionTargetingData: ItemActionTargetingData | null;
}

function formatCursorUrl(url: string): string {
  return `coui://./${url}`; // Cursors must have coui:// scheme prepended for the client to parse correctly
}

// Show the fallback when an item's icon asset fails to load.
function handleItemIconError(e: React.SyntheticEvent<HTMLImageElement>): void {
  e.currentTarget.onerror = null; // Prevent an infinite loop if the fallback itself fails.
  e.currentTarget.src = FallbackItemIconURL;
}

type Props = ReactProps & InjectedProps & AddDispatch;

class AItemIcon extends React.Component<Props> {
  private splitStackValue: number | null = null;
  private trashCount: number = 1;
  private isShiftHeld: boolean = false;
  private isCtrlHeld: boolean = false;

  render(): JSX.Element {
    const slotJSX = this.props.slotImageURL ? (
      <img style={{ height: this.props.size }} className={Slot} src={this.props.slotImageURL} />
    ) : (
      <div style={{ height: this.props.size }} className={Slot} />
    );
    if (this.props.items && this.props.items.length > 0) {
      const itemDef = this.props.defs.itemsByNumericID[this.props.items[0]?.defID];
      const iconURL = itemDef?.iconUrl || FallbackItemIconURL;
      const unitCount: number = getItemsUnitCount(this.props.items);
      const isStackableItem = itemDef?.isStackableItem;
      const isSplitting =
        this.props.stackSplit && this.props.stackSplit.itemInstanceID === this.props.items[0]?.instanceID;
      const dragCount: number = isSplitting ? this.props.stackSplit.amount : unitCount;

      // Need to check both conditions so that items in the middle of being added or removed from a trade can't
      // be messed with until the transition is complete.
      const isLockedForTrade =
        // Items displayed in the trade window are still manipulable there so they can be swapped or removed.
        this.props.type !== ItemLocationType._Trade &&
        // Is this item in the tradeSnapshot?
        (!!this.props.tradeSnapshot.tradeItems.find((item) => this.props.items?.[0].instanceID === item.instanceID) ||
          // Is this item in tradeItemPositions?
          Object.values(this.props.tradeItemPositions).includes(this.props.items[0].instanceID));

      const handleDragEnded = (data: ItemIconDropData | null): void => {
        const isSourceTrade = this.props.type === ItemLocationType._Trade;
        const isDestinationTrade = data?.type === ItemLocationType._Trade;
        let updatedStackSplit = false;
        if (data) {
          // If dropped in same spot it was dragged from (equivalent of just doing a left click on draggable)
          if (this.props.items?.[0] === this.getDropDataItem(data)) {
            this.splitStackValue = Math.max(Math.floor(unitCount / 2), 1);
            // Shift + click on stackable item in an inventory to split specified amount
            if (this.isShiftHeld && this.props.slotIndex !== undefined && itemDef?.isStackableItem) {
              this.props.dispatch(
                showModal({
                  id: ModalID,
                  content: this.getSplitStackModalContent(),
                  escapable: true
                })
              );
            }
            // Ctrl + click on stackable item in an inventory to split 1
            else if (this.isCtrlHeld && this.props.slotIndex !== undefined && itemDef?.isStackableItem) {
              this.props.dispatch(
                updateStackSplit({
                  itemInstanceID: this.props.items?.[0]?.instanceID ?? '',
                  amount: 1
                })
              );
              this.props.dispatch(updateForcedDraggableID(this.getDraggableID()));
              // Because we manually started a drag, we have to do a little bookkeeping to keep add/removes paired up.
              this.props.dispatch(addMouseUpNeededReason(MOUSE_UP_NEEDED_REASON_DRAGGING));
              updatedStackSplit = true;
            }
            // TODO: Left click on stackable item or container in inventory to open/close
            else {
            }
            // Shift and Ctrl flags are set on mouseDown.  We have to clear them now (mouseUp), or else they'll interfere
            // with bookkeeping for ForcedDraggables.
            this.isCtrlHeld = false;
            this.isShiftHeld = false;
          } else {
            if (isSourceTrade || isDestinationTrade) {
              this.dragTradeItem(data);
            } else {
              this.dragItem(data);
            }
          }
        } else if (isSourceTrade) {
          // If an item is dropped into space from the Trade window, we should remove that item from the pending Trade state.
          const itemInstanceID = this.props.tradeItemPositions[this.props.slotIndex ?? 0];
          this.performTradeItemRemoval(itemInstanceID);
        }

        if (!updatedStackSplit && this.props.stackSplit) {
          this.props.dispatch(updateStackSplit(null));
        }
        clientAPI.playGameSound(SoundEvents.PLAY_UI_INVENTORY_DROP);
      };
      const draggableJSX = (
        <Draggable
          draggableID={this.getDraggableID()}
          draggingRender={() => (
            <>
              <img className={Icon} src={iconURL} onError={handleItemIconError} />
              {isStackableItem && <span className={IconCount}>{dragCount}</span>}
            </>
          )}
        >
          <DraggableHandle
            draggableID={this.getDraggableID()}
            dragStartHandler={this.handleDragStarted.bind(this)}
            dropHandler={handleDragEnded.bind(this)}
            dropType='inventorySlot'
            isDisabled={isLockedForTrade}
          >
            <DropTarget
              dropData={this.getDropData()}
              dropType='inventorySlot'
              getHoverColor={this.getDropTargetHoverColor.bind(this)}
              showColorWhileDragging={this.props.type === ItemLocationType.Equipped}
            >
              {slotJSX}
              <img
                className={`${Icon}${isLockedForTrade ? ' locked' : ''}`}
                src={iconURL}
                onError={handleItemIconError}
              />
              {isStackableItem && (
                <span className={IconCount}>{unitCount - (isSplitting ? this.props.stackSplit.amount : 0)}</span>
              )}

              {getItemIsLowDurability(this.props.items[0]) && (
                <div className={`${DurabilityOverlay}${getItemIsBroken(this.props.items[0]) ? ' broken' : ''}`} />
              )}
              <div className={Overlay} />
            </DropTarget>
          </DraggableHandle>
        </Draggable>
      );
      return (
        <div
          style={{ width: this.props.size }}
          className={Root}
          onMouseEnter={this.onMouseEnter.bind(this)}
          onMouseLeave={this.onMouseLeave.bind(this)}
          onMouseDown={this.onMouseDown.bind(this)}
        >
          <TooltipSource
            tooltipID={`Inventory-Item-${this.props.items[0].instanceID}`}
            active={this.props.items?.length > 0}
            content={() => <ItemCompareTooltip items={this.props.items} />}
            positionType='mouse'
            noOuterBorder
          >
            {this.props.slotIndex !== undefined && !isLockedForTrade ? (
              <ContextMenuSource menuParams={this.getItemContextMenuParams()}>{draggableJSX}</ContextMenuSource>
            ) : (
              draggableJSX
            )}
          </TooltipSource>
        </div>
      );
    }
    return (
      <div style={{ width: this.props.size }} className={Root}>
        <DropTarget
          dropData={this.getDropData()}
          dropType='inventorySlot'
          getHoverColor={this.getDropTargetHoverColor.bind(this)}
          showColorWhileDragging={this.props.type === ItemLocationType.Equipped}
        >
          {slotJSX}
        </DropTarget>
      </div>
    );
  }

  private onMouseDown(e: React.MouseEvent): void {
    // If right click
    // TODO: This does not work properly if the item has a context menu open, ContextMenuSource blocks propagation
    if (e.button === 2) {
      // If an item targeting action was in progress, cancel it, but continue on to whatever else the click might do.
      if (this.props.itemActionTargetingData) {
        this.props.itemActionTargetingData.onTargetingCanceled?.();
        this.props.dispatch(updateItemActionTargeting(null));
      }

      // Right clicking an equipped item unequips it.
      if (this.props.type === ItemLocationType.Equipped) {
        this.unequipItem();
      }
    } else if (this.props.itemActionTargetingData && e.button === 0) {
      // If extra target handling was registered, trigger it.
      this.props.itemActionTargetingData.onItemTargeted?.(this.props.items![0], this.props.itemActionTargetingData);
      // Then on to the default target handling.
      if (
        !this.props.itemActionTargetingData.isValidTarget || // If no validity function, then all items are valid targets.
        this.props.itemActionTargetingData.isValidTarget(
          this.props.itemActionTargetingData.sourceItem,
          this.props.items![0]
        )
      ) {
        // This triggers the item action (though it does assume that items only have one relevant action).
        clientAPI.useInventoryItem(
          this.props.itemActionTargetingData.sourceItem.instanceID,
          this.props.items![0].instanceID
        );
        // This cleans up the targeting event.
        this.props.dispatch(updateItemActionTargeting(null));
      }
    }

    this.isShiftHeld = e.shiftKey;
    this.isCtrlHeld = e.ctrlKey;
  }

  private onMouseEnter(): void {
    if (this.props.itemActionTargetingData) {
      switch (this.props.itemActionTargetingData.tag) {
        case ItemActionTargetingTag.Repair: {
          if (
            this.props.itemActionTargetingData.isValidTarget &&
            this.props.items?.[0] &&
            !this.props.itemActionTargetingData.isValidTarget(
              this.props.itemActionTargetingData.sourceItem,
              this.props.items[0]
            )
          ) {
            clientAPI.setCursorOverrideURL(CannotRepairCursor);
          }
          break;
        }
      }
    }
  }

  private onMouseLeave(): void {
    if (this.props.itemActionTargetingData) {
      switch (this.props.itemActionTargetingData.tag) {
        case ItemActionTargetingTag.Repair: {
          // Set the cursor back to Repair (in case we made it Can'tRepair on mouse enter).
          clientAPI.setCursorOverrideURL(RepairCursor);
          break;
        }
      }
    }
  }

  private performTradeItemRemoval(itemInstanceID: string): void {
    const itemCount =
      this.props.tradeSnapshot.tradeItems.find((item) => item.instanceID === itemInstanceID)?.unitCount ?? 0;
    clientAPI.moveTradeItem(itemInstanceID, -itemCount);
    // We don't clear the item's position yet so that the UI doesn't jitter while we wait for the move command to
    // go through.  Also, if the move fails, the item will still know where to display itself.  If the move succeeds,
    // then tradeService.ts will clear it for us.
  }

  getDraggableID(): string {
    return `ItemIcon-${this.props.items?.[0]?.instanceID ?? null}-${this.props.slotID ?? null}`;
  }

  getDropData(): ItemIconDropData {
    return {
      type: this.props.type,
      slotIndex: this.props.slotIndex ?? null,
      slotID: this.props.slotID ?? null
    };
  }

  getDropDataItem({ type, slotIndex, slotID }: ItemIconDropData): Item | undefined {
    switch (type) {
      case ItemLocationType.AccountBank: {
        return this.props.accountBank.find((item) => item.location.position === slotIndex);
      }
      case ItemLocationType.Equipped: {
        return getItemEquippedInGearSlot(this.props.equippedItems, this.props.defs.itemsByNumericID, slotID ?? '');
      }
      case ItemLocationType.Inventory: {
        return this.props.inventoryItems.find((item): boolean => item.location.position === slotIndex);
      }
    }
  }

  getDropTargetHoverColor(draggableID: string): string | null {
    const itemID = draggableID.split('-')[1];
    const item = findItem(itemID, this.props.inventoryItems, this.props.equippedItems, this.props.accountBank);
    if (!item) {
      return null;
    }

    const tagStrings = Object.values(this.props.selfTags).map((tag) =>
      getStringFromTagAffixIDs(Object.values(tag.affixes), this.props.defs.tagAffixByNumericID)
    );

    const moveErrors = getMoveErrors(
      this.getDragItemMoves(item, this.getDropData()),
      this.props.inventoryItems,
      this.props.equippedItems,
      this.props.accountBank,
      this.props.faction,
      this.props.defs.racesByNumericID[this.props.race],
      this.props.defs.classesByNumericID[this.props.classID],
      tagStrings,
      this.props.myStats,
      this.props.stackSplit,
      this.props.stringTable,
      this.props.defs
    );
    if (moveErrors.length > 0) {
      return ItemMoveColor.Invalid;
    }
    if (
      this.props.items?.[0] &&
      canItemsStack(
        this.props.items[0],
        item,
        this.props.defs.itemsByNumericID,
        this.props.defs.stats,
        this.props.defs.entityResourcesByStringID
      )
    ) {
      return ItemMoveColor.Stack;
    }
    return ItemMoveColor.Valid;
  }

  getItemContextMenuParams(): ContextMenuParams {
    const content: ContextMenuItem[] = [];
    const itemDef = this.props.defs.itemsByNumericID[this.props.items?.[0]?.defID ?? -1];
    if (itemDef) {
      // Deploy
      if (isItemDroppable(this.props.items![0]) && itemDef.isDeployable) {
        const onClick = () => {
          this.deployItem();
        };
        content.push({
          title: getStringTableValue(StringIDItemIconActionDeploy, this.props.stringTable),
          onClick: onClick.bind(this)
        });
      }

      // Equip
      itemDef.gearSlotSets.forEach((gearSlotSet) => {
        gearSlotSet.forEach((gearSlotID) => {
          const onClick = () => {
            this.equipItem(gearSlotID);
          };
          content.push({
            title: getTokenizedStringTableValue(StringIDItemIconActionEquip, this.props.stringTable, {
              SLOT: gearSlotID
            }),
            onClick: onClick.bind(this)
          });
        });
      });

      // Actions
      itemDef.actions?.forEach?.((action) => {
        content.push({
          title: getTokenizedStringTableValue(StringIDItemIconActionAbility, this.props.stringTable, {
            DESCRIPTION: action.name
          }),
          onClick: this.performItemAction.bind(this, this.props.items![0], action),
          disabled: false // TODO: Item actions are being read from def for now, so can't contain stateful data and will always be enabled
        });
      });

      // Drop
      if (isItemDroppable(this.props.items![0])) {
        const onClick = () => {
          this.dropItem();
        };
        content.push({
          title: getStringTableValue(StringIDItemIconActionDrop, this.props.stringTable),
          onClick: onClick.bind(this)
        });
      }

      // Trash
      if (isItemTrashable(this.props.items![0])) {
        const onClick = () => {
          this.trashCount = 1;
          this.props.dispatch(
            showModal({
              id: ModalID,
              content: this.getTrashItemModalContent(),
              escapable: true
            })
          );
        };
        content.push({
          title: getStringTableValue(StringIDItemIconActionTrash, this.props.stringTable),
          onClick: onClick.bind(this)
        });
      }
    }

    return {
      id: `ItemIcon_${this.props.items?.[0]?.instanceID}`,
      content
    };
  }

  performItemAction(item: Item, action: ItemAction): void {
    const def = this.props.defs.abilityDisplayDefsByStringID[action.id];
    if (def) {
      // Check for actions that require a target.  There should be zero or one tag of this type.
      let targetTag = def.tags.find((tag) => tag.startsWith('Asset.Activation.SelectItem'));
      if (targetTag) {
        // Initiate selection mode!
        switch (targetTag as ItemActionTargetingTag) {
          case ItemActionTargetingTag.Repair: {
            this.beginRepairTargetingAction(item, action, def);
            break;
          }
          default: {
            console.error(`Attempting unsupported item action with tag "${targetTag}".`);
            break;
          }
        }
      } else {
        // Item that doesn't require an explicit target.
        useInventoryItem(item.instanceID, this.props.dispatch);
      }
    }
  }

  beginRepairTargetingAction(item: Item, action: ItemAction, def: AbilityDisplayDef): void {
    // Set custom cursor.
    clientAPI.setCursorOverrideURL(RepairCursor);
    this.props.dispatch(addMouseUpNeededReason(MOUSE_UP_NEEDED_REASON_REPAIRING));

    const data: ItemActionTargetingData = {
      tag: ItemActionTargetingTag.Repair,
      sourceItem: item,
      isValidTarget: (sourceItem: Item, targetItem: Item) => {
        // A repair target must have less than full durability, and must either have repair points available,
        // or not have a repair points stat at all (meaning infinitely repairable).

        const durability = getItemResourceByID(targetItem, EntityResourceIDs.Durability);
        const repairPoints = getItemResourceByID(targetItem, EntityResourceIDs.RepairPoints);

        const canRepair = !!durability && (!repairPoints || repairPoints.current > 0);
        const needsRepair = !!durability && durability.current < durability.max;

        return canRepair && needsRepair;
      },
      onItemTargeted: (targetItem: Item, data: ItemActionTargetingData) => {
        if (data.isValidTarget!(data.sourceItem, targetItem)) {
          this.props.dispatch(removeMouseUpNeededReason(MOUSE_UP_NEEDED_REASON_REPAIRING));
          clientAPI.setCursorOverrideURL('');
        } else {
          this.props.dispatch(
            showToaster({
              id: 'CantRepair',
              content: { message: getStringTableValue(StringIDItemCantBeRepaired, this.props.stringTable) }
            })
          );
        }
      },
      onTargetingCanceled: () => {
        // Clean up the custom cursor stuff.
        this.props.dispatch(removeMouseUpNeededReason(MOUSE_UP_NEEDED_REASON_REPAIRING));
        clientAPI.setCursorOverrideURL('');
      }
    };
    this.props.dispatch(updateItemActionTargeting(data));
  }

  getTrashItemModalContent(): ModalModel {
    const itemDef = this.props.defs.itemsByNumericID[this.props.items?.[0]?.defID ?? -1];
    return {
      title: getStringTableValue(StringIDItemIconTrashModalTitle, this.props.stringTable),
      message: getTokenizedStringTableValue(StringIDItemIconTrashModalMessage, this.props.stringTable, {
        NAME: itemDef?.name
      }),
      body: itemDef?.isStackableItem ? (
        <div className={TrashItemAmount}>
          <NumberInput
            text={getStringTableValue(StringIDGeneralAmount, this.props.stringTable)}
            value={this.trashCount}
            setValue={(deleteCount) => {
              this.trashCount = deleteCount;
              this.props.dispatch(updateModalContent([ModalID, this.getTrashItemModalContent()]));
            }}
            minValue={1}
            maxValue={this.props.items?.[0]?.unitCount ?? 1}
            step={1}
          />
        </div>
      ) : undefined,
      buttons: [
        {
          text: getStringTableValue(StringIDGeneralCancel, this.props.stringTable),
          onClick: () => {
            this.props.dispatch(hideModal());
          }
        },
        {
          text: getStringTableValue(StringIDGeneralConfirm, this.props.stringTable),
          onClick: () => {
            this.deleteItem();
            this.props.dispatch(hideModal());
          }
        }
      ]
    };
  }

  getSplitStackModalContent(): ModalModel {
    const confirm = (): void => {
      this.props.dispatch(hideModal());
      this.props.dispatch(
        updateStackSplit({
          itemInstanceID: this.props.items![0].instanceID,
          amount: this.splitStackValue!
        })
      );
      this.props.dispatch(updateForcedDraggableID(this.getDraggableID()));
      // Because we manually started a drag, we have to do a little bookkeeping to keep add/removes paired up.
      this.props.dispatch(addMouseUpNeededReason(MOUSE_UP_NEEDED_REASON_DRAGGING));
    };
    const setValue = (splitStackValue: number): void => {
      this.splitStackValue = splitStackValue;
      this.props.dispatch(updateModalContent([ModalID, this.getSplitStackModalContent()]));
    };
    return {
      title: getStringTableValue(ItemIconSplitStackModalTitle, this.props.stringTable),
      buttons: [
        {
          text: getStringTableValue(StringIDGeneralConfirm, this.props.stringTable),
          onClick: confirm.bind(this)
        }
      ],
      body: (
        <div className={SplitStack}>
          <NumberInput
            text={getStringTableValue(StringIDGeneralAmount, this.props.stringTable)}
            minValue={1}
            maxValue={this.props.items?.[0]?.unitCount ?? 1}
            step={1}
            value={this.splitStackValue ?? 1}
            setValue={setValue.bind(this)}
          />
        </div>
      )
    };
  }

  getFirstOpenInventoryIndex(): number {
    for (let i: number = 0; true; i++) {
      if (this.props.inventoryItems.every((inventoryItem): boolean => inventoryItem.location.position !== i)) {
        return i;
      }
    }
  }

  private dragTradeItem(destinationData: ItemIconDropData): void {
    const isSourceTrade = this.props.type === ItemLocationType._Trade;
    const isDestinationTrade = destinationData?.type === ItemLocationType._Trade;

    if (isSourceTrade) {
      // If the user drops straight back where it came from, that's the same as a click.
      // On click, we remove the item from the trade.
      if (isDestinationTrade && destinationData.slotIndex !== this.props.slotIndex) {
        // If both are trade, just need to swap local position data (server doesn't track position).
        this.props.dispatch(swapTradeItemPositions([this.props.slotIndex, destinationData.slotIndex]));
      } else {
        // If source is trade and destination is NOT, then the source item just needs removed from trade.
        this.performTradeItemRemoval(this.props.items?.[0]?.instanceID);
      }
    } else {
      // If destination is trade and source is NOT, then we need to assign the item a position and request a trade move.
      const prevSlotItemInstanceID = this.props.tradeItemPositions[destinationData.slotIndex];
      const prevSlotItem = this.props.tradeSnapshot.tradeItems.find((i) => i.instanceID === prevSlotItemInstanceID);
      if (prevSlotItem) {
        // If there was something in the target slot, ask the server to remove it from the trade.
        clientAPI.moveTradeItem(prevSlotItemInstanceID, -prevSlotItem.unitCount);
      }
      // Tell the local bookkeeping that the dropped item should go in this slot.
      // If something used to be there, the local bookkeeping now considers it to be gone.
      this.props.dispatch(setTradeItemPosition([this.props.items[0].instanceID, destinationData.slotIndex]));

      // Ask the server to add this item to the trade.
      clientAPI.moveTradeItem(this.props.items[0].instanceID, this.props.items[0].unitCount);
    }
  }

  dragItem(data: ItemIconDropData): void {
    const moves = this.getDragItemMoves(this.props.items[0], data);

    const tagStrings = Object.values(this.props.selfTags).map((tag) =>
      getStringFromTagAffixIDs(Object.values(tag.affixes), this.props.defs.tagAffixByNumericID)
    );

    attemptItemMoves(
      moves,
      this.props.inventoryItems,
      this.props.equippedItems,
      this.props.accountBank,
      this.props.faction,
      this.props.defs.racesByNumericID[this.props.race],
      this.props.defs.classesByNumericID[this.props.classID],
      tagStrings,
      this.props.myStats,
      this.props.stackSplit,
      this.props.stringTable,
      this.props.defs,
      this.props.dispatch
    );
  }

  getMoveType(locationType: ItemLocationType): MoveItemRequestLocationType {
    // Seems silly that we have to convert between these two.  Might be a case for unifying them.
    switch (locationType) {
      case ItemLocationType.AccountBank:
        return MoveItemRequestLocationType.AccountBank;
      case ItemLocationType.Equipped:
        return MoveItemRequestLocationType.Equipment;
      case ItemLocationType.Inventory:
        return MoveItemRequestLocationType.Inventory;
      default:
        return MoveItemRequestLocationType.Invalid;
    }
  }

  getDragItemMoves(item: Item, data: ItemIconDropData): MoveItemRequest[] {
    const { type, slotIndex, slotID } = data;
    const targetItem = this.getDropDataItem(data);
    const moves: MoveItemRequest[] = [];

    moves.push({
      MoveItemID: item.instanceID,
      UnitCount: this.props.stackSplit?.amount ?? -1,
      EntityIDFrom: this.props.entityID,
      CharacterIDFrom: game.characterID,
      BoneAliasFrom: 0,
      LocationTo: this.getMoveType(type),
      EntityIDTo: this.props.entityID,
      CharacterIDTo: game.characterID,
      PositionTo: slotID !== null ? -1 : slotIndex,
      ContainerIDTo: null,
      DrawerIndexTo: 0,
      GearSlotIDTo: slotID,
      WorldPositionTo: null,
      RotationTo: null,
      BoneAliasTo: 0
    });

    if (
      targetItem && // An item is being dragged on top of another item...
      (targetItem.defID !== item.defID || // The items are different (so they should swap)...
        slotID !== null || // The item was dragged from an inventory onto the equipment page to swap the two (e.g. swap damaged armor for hale armor).
        item.location.type == ItemLocationType.Equipped) // The item was dragged off the equipment page to swap it with an item in an inventory
    ) {
      const itemDef = this.props.defs.itemsByNumericID[this.props.items?.[0]?.defID ?? -1];

      moves.push({
        MoveItemID: targetItem.instanceID,
        UnitCount: -1,
        EntityIDFrom: this.props.entityID,
        CharacterIDFrom: game.characterID,
        BoneAliasFrom: 0,
        LocationTo: this.getMoveType(item.location.type),
        EntityIDTo: this.props.entityID,
        PositionTo: item.location.position,
        ContainerIDTo: null,
        CharacterIDTo: game.characterID,
        DrawerIndexTo: 0,
        GearSlotIDTo:
          item.location.type == ItemLocationType.Equipped && itemDef?.gearSlotSets?.[item.location.position]
            ? itemDef.gearSlotSets[item.location.position][0]
            : null,
        WorldPositionTo: null,
        RotationTo: null,
        BoneAliasTo: 0,
        IsLocalOnly: true
      });
    }

    return moves;
  }

  equipItem(gearSlotID: string): void {
    this.props.dispatch(hideContextMenu());
    const targetItem = getItemEquippedInGearSlot(
      this.props.equippedItems,
      this.props.defs.itemsByNumericID,
      gearSlotID
    );
    const moves: MoveItemRequest[] = [];

    const tagStrings = Object.values(this.props.selfTags).map((tag) =>
      getStringFromTagAffixIDs(Object.values(tag.affixes), this.props.defs.tagAffixByNumericID)
    );

    const item = this.props.items![0];
    const characterID = game.characterID;
    moves.push({
      MoveItemID: item.instanceID,
      UnitCount: this.props.stackSplit?.amount ?? -1,
      EntityIDFrom: this.props.entityID,
      CharacterIDFrom: characterID,
      BoneAliasFrom: 0,
      LocationTo: MoveItemRequestLocationType.Equipment,
      EntityIDTo: this.props.entityID,
      CharacterIDTo: characterID,
      PositionTo: -1,
      ContainerIDTo: null,
      DrawerIndexTo: 0,
      GearSlotIDTo: gearSlotID,
      WorldPositionTo: null,
      RotationTo: null,
      BoneAliasTo: 0
    });

    if (targetItem) {
      moves.push({
        MoveItemID: targetItem.instanceID,
        UnitCount: -1,
        EntityIDFrom: this.props.entityID,
        CharacterIDFrom: characterID,
        BoneAliasFrom: 0,
        LocationTo: this.getMoveType(item.location.type),
        EntityIDTo: this.props.entityID,
        PositionTo: item.location.position,
        ContainerIDTo: null,
        CharacterIDTo: characterID,
        DrawerIndexTo: 0,
        GearSlotIDTo: null,
        WorldPositionTo: null,
        RotationTo: null,
        BoneAliasTo: 0,
        IsLocalOnly: true
      });
    }

    attemptItemMoves(
      moves,
      this.props.inventoryItems,
      this.props.equippedItems,
      this.props.accountBank,
      this.props.faction,
      this.props.defs.racesByNumericID[this.props.race],
      this.props.defs.classesByNumericID[this.props.classID],
      tagStrings,
      this.props.myStats,
      this.props.stackSplit,
      this.props.stringTable,
      this.props.defs,
      this.props.dispatch
    );
  }

  unequipItem(): void {
    const item = this.props.items![0];
    const characterID = game.characterID;
    const move: MoveItemRequest = {
      MoveItemID: item.instanceID,
      UnitCount: -1,
      EntityIDFrom: this.props.entityID,
      CharacterIDFrom: characterID,
      BoneAliasFrom: 0,
      LocationTo: MoveItemRequestLocationType.Inventory,
      EntityIDTo: this.props.entityID,
      CharacterIDTo: characterID,
      PositionTo: this.getFirstOpenInventoryIndex(),
      ContainerIDTo: null,
      DrawerIndexTo: 0,
      GearSlotIDTo: null,
      WorldPositionTo: null,
      RotationTo: null,
      BoneAliasTo: 0
    };

    const tagStrings = Object.values(this.props.selfTags).map((tag) =>
      getStringFromTagAffixIDs(Object.values(tag.affixes), this.props.defs.tagAffixByNumericID)
    );

    attemptItemMoves(
      [move],
      this.props.inventoryItems,
      this.props.equippedItems,
      this.props.accountBank,
      this.props.faction,
      this.props.defs.racesByNumericID[this.props.race],
      this.props.defs.classesByNumericID[this.props.classID],
      tagStrings,
      this.props.myStats,
      this.props.stackSplit,
      this.props.stringTable,
      this.props.defs,
      this.props.dispatch
    );
  }

  deployItem(): void {
    this.props.dispatch(hideContextMenu());
    this.props.dispatch(addConditionalWidgetExiting(WIDGET_ID_INVENTORY));
    const itemDef = this.props.defs.itemsByNumericID[this.props.items?.[0]?.defID ?? -1];

    game.itemPlacementMode.requestStart(itemDef?.numericID, this.props.items?.[0]?.instanceID ?? '', '');
  }

  dropItem(): void {
    this.props.dispatch(hideContextMenu());

    const item = this.props.items![0];
    const characterID = game.characterID;
    const move: MoveItemRequest = {
      MoveItemID: item.instanceID,
      UnitCount: -1,
      EntityIDFrom: this.props.entityID,
      CharacterIDFrom: characterID,
      BoneAliasFrom: 0,
      LocationTo: MoveItemRequestLocationType.Ground,
      EntityIDTo: null,
      CharacterIDTo: null,
      PositionTo: -1,
      ContainerIDTo: null,
      DrawerIndexTo: 0,
      GearSlotIDTo: null,
      WorldPositionTo: null,
      RotationTo: null,
      BoneAliasTo: 0
    };

    const tagStrings = Object.values(this.props.selfTags).map((tag) =>
      getStringFromTagAffixIDs(Object.values(tag.affixes), this.props.defs.tagAffixByNumericID)
    );

    attemptItemMoves(
      [move],
      this.props.inventoryItems,
      this.props.equippedItems,
      this.props.accountBank,
      this.props.faction,
      this.props.defs.racesByNumericID[this.props.race],
      this.props.defs.classesByNumericID[this.props.classID],
      tagStrings,
      this.props.myStats,
      this.props.stackSplit,
      this.props.stringTable,
      this.props.defs,
      this.props.dispatch
    );
  }

  deleteItem(): void {
    this.props.dispatch(hideContextMenu());

    const item = this.props.items![0];
    const characterID = game.characterID;
    const move: MoveItemRequest = {
      MoveItemID: item.instanceID,
      UnitCount: this.trashCount,
      EntityIDFrom: this.props.entityID,
      CharacterIDFrom: characterID,
      BoneAliasFrom: 0,
      LocationTo: MoveItemRequestLocationType.Trash,
      EntityIDTo: null,
      CharacterIDTo: null,
      PositionTo: -1,
      ContainerIDTo: null,
      DrawerIndexTo: 0,
      GearSlotIDTo: null,
      WorldPositionTo: null,
      RotationTo: null,
      BoneAliasTo: 0
    };

    const tagStrings = Object.values(this.props.selfTags).map((tag) =>
      getStringFromTagAffixIDs(Object.values(tag.affixes), this.props.defs.tagAffixByNumericID)
    );

    attemptItemMoves(
      [move],
      this.props.inventoryItems,
      this.props.equippedItems,
      this.props.accountBank,
      this.props.faction,
      this.props.defs.racesByNumericID[this.props.race],
      this.props.defs.classesByNumericID[this.props.classID],
      tagStrings,
      this.props.myStats,
      this.props.stackSplit,
      this.props.stringTable,
      this.props.defs,
      this.props.dispatch
    );
  }

  handleDragStarted(): void {
    clientAPI.playGameSound(SoundEvents.PLAY_UI_INVENTORY_SELECTION);
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): ReactProps & InjectedProps => {
  const { entityID, faction, race, classID, stats, tags } = state.entities.self;
  const { primary, accountBank, equipment, stackSplit } = state.inventory;
  return {
    ...ownProps,
    entityID,
    stackSplit,
    inventoryItems: primary,
    accountBank: accountBank,
    equippedItems: equipment,
    faction,
    race,
    classID,
    selfTags: tags,
    myStats: stats,
    stringTable: state.stringTable.stringTable,
    tradeSnapshot: state.trade.tradeSnapshot,
    tradeItemPositions: state.trade.tradeItemPositions,
    defs: state.gameDefs,
    itemActionTargetingData: state.inventory.itemActionTargetingData
  };
};

export const ItemIcon = connect(mapStateToProps)(AItemIcon);
