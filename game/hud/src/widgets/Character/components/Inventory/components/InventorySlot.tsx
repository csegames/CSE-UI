/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';
import { ql, ContextMenu, Tooltip, ItemPermissions, events } from 'camelot-unchained';

import { DrawerCurrentStats } from './Containers/Drawer';
import TooltipContent, { defaultTooltipStyle } from '../../TooltipContent';
import ContextMenuContent from './ContextMenuContent';
import DraggableItemComponent from './DraggableItemComponent';
import EmptyItemDropZone from './EmptyItemDropZone';
import { InventoryDataTransfer } from './InventoryBase';
import { getDragStore } from '../../../../../components/DragAndDrop/DragStore';
import { InventoryItemFragment, EquippedItemFragment, GearSlotDefRefFragment } from '../../../../../gqlInterfaces';
import eventNames, { EquipItemCallback } from '../../../lib/eventNames';

export const slotDimensions = 62;

const Container = styled('div')`
  display: inline-block;
  height: 62px;
`;

const ItemContainer = styled('div')`
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

export enum SlotType {
  Empty,
  // Standard - item slot for a general item
  Standard,
  // Stack - item slot with a stack of items
  Stack,
  // Container - a standard item container
  Container,
  // CraftingContainer - item slot which accepts an array of crafting items
  // that will be implicitly containered together
  CraftingContainer,
  // CraftingItem - item slots in a crafting container
  CraftingItem,
}

export interface SlotIndexInterface {
  location: string;
  position: number;
  containerID?: string[];
  drawerID?: string;
}

export interface InventorySlotItemDef {
  itemID?: string;
  slotType: SlotType;
  groupStackHashID?: string;
  stackedItems?: InventoryItemFragment[];
  item?: InventoryItemFragment;
  slotIndex: SlotIndexInterface;
  icon: string;
}

export interface CraftingSlotItemDef {
  itemID?: string;
  slotType: SlotType;
  groupStackHashID?: string;
  icon: string;
  slotIndex: SlotIndexInterface;
  quality?: number;
  itemCount?: number;
  item?: InventoryItemFragment;
  disableDrop?: boolean;
}

export interface ContainerSlotItemDef {
  itemID?: string;
  slotType: SlotType;
  groupStackHashID?: string;
  icon: string;
  slotIndex: SlotIndexInterface;
  containerPermissions?: number;
  quality?: number;
  itemCount?: number;
  item?: InventoryItemFragment;
  disableDrop?: boolean;
}

export interface InventorySlotProps {
  filtering: boolean;
  item: InventorySlotItemDef & CraftingSlotItemDef & ContainerSlotItemDef;
  itemIndex: number;
  onToggleContainer: (index: number, itemId: string) => void;
  onDropOnZone: (dragItemData: InventoryDataTransfer, dropZoneData: InventoryDataTransfer) => void;
  equippedItems?: EquippedItemFragment[];
  showGraySlots?: boolean;
  containerIsOpen?: boolean;
  drawerMaxStats?: ql.schema.ContainerDefStat_Single;
  drawerCurrentStats?: DrawerCurrentStats;
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
    const { item } = this.props;

    const usesContainer = item.slotType === SlotType.Container || item.slotType === SlotType.CraftingContainer;
    const hasViewPermissions = !this.props.item.containerPermissions ||
      this.props.item.containerPermissions & ItemPermissions.ViewContents;
    const id = item.itemID || item.groupStackHashID;

    return id ? (
      <Container>
        <Tooltip
          show={getDragStore().isDragging ? false : this.state.showTooltip}
          styles={defaultTooltipStyle}
          content={() =>
            <TooltipContent
              item={item.item || (item.stackedItems && item.stackedItems[0])}
              shouldOnlyShowPrimaryInfo={item.slotType === SlotType.CraftingContainer}
              instructions={item.item && item.item.staticDefinition && item.item.staticDefinition.gearSlotSets.length > 0 ?
                'Double click to equip or right click to open context menu' : ''}
            />
          }>
          <ContextMenu
            onContextMenuContentShow={this.onContextMenuContentShow}
            onContextMenuContentHide={this.onContextMenuContentHide}
            content={props =>
              <ContextMenuContent
                item={item.item || (item.stackedItems && item.stackedItems[0])} contextMenuProps={props}
              />
            }
          >
            <ItemContainer
              slotImage={this.props.showGraySlots ? 'images/inventory/item_slot_grey.png' : 'images/inventory/item_slot.png'}
              onClick={usesContainer && hasViewPermissions ? this.onToggleContainer : null}
              onMouseEnter={this.onMouseEnter}
              onMouseLeave={this.onMouseLeave}
              onDoubleClick={this.onEquipItem}>
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
            </ItemContainer>
          </ContextMenu>
        </Tooltip>
      </Container>
    ) :
      <ItemContainer
        slotImage={this.props.showGraySlots ? 'images/inventory/item_slot_grey.png' : 'images/inventory/item_slot.png'}>
        <EmptyItemDropZone
          disableDrop={this.props.item.disableDrop}
          slotIndex={this.props.item.slotIndex}
          onDrop={this.props.onDropOnZone}
          containerPermissions={item.containerPermissions}
          drawerMaxStats={this.props.drawerMaxStats}
          drawerCurrentStats={this.props.drawerCurrentStats}
        />
      </ItemContainer>;
  }

  public componentDidMount() {
    window.addEventListener('resize', this.hideTooltip);
  }

  public shouldComponentUpdate(nextProps: InventorySlotProps, nextState: InventorySlotState) {
    return this.state.showTooltip !== nextState.showTooltip ||
    this.state.contextMenuVisible !== nextState.contextMenuVisible ||
    this.props.itemIndex !== nextProps.itemIndex ||
    this.props.containerIsOpen !== nextProps.containerIsOpen ||
    !_.isEqual(this.props.drawerMaxStats, nextProps.drawerMaxStats) ||
    !_.isEqual(this.props.drawerCurrentStats, nextProps.drawerCurrentStats) ||
    !_.isEqual(this.props.item, nextProps.item);
  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.hideTooltip);
    this.hideTooltip();
  }

  private onToggleContainer = () => {
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

  private onMouseEnter = () => {
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
        if (item.item && item.item.staticDefinition.name === 'Jeweled Axe') {
        }
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
    if (item && item.staticDefinition && item.staticDefinition.gearSlotSets.length > 0) {
      const { gearSlotSets } = this.props.item.item.staticDefinition;
      if (gearSlotSets.length === 2 &&
          this.isRightOrLeftItem(gearSlotSets[0].gearSlots) &&
          this.isRightOrLeftItem(gearSlotSets[1].gearSlots) ||
          (gearSlotSets.length === 1 && this.isRightOrLeftItem(gearSlotSets[0].gearSlots))) {

        this.rightOrLeftItemAction((gearSlots) => {
          const payload: EquipItemCallback = {
            inventoryItem: this.props.item.item,
            willEquipTo: gearSlots,
          };
          events.fire(eventNames.onEquipItem, payload);
          events.fire(eventNames.onDehighlightSlots);
          this.setState({ showTooltip: false });
        });
        return;
      }
      const payload: EquipItemCallback = {
        inventoryItem: this.props.item.item,
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
