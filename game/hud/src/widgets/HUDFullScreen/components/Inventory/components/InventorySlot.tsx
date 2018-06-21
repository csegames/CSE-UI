/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';
import { ql, ContextMenu, Tooltip, events } from '@csegames/camelot-unchained';

import { DrawerCurrentStats } from './Containers/Drawer';
import ContextMenuContent from './ContextMenu/ContextMenuContent';
import TooltipContent, { defaultTooltipStyle } from '../../Tooltip';
import DraggableItemComponent from './DraggableItemComponent';
import EmptyItemDropZone from './EmptyItemDropZone';
import { getDragStore } from '../../../../../components/DragAndDrop/DragStore';
import { InventoryItemFragment, EquippedItemFragment, GearSlotDefRefFragment } from '../../../../../gqlInterfaces';
import { hasEquipmentPermissions, getInventoryDataTransfer } from '../../../lib/utils';
import eventNames, { EquipItemPayload, InventoryDataTransfer } from '../../../lib/eventNames';
import { SlotType, InventorySlotItemDef, CraftingSlotItemDef, ContainerSlotItemDef } from '../../../lib/itemInterfaces';

declare const toastr: any;

export const slotDimensions = 62;

const Container = styled('div')`
  display: inline-block;
  height: 62px;
`;

const ItemWrapper = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  width: ${slotDimensions}px;
  height: ${slotDimensions}px;
  margin: 0 2.5px;
  background: url(${(props: any) => props.slotImage});
  background-size: cover;
`;

export interface InventorySlotProps {
  filtering: boolean;
  item: InventorySlotItemDef & CraftingSlotItemDef & ContainerSlotItemDef;
  itemIndex: number;
  onToggleContainer: (index: number, itemId: string) => void;
  onDropOnZone: (dragItemData: InventoryDataTransfer, dropZoneData: InventoryDataTransfer) => void;
  onMoveStack: (item: InventoryItemFragment, amount: number) => void;
  onRightClick?: (item: InventoryItemFragment) => void;
  equippedItems?: EquippedItemFragment[];
  showGraySlots?: boolean;
  containerIsOpen?: boolean;
  drawerMaxStats?: ql.schema.ContainerDefStat_Single;
  drawerCurrentStats?: DrawerCurrentStats;
  syncWithServer: () => void;
}

export interface InventorySlotState {
  showTooltip: boolean;
  contextMenuVisible: boolean;
}

export class InventorySlot extends React.Component<InventorySlotProps, InventorySlotState> {
  private mouseOver: boolean;

  constructor(props: InventorySlotProps) {
    super(props);
    this.state = {
      showTooltip: false,
      contextMenuVisible: false,
    };
  }

  public render() {
    const { item, equippedItems } = this.props;

    const usesContainer = item.slotType === SlotType.Container || item.slotType === SlotType.CraftingContainer;
    const id = item.itemID || item.groupStackHashID;
    const tooltipVisible = getDragStore().isDragging ? false : (this.state.showTooltip);

    return id ? (
      <Container onContextMenu={this.onRightClick}>
        <Tooltip
          show={tooltipVisible}
          styles={defaultTooltipStyle}
          content={() =>
            <TooltipContent
              item={item.item || (item.stackedItems && item.stackedItems[0])}
              slotType={item.slotType}
              stackedItems={item.stackedItems}
              isVisible={tooltipVisible}
              equippedItems={equippedItems}
              instructions={item.item && item.item.staticDefinition && item.item.staticDefinition.gearSlotSets.length > 0 ?
                'Double click to equip or right click to open context menu' : ''}
            />
          }>
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
              slotImage={this.props.showGraySlots ? 'images/inventory/item-slot-grey.png' : 'images/inventory/item-slot.png'}
              onClick={usesContainer ? this.onToggleContainer : null}
              onMouseOver={this.onMouseOver}
              onMouseLeave={this.onMouseLeave}
              onDoubleClick={!item.disableEquip && !item.disabled ? this.onEquipItem : () => {}}>
                <DraggableItemComponent
                  item={item}
                  filtering={this.props.filtering}
                  onDrop={this.props.onDropOnZone}
                  onDragStart={this.hideTooltip}
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
        </Tooltip>
      </Container>
    ) :
      <ItemWrapper
        slotImage={this.props.showGraySlots ? 'images/inventory/item-slot-grey.png' : 'images/inventory/item-slot.png'}>
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

  public componentDidMount() {
    window.addEventListener('resize', this.hideTooltip);
  }

  public shouldComponentUpdate(nextProps: InventorySlotProps, nextState: InventorySlotState) {
    return this.state.showTooltip !== nextState.showTooltip ||
    this.state.contextMenuVisible !== nextState.contextMenuVisible ||
    this.props.itemIndex !== nextProps.itemIndex ||
    this.props.containerIsOpen !== nextProps.containerIsOpen ||
    this.props.equippedItems !== nextProps.equippedItems ||
    !_.isEqual(this.props.drawerMaxStats, nextProps.drawerMaxStats) ||
    !_.isEqual(this.props.drawerCurrentStats, nextProps.drawerCurrentStats) ||
    !_.isEqual(this.props.item, nextProps.item);
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.hideTooltip);
    this.hideTooltip();
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
    this.setState({ showTooltip: false, contextMenuVisible: true });
  }

  private onContextMenuContentHide = () => {
    if (this.mouseOver) {
      this.setState({ showTooltip: true, contextMenuVisible: false });
    } else {
      this.setState({ contextMenuVisible: false });
    }
  }

  private onMouseOver = () => {
    if (!this.mouseOver) {
      this.mouseOver = true;
      if (!this.state.contextMenuVisible) {
        this.setState({ showTooltip: true });
      }
      const item = this.props.item.item;
      if (!getDragStore().isDragging && item && item.staticDefinition && item.staticDefinition.gearSlotSets.length > 0) {
        const { gearSlotSets } = item.staticDefinition;
        if ((gearSlotSets.length === 1 && this.isRightOrLeftItem(gearSlotSets[0].gearSlots)) ||
          (this.isRightOrLeftItem(gearSlotSets[0].gearSlots) &&
          this.isRightOrLeftItem(gearSlotSets[1].gearSlots))) {

          this.rightOrLeftItemAction((gearSlots) => {
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
    this.setState({ showTooltip: false });
    events.fire(eventNames.onDehighlightSlots);
  }

  private rightOrLeftItemAction = (action: (gearSlots: GearSlotDefRefFragment[]) => void) => {
    const { gearSlotSets } = this.props.item.item.staticDefinition && this.props.item.item.staticDefinition;
    if (gearSlotSets) {
      // Dealing with a right or left weapon/piece of armor
      const equippedItemFirstSlot = _.find(this.props.equippedItems, (item) => {
        return item.gearSlots && this.isRightOrLeftItem(item.gearSlots) &&
          gearSlotSets[0].gearSlots[0].id === item.gearSlots[0].id;
      });
      const equippedItemSecondSlot = _.find(this.props.equippedItems, (item) => {
        return item.gearSlots && this.isRightOrLeftItem(item.gearSlots) &&
          gearSlotSets[1] && gearSlotSets[1].gearSlots[0].id === item.gearSlots[0].id;
      });

      if (gearSlotSets.length === 2 &&
        equippedItemFirstSlot && !equippedItemSecondSlot && !_.isEqual(equippedItemFirstSlot, equippedItemSecondSlot)) {
        action(gearSlotSets[1].gearSlots);
        return;
      } else {
        action(gearSlotSets[0].gearSlots);
        return;
      }
    }
  }

  private isRightOrLeftItem = (gearSlots: GearSlotDefRefFragment[]) => {
    if (gearSlots.length === 1) {
      const firstGearSlotId = gearSlots[0].id;
      return _.includes(firstGearSlotId.toLowerCase(), 'right') ||
      _.includes(firstGearSlotId.toLowerCase(), 'left') ||
      _.includes(firstGearSlotId.toLowerCase(), 'primary') ||
      _.includes(firstGearSlotId.toLowerCase(), 'secondary');
    }
    return false;
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
          this.isRightOrLeftItem(gearSlotSets[0].gearSlots) &&
          this.isRightOrLeftItem(gearSlotSets[1].gearSlots) ||
          (gearSlotSets.length === 1 && this.isRightOrLeftItem(gearSlotSets[0].gearSlots))) {

        // Is a right or left item. If there is already an item equipped in one, then try to equip to the other.
        this.rightOrLeftItemAction((gearSlots) => {
          const payload: EquipItemPayload = {
            inventoryItem: inventoryItemDataTransfer,
            willEquipTo: gearSlots,
          };
          events.fire(eventNames.onEquipItem, payload);
          events.fire(eventNames.onDehighlightSlots);
          this.setState({ showTooltip: false });
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
      this.setState({ showTooltip: false });
    }
  }

  private hideTooltip = () => {
    if (this.state.showTooltip) {
      this.setState({ showTooltip: false });
    }
  }
}

export default InventorySlot;
