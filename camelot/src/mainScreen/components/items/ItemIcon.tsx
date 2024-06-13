/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Dispatch } from '@reduxjs/toolkit';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import {
  CharacterStatField,
  ClassDefGQL,
  EquippedItem,
  GearSlot,
  Item,
  RaceDefGQL
} from '@csegames/library/dist/camelotunchained/graphql/schema';
import { InventoryStackSplit, updateStackSplit } from '../../redux/inventorySlice';
import {
  attemptItemMoves,
  canItemsStack,
  findItem,
  getItemGearSlotID,
  getItemUnitCount,
  getMoveErrors,
  isItemDroppable,
  performItemAction,
  refreshItems,
  MoveItemRequest
} from './itemUtils';
import { ContextMenuItem, ContextMenuParams, hideContextMenu } from '../../redux/contextMenuSlice';
import { Faction, MoveItemRequestLocationType } from '@csegames/library/dist/camelotunchained/webAPI/definitions';
import TooltipSource from '../TooltipSource';
import { ModalModel, hideModal, showModal, updateModalContent } from '../../redux/modalsSlice';
import { NumberInput } from '../input/NumberInput';
import { ItemTooltip } from './ItemTooltip';
import ContextMenuSource from '../ContextMenuSource';
import Draggable from '../Draggable';
import DraggableHandle from '../DraggableHandle';
import DropTarget from '../DropTarget';
import { addMenuWidgetExiting } from '../../redux/hudSlice';
import { game } from '@csegames/library/dist/_baseGame';
import { endDrag, updateForcedDraggableID } from '../../redux/dragAndDropSlice';
import { WIDGET_NAME_INVENTORY } from '../inventory/Inventory';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';

const Root = 'HUD-ItemIcon-Root';
const SplitStack = 'HUD-ItemIcon-SplitStack';
const Slot = 'HUD-ItemIcon-Slot';
const GearSlotIcon = 'HUD-ItemIcon-GearSlotIcon';
const Icon = 'HUD-ItemIcon-Icon';
const IconCount = 'HUD-ItemIcon-IconCount';
const Overlay = 'HUD-ItemIcon-Overlay';

enum ItemMoveColor {
  Valid = 'rgba(46, 213, 80, 0.4)',
  Invalid = 'rgba(186, 50, 50, 0.4)',
  Stack = 'rgba(234, 211, 171, 0.4)'
}

export interface ItemIconDropData {
  inventoryIndex: number | null;
  gearSlotID: string | null;
}

interface ReactProps {
  size: string;
  items?: Item[];
  inventoryIndex?: number;
  equippedGearSlotID?: string;
  slotImageURL?: string;
}

interface InjectedProps {
  characterID: string;
  entityID: string;
  stackSplit: InventoryStackSplit | null;
  inventoryItems: Item[];
  equippedItems: EquippedItem[];
  gearSlots: Dictionary<GearSlot>;
  faction: Faction;
  race: number;
  classID: number;
  raceTags: string[];
  myStats: Dictionary<CharacterStatField>;
  inventoryPendingRefreshes: number;
  equippedItemsPendingRefreshes: number;
  classesByNumericID: Dictionary<ClassDefGQL>;
  racesByNumericID: Dictionary<RaceDefGQL>;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AItemIcon extends React.Component<Props> {
  private splitStackValue: number | null = null;
  private mouseDownAt: number | null = null;
  private isShiftHeld: boolean = false;
  private isCtrlHeld: boolean = false;

  render(): JSX.Element {
    const slotJSX = this.props.slotImageURL ? (
      <img style={{ height: this.props.size }} className={Slot} src={this.props.slotImageURL} />
    ) : (
      <div style={{ height: this.props.size }} className={Slot} />
    );
    if (this.props.items?.length) {
      const iconURL = this.props.items[0].staticDefinition.iconUrl;
      let unitCount: number = 0;
      for (const item of this.props.items) {
        unitCount += getItemUnitCount(item);
      }
      const isStackableItem = this.props.items[0].staticDefinition.isStackableItem;
      const dragCount: number =
        this.props.stackSplit && this.props.stackSplit.itemID === this.props.items[0].id
          ? this.props.stackSplit.amount
          : unitCount;
      const gearSlotID = getItemGearSlotID(this.props.items[0]);
      const handleDragEnded = (data: ItemIconDropData | null): void => {
        let updatedStackSplit = false;
        if (data) {
          // If dropped in same spot it was dragged from (equivalent of just doing a left click on draggable)
          if (this.props.items[0] === this.getDropDataItem(data)) {
            this.splitStackValue = Math.max(Math.floor(unitCount / 2), 1);
            // Shift + click on stackable item in inventory to split specified amount
            if (
              this.isShiftHeld &&
              this.props.inventoryIndex !== undefined &&
              this.props.items[0].staticDefinition.isStackableItem
            ) {
              this.props.dispatch(
                showModal({
                  id: 'InventoryStack',
                  content: this.getSplitStackModalContent(),
                  escapable: true
                })
              );
            }
            // Ctrl + click on stackable item in inventory to split 1
            else if (
              this.isCtrlHeld &&
              this.props.inventoryIndex !== undefined &&
              this.props.items[0].staticDefinition.isStackableItem
            ) {
              this.props.dispatch(
                updateStackSplit({
                  itemID: this.props.items[0].id,
                  amount: 1
                })
              );
              this.props.dispatch(updateForcedDraggableID(this.getDraggableID()));
              updatedStackSplit = true;
            }
            // TODO: Left click on stackable item or container in inventory to open/close
            else {
            }
          } else {
            this.dragItem(data);
          }
        }
        if (!updatedStackSplit && this.props.stackSplit) {
          this.props.dispatch(updateStackSplit(null));
        }
      };
      const draggableJSX = (
        <Draggable draggableID={this.getDraggableID()}>
          <DraggableHandle
            draggableID={this.getDraggableID()}
            draggingRender={() => (
              <>
                {iconURL && <img className={Icon} src={iconURL} />}
                {isStackableItem && <span className={IconCount}>{dragCount}</span>}
              </>
            )}
            dropHandler={handleDragEnded.bind(this)}
            dropType='inventorySlot'
          >
            <DropTarget
              dropData={this.getDropData()}
              dropType='inventorySlot'
              getHoverColor={this.getDropTargetHoverColor.bind(this)}
            >
              {slotJSX}
              {iconURL && <img className={Icon} src={iconURL} />}
              {isStackableItem && <span className={IconCount}>{unitCount}</span>}
              <div className={Overlay} />
            </DropTarget>
          </DraggableHandle>
        </Draggable>
      );
      return (
        <div
          style={{ width: this.props.size }}
          className={Root}
          onMouseDown={(e) => {
            const now = Date.now();
            // If item is equipped
            if (this.props.equippedGearSlotID !== undefined) {
              // If right click
              if (e.button === 2) {
                this.unequipItem();
              }
            }
            // If is an equippable item in the inventory
            if (this.props.inventoryIndex !== undefined && gearSlotID) {
              // If double click
              if (this.mouseDownAt && now - this.mouseDownAt < 500) {
                this.equipItem(gearSlotID);
                this.props.dispatch(endDrag());
              }
            }
            this.mouseDownAt = now;
            this.isShiftHeld = e.shiftKey;
            this.isCtrlHeld = e.ctrlKey;
          }}
        >
          <TooltipSource
            tooltipParams={{
              id: `Inventory-Item-${this.props.items[0].id}`,
              content: () => (this.props.items?.length ? <ItemTooltip items={this.props.items} /> : null)
            }}
          >
            {this.props.inventoryIndex !== undefined ? (
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
        >
          {slotJSX}
          {this.props.equippedGearSlotID !== undefined && (
            <div className={`${GearSlotIcon} ${this.props.gearSlots[this.props.equippedGearSlotID].iconClass}`}></div>
          )}
        </DropTarget>
      </div>
    );
  }

  getDraggableID(): string {
    return `ItemIcon-${this.props.items[0].id ?? null}-${this.props.equippedGearSlotID ?? null}`;
  }

  getDropData(): ItemIconDropData {
    return {
      inventoryIndex: this.props.inventoryIndex ?? null,
      gearSlotID: this.props.equippedGearSlotID ?? null
    };
  }

  getDropDataItem({ inventoryIndex, gearSlotID }: ItemIconDropData): Item | null {
    return inventoryIndex !== null
      ? this.props.inventoryItems.find(
          (inventoryItem): boolean => inventoryItem.location.inventory.position === inventoryIndex
        )
      : this.props.equippedItems.find((equippedItem) =>
          equippedItem.item.location.equipped.gearSlots.includes(gearSlotID)
        )?.item;
  }

  getDropTargetHoverColor(draggableID: string): string | null {
    const itemID = draggableID.split('-')[1];
    const item = findItem(itemID, this.props.inventoryItems, this.props.equippedItems);
    if (!item) {
      return null;
    }
    if (
      getMoveErrors(
        this.getDragItemMoves(item, this.getDropData()),
        this.props.inventoryItems,
        this.props.equippedItems,
        this.props.faction,
        this.props.racesByNumericID[this.props.race],
        this.props.classesByNumericID[this.props.classID],
        this.props.raceTags,
        this.props.myStats,
        this.props.stackSplit
      ).length > 0
    ) {
      return ItemMoveColor.Invalid;
    }
    if (this.props.items[0] && canItemsStack(this.props.items[0], item)) {
      return ItemMoveColor.Stack;
    }
    return ItemMoveColor.Valid;
  }

  getItemContextMenuParams(): ContextMenuParams {
    const content: ContextMenuItem[] = [];
    // Deploy
    if (isItemDroppable(this.props.items[0]) && this.props.items[0].staticDefinition.deploySettings) {
      const onClick = () => {
        this.deployItem();
      };
      content.push({
        title: 'Deploy',
        onClick: onClick.bind(this)
      });
    }
    // Equip
    this.props.items[0].staticDefinition.gearSlotSets.forEach((gearSlotSet) => {
      gearSlotSet.gearSlots.forEach((gearSlotID) => {
        const onClick = () => {
          this.equipItem(gearSlotID);
        };
        content.push({
          title: `Equip to ${gearSlotID}`,
          onClick: onClick.bind(this)
        });
      });
    });
    // Actions
    this.props.items[0].actions?.forEach?.((action) => {
      if (action.enabled || action.showWhenDisabled) {
        const onClick = () => {
          performItemAction(
            this.props.items[0].id,
            this.props.items[0].staticDefinition.numericItemDefID,
            action.id,
            action.uIReaction,
            this.props.entityID,
            null,
            null,
            0,
            this.props.dispatch
          );
        };
        content.push({
          title: action.name,
          onClick: onClick.bind(this),
          disabled: !action.enabled
        });
      }
    });
    // Drop
    if (isItemDroppable(this.props.items[0])) {
      const onClick = () => {
        this.dropItem();
      };
      content.push({
        title: 'Drop item',
        onClick: onClick.bind(this)
      });
    }
    return {
      id: `ItemIcon_${this.props.items[0].id}`,
      content
    };
  }

  getSplitStackModalContent(): ModalModel {
    const confirm = (): void => {
      this.props.dispatch(hideModal());
      this.props.dispatch(
        updateStackSplit({
          itemID: this.props.items[0].id,
          amount: this.splitStackValue
        })
      );
      this.props.dispatch(updateForcedDraggableID(this.getDraggableID()));
    };
    const setValue = (splitStackValue: number): void => {
      this.splitStackValue = splitStackValue;
      this.props.dispatch(updateModalContent(this.getSplitStackModalContent()));
    };
    return {
      title: 'Split Stack',
      buttons: [
        {
          text: 'Confirm',
          onClick: confirm.bind(this)
        }
      ],
      body: (
        <div className={SplitStack}>
          <NumberInput
            text='Amount'
            minValue={1}
            maxValue={getItemUnitCount(this.props.items[0])}
            step={1}
            value={this.splitStackValue}
            setValue={setValue.bind(this)}
          />
        </div>
      )
    };
  }

  getFirstOpenInventoryIndex(): number {
    for (let i: number = 0; true; i++) {
      if (
        this.props.inventoryItems.every((inventoryItem): boolean => inventoryItem.location.inventory.position !== i)
      ) {
        return i;
      }
    }
  }

  dragItem(data: ItemIconDropData): void {
    const moves = this.getDragItemMoves(this.props.items[0], data);
    attemptItemMoves(
      moves,
      this.props.inventoryItems,
      this.props.equippedItems,
      this.props.faction,
      this.props.racesByNumericID[this.props.race],
      this.props.classesByNumericID[this.props.classID],
      this.props.raceTags,
      this.props.myStats,
      this.props.gearSlots,
      this.props.inventoryPendingRefreshes,
      this.props.equippedItemsPendingRefreshes,
      this.props.stackSplit,
      this.props.dispatch
    );
  }

  getDragItemMoves(item: Item, data: ItemIconDropData): MoveItemRequest[] {
    const { inventoryIndex, gearSlotID } = data;
    const targetItem = this.getDropDataItem(data);
    const moves: MoveItemRequest[] = [];
    const characterID = item.location.inventory?.characterID ?? item.location.equipped?.characterID;

    moves.push({
      MoveItemID: item.id,
      UnitCount: this.props.stackSplit?.amount ?? -1,
      EntityIDFrom: null,
      CharacterIDFrom: characterID,
      BoneAliasFrom: 0,
      LocationTo: gearSlotID !== null ? MoveItemRequestLocationType.Equipment : MoveItemRequestLocationType.Inventory,
      EntityIDTo: null,
      CharacterIDTo: characterID,
      PositionTo: gearSlotID !== null ? -1 : inventoryIndex,
      ContainerIDTo: null,
      DrawerIDTo: null,
      GearSlotIDTo: gearSlotID,
      VoxSlotTo: null,
      BuildingIDTo: null,
      WorldPositionTo: null,
      RotationTo: null,
      BoneAliasTo: 0
    });

    if (targetItem && targetItem.staticDefinition.id !== item.staticDefinition.id) {
      moves.push({
        MoveItemID: targetItem.id,
        UnitCount: -1,
        EntityIDFrom: null,
        CharacterIDFrom: characterID,
        BoneAliasFrom: 0,
        LocationTo: item.location.equipped
          ? MoveItemRequestLocationType.Equipment
          : MoveItemRequestLocationType.Inventory,
        EntityIDTo: null,
        PositionTo: item.location.inventory ? item.location.inventory.position : -1,
        ContainerIDTo: null,
        CharacterIDTo: characterID,
        DrawerIDTo: null,
        GearSlotIDTo: item.location.equipped ? item.location.equipped.gearSlots[0] : null,
        VoxSlotTo: null,
        BuildingIDTo: null,
        WorldPositionTo: null,
        RotationTo: null,
        BoneAliasTo: 0
      });
    }

    return moves;
  }

  equipItem(gearSlotID: string): void {
    this.props.dispatch(hideContextMenu());
    const targetItem =
      this.props.equippedItems.find((equippedItem) =>
        equippedItem.item.location.equipped.gearSlots.includes(gearSlotID)
      ) ?? null;
    const moves: MoveItemRequest[] = [];

    const item = this.props.items[0];
    const characterID = item.location.inventory?.characterID ?? item.location.equipped?.characterID;
    moves.push({
      MoveItemID: item.id,
      UnitCount: this.props.stackSplit?.amount ?? -1,
      EntityIDFrom: null,
      CharacterIDFrom: characterID,
      BoneAliasFrom: 0,
      LocationTo: gearSlotID !== null ? MoveItemRequestLocationType.Equipment : MoveItemRequestLocationType.Inventory,
      EntityIDTo: null,
      CharacterIDTo: characterID,
      PositionTo: -1,
      ContainerIDTo: null,
      DrawerIDTo: null,
      GearSlotIDTo: gearSlotID,
      VoxSlotTo: null,
      BuildingIDTo: null,
      WorldPositionTo: null,
      RotationTo: null,
      BoneAliasTo: 0
    });

    if (targetItem) {
      moves.push({
        MoveItemID: targetItem.item.id,
        UnitCount: -1,
        EntityIDFrom: null,
        CharacterIDFrom: characterID,
        BoneAliasFrom: 0,
        LocationTo: MoveItemRequestLocationType.Inventory,
        EntityIDTo: null,
        PositionTo: item.location.inventory?.position ?? -1,
        ContainerIDTo: null,
        CharacterIDTo: characterID,
        DrawerIDTo: null,
        GearSlotIDTo: null,
        VoxSlotTo: null,
        BuildingIDTo: null,
        WorldPositionTo: null,
        RotationTo: null,
        BoneAliasTo: 0
      });
    }

    attemptItemMoves(
      moves,
      this.props.inventoryItems,
      this.props.equippedItems,
      this.props.faction,
      this.props.racesByNumericID[this.props.race],
      this.props.classesByNumericID[this.props.classID],
      this.props.raceTags,
      this.props.myStats,
      this.props.gearSlots,
      this.props.inventoryPendingRefreshes,
      this.props.equippedItemsPendingRefreshes,
      this.props.stackSplit,
      this.props.dispatch
    );
  }

  unequipItem(): void {
    const item = this.props.items[0];
    const characterID = item.location.inventory?.characterID ?? item.location.equipped?.characterID;
    const move: MoveItemRequest = {
      MoveItemID: item.id,
      UnitCount: -1,
      EntityIDFrom: null,
      CharacterIDFrom: characterID,
      BoneAliasFrom: 0,
      LocationTo: MoveItemRequestLocationType.Inventory,
      EntityIDTo: null,
      CharacterIDTo: characterID,
      PositionTo: this.getFirstOpenInventoryIndex(),
      ContainerIDTo: null,
      DrawerIDTo: null,
      GearSlotIDTo: null,
      VoxSlotTo: null,
      BuildingIDTo: null,
      WorldPositionTo: null,
      RotationTo: null,
      BoneAliasTo: 0
    };

    attemptItemMoves(
      [move],
      this.props.inventoryItems,
      this.props.equippedItems,
      this.props.faction,
      this.props.racesByNumericID[this.props.race],
      this.props.classesByNumericID[this.props.classID],
      this.props.raceTags,
      this.props.myStats,
      this.props.gearSlots,
      this.props.inventoryPendingRefreshes,
      this.props.equippedItemsPendingRefreshes,
      this.props.stackSplit,
      this.props.dispatch
    );
  }

  deployItem(): void {
    this.props.dispatch(hideContextMenu());
    this.props.dispatch(addMenuWidgetExiting(WIDGET_NAME_INVENTORY));
    game.itemPlacementMode.requestStart(
      this.props.items[0].staticDefinition.numericItemDefID,
      this.props.items[0].id,
      ''
    );
    refreshItems(this.props.dispatch);
  }

  dropItem(): void {
    this.props.dispatch(hideContextMenu());

    const item = this.props.items[0];
    const characterID = item.location.inventory?.characterID ?? item.location.equipped?.characterID;
    const move: MoveItemRequest = {
      MoveItemID: item.id,
      UnitCount: -1,
      EntityIDFrom: null,
      CharacterIDFrom: characterID,
      BoneAliasFrom: 0,
      LocationTo: MoveItemRequestLocationType.Ground,
      EntityIDTo: null,
      CharacterIDTo: null,
      PositionTo: -1,
      ContainerIDTo: null,
      DrawerIDTo: null,
      GearSlotIDTo: null,
      VoxSlotTo: null,
      BuildingIDTo: null,
      WorldPositionTo: null,
      RotationTo: null,
      BoneAliasTo: 0
    };

    attemptItemMoves(
      [move],
      this.props.inventoryItems,
      this.props.equippedItems,
      this.props.faction,
      this.props.racesByNumericID[this.props.race],
      this.props.classesByNumericID[this.props.classID],
      this.props.raceTags,
      this.props.myStats,
      this.props.gearSlots,
      this.props.inventoryPendingRefreshes,
      this.props.equippedItemsPendingRefreshes,
      this.props.stackSplit,
      this.props.dispatch
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  const raceDef = state.gameDefs.racesByNumericID[state.player.race];
  return {
    ...ownProps,
    characterID: state.player.characterID,
    entityID: state.player.entityID,
    stackSplit: state.inventory.stackSplit,
    inventoryItems: state.inventory.items ?? [],
    equippedItems: state.equippedItems.items ?? [],
    gearSlots: state.gameDefs.gearSlots,
    faction: state.player.faction,
    race: state.player.race,
    classID: state.player.classID,
    raceTags: raceDef?.raceTags ?? [],
    myStats: state.gameDefs.myStats,
    inventoryPendingRefreshes: state.inventory.inventoryPendingRefreshes,
    equippedItemsPendingRefreshes: state.equippedItems.equippedItemsPendingRefreshes,
    classesByNumericID: state.gameDefs.classesByNumericID,
    racesByNumericID: state.gameDefs.racesByNumericID
  };
};

export const ItemIcon = connect(mapStateToProps)(AItemIcon);
