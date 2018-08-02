/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';
import { ql, ContextMenu, events } from '@csegames/camelot-unchained';

import { DrawerCurrentStats } from './Containers/Drawer';
import ContextMenuContent from './ContextMenu/ContextMenuContent';
import DraggableItemComponent from './DraggableItemComponent';
import EmptyItemDropZone from './EmptyItemDropZone';
import { getDragStore } from '../../../../../components/DragAndDrop/DragStore';
import { InventoryItemFragment, GearSlotDefRefFragment } from '../../../../../gqlInterfaces';
import { hasEquipmentPermissions, getInventoryDataTransfer, isRightOrLeftItem } from '../../../lib/utils';
import eventNames, { EquipItemPayload, InventoryDataTransfer } from '../../../lib/eventNames';
import { SlotType, SlotItemDefType } from '../../../lib/itemInterfaces';

declare const toastr: any;

export const slotDimensions = 62;

const Container = styled('div')`
  display: inline-block;
  height: 62px;
`;

const ItemWrapper = styled('div')`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  width: ${slotDimensions}px;
  height: ${slotDimensions}px;
  margin: 0 2.5px;
`;

const ItemImage = styled('img')`
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
`;

export interface InventorySlotProps {
  filtering: boolean;
  item: SlotItemDefType;
  itemIndex: number;
  onToggleContainer: (index: number, itemId: string) => void;
  onDropOnZone: (dragItemData: InventoryDataTransfer, dropZoneData: InventoryDataTransfer) => void;
  onMoveStack: (item: InventoryItemFragment, amount: number) => void;
  showTooltip: (item: SlotItemDefType, event: MouseEvent) => void;
  hideTooltip: () => void;
  onRightOrLeftItemAction: (item: InventoryItemFragment, action: (gearSlots: GearSlotDefRefFragment[]) => void) => void;
  onRightClick?: (item: InventoryItemFragment) => void;
  showGraySlots?: boolean;
  containerIsOpen?: boolean;
  drawerMaxStats?: ql.schema.ContainerDefStat_Single;
  drawerCurrentStats?: DrawerCurrentStats;
  syncWithServer: () => void;
}

export interface InventorySlotState {
  contextMenuVisible: boolean;
}

export class InventorySlot extends React.Component<InventorySlotProps, InventorySlotState> {
  private mouseOver: boolean;

  constructor(props: InventorySlotProps) {
    super(props);
    this.state = {
      contextMenuVisible: false,
    };
  }

  public render() {
    const { item } = this.props;
    const usesContainer = item.slotType === SlotType.Container || item.slotType === SlotType.CraftingContainer;
    const id = item.itemID || item.groupStackHashID;

    return id ? (
      <Container onContextMenu={this.onRightClick}>
        <ContextMenu
          onContextMenuContentShow={!this.props.onRightClick && this.onContextMenuContentShow}
          onContextMenuContentHide={!this.props.onRightClick && this.onContextMenuContentHide}
          content={props =>
            !item.disableContextMenu &&
              <ContextMenuContent
                item={item.item || (item.stackedItems && item.stackedItems[0])}
                onMoveStack={this.props.onMoveStack}
                contextMenuProps={props}
                syncWithServer={this.props.syncWithServer}
                containerID={typeof item.slotIndex !== 'number' && item.slotIndex.containerID}
                drawerID={typeof item.slotIndex !== 'number' && item.slotIndex.drawerID}
              />
          }
        >
          <ItemWrapper
            onClick={usesContainer ? this.onToggleContainer : null}
            onMouseOver={this.onMouseOver}
            onMouseLeave={this.onMouseLeave}
            onDoubleClick={!item.disableEquip && !item.disabled ? this.onEquipItem : () => {}}>
              <ItemImage
                src={this.props.showGraySlots ? 'images/inventory/item-slot-grey.png' : 'images/inventory/item-slot.png'}
              />
              <DraggableItemComponent
                item={item}
                filtering={this.props.filtering}
                onDrop={this.props.onDropOnZone}
                onDragStart={this.props.hideTooltip}
                onDragEnd={() => this.mouseOver = false}
                containerID={typeof item.slotIndex !== 'number' && item.slotIndex.containerID}
                drawerID={typeof item.slotIndex !== 'number' && item.slotIndex.drawerID}
                containerPermissions={item.containerPermissions}
                containerIsOpen={this.props.containerIsOpen}
                drawerMaxStats={this.props.drawerMaxStats}
                drawerCurrentStats={this.props.drawerCurrentStats}
              />
          </ItemWrapper>
        </ContextMenu>
      </Container>
    ) :
      <ItemWrapper>
        <ItemImage
          src={this.props.showGraySlots ? 'images/inventory/item-slot-grey.png' : 'images/inventory/item-slot.png'}
        />
        <EmptyItemDropZone
          slotType={this.props.item.slotType}
          disableDrop={this.props.item.disableDrop}
          slotIndex={this.props.item.slotIndex}
          onDrop={this.props.onDropOnZone}
          containerPermissions={item.containerPermissions}
          drawerMaxStats={this.props.drawerMaxStats}
          drawerCurrentStats={this.props.drawerCurrentStats}
          item={this.props.item.item}
        />
      </ItemWrapper>;
  }

  public shouldComponentUpdate(nextProps: InventorySlotProps, nextState: InventorySlotState) {
    return this.state.contextMenuVisible !== nextState.contextMenuVisible ||
    this.props.itemIndex !== nextProps.itemIndex ||
    this.props.containerIsOpen !== nextProps.containerIsOpen ||
    !_.isEqual(this.props.drawerMaxStats, nextProps.drawerMaxStats) ||
    !_.isEqual(this.props.drawerCurrentStats, nextProps.drawerCurrentStats) ||
    !_.isEqual(this.props.item, nextProps.item);
  }

  private onRightClick = () => {
    if (this.props.onRightClick) {
      this.onMouseLeave();
      this.props.onRightClick(this.props.item.item);
    }
  }

  private onToggleContainer = (e: React.MouseEvent<HTMLDivElement>) => {
    this.props.onToggleContainer(this.props.itemIndex, this.props.item.itemID);
  }

  private onContextMenuContentShow = () => {
    this.props.hideTooltip();
    this.setState({ contextMenuVisible: true });
  }

  private onContextMenuContentHide = () => {
    if (this.mouseOver) {
      this.setState({ contextMenuVisible: false });
    } else {
      this.setState({ contextMenuVisible: false });
    }
  }

  private onMouseOver = (event: MouseEvent) => {
    if (!this.mouseOver) {
      this.mouseOver = true;
      if (!this.state.contextMenuVisible && !getDragStore().isDragging) {
        this.props.showTooltip(this.props.item, event);
      }
      const item = this.props.item.item;
      if (!getDragStore().isDragging && item && item.staticDefinition && item.staticDefinition.gearSlotSets.length > 0) {
        const { gearSlotSets } = item.staticDefinition;
        if ((gearSlotSets.length === 1 && isRightOrLeftItem(gearSlotSets[0].gearSlots)) ||
          (isRightOrLeftItem(gearSlotSets[0].gearSlots) && isRightOrLeftItem(gearSlotSets[1].gearSlots))) {

          this.props.onRightOrLeftItemAction(item, (gearSlots) => {
            events.fire(eventNames.onHighlightSlots, gearSlots);
          });
        } else {
          events.fire(eventNames.onHighlightSlots, this.props.item.item.staticDefinition.gearSlotSets[0].gearSlots);
        }
      }
    }
  }

  private onMouseLeave = () => {
    this.mouseOver = false;
    this.props.hideTooltip();
    events.fire(eventNames.onDehighlightSlots);
  }

  private onEquipItem = () => {
    const item = this.props.item.item;
    const inventoryItemDataTransfer = getInventoryDataTransfer({
      item,
      position: item.location.inContainer ? item.location.inContainer.position : item.location.inventory.position,
      location: item.location.inContainer ? 'Container' : 'Inventory',
      containerID: this.props.item.slotIndex.containerID,
      drawerID: this.props.item.slotIndex.drawerID,
    });

    // Hide tooltip
    this.props.hideTooltip();

    // Left or Right item
    if (item && item.staticDefinition && item.staticDefinition.gearSlotSets.length > 0) {
      // Check if has permissions
      if (!hasEquipmentPermissions(item)) {
        // Item does not have equip permissions
        if (item.equiprequirement && item.equiprequirement.requirementDescription) {
          toastr.error(item.equiprequirement.requirementDescription, 'Oh No!', { timeout: 3000 });
        } else {
          toastr.error('You do not have equip permissions on this item', 'Oh No!', { timeout: 3000 });
        }
        return;
      }
      const { gearSlotSets } = this.props.item.item.staticDefinition;
      if (gearSlotSets.length === 2 &&
          isRightOrLeftItem(gearSlotSets[0].gearSlots) && isRightOrLeftItem(gearSlotSets[1].gearSlots) ||
          (gearSlotSets.length === 1 && isRightOrLeftItem(gearSlotSets[0].gearSlots))) {

        // Is a right or left item. If there is already an item equipped in one, then try to equip to the other.
        this.props.onRightOrLeftItemAction(item, (gearSlots) => {
          const payload: EquipItemPayload = {
            inventoryItem: inventoryItemDataTransfer,
            willEquipTo: gearSlots,
          };
          events.fire(eventNames.onEquipItem, payload);
          events.fire(eventNames.onDehighlightSlots);
        });
        return;
      }

      // No special handling for this item
      const payload: EquipItemPayload = {
        inventoryItem: inventoryItemDataTransfer,
        willEquipTo: this.props.item.item.staticDefinition.gearSlotSets[0].gearSlots,
      };
      events.fire(eventNames.onEquipItem, payload);
      events.fire(eventNames.onDehighlightSlots);
    }
  }
}

export default InventorySlot;
