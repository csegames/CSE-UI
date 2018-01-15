/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';

import { ql, ContextMenu, Tooltip, events } from 'camelot-unchained';
import { StyleDeclaration, StyleSheet, css } from 'aphrodite';

import TooltipContent, { defaultTooltipStyle } from '../../TooltipContent';
import ContextMenuContent from './ContextMenuContent';
import DraggableItemComponent from './DraggableItemComponent';
import EmptyItemDropZone from './EmptyItemDropZone';
import { getDragStore } from '../../../../../components/DragAndDrop/DragStore';

import { InventoryItemFragment } from '../../../../../gqlInterfaces';
import eventNames, { EquipItemCallback } from '../../../lib/eventNames';

export interface InventorySlotStyle extends StyleDeclaration {
  InventorySlot: React.CSSProperties;
  itemContainer: React.CSSProperties;
}

export const slotDimensions = 60;

export const defaultInventorySlotStyle: InventorySlotStyle = {
  InventorySlot: {
    display: 'inline-block',
  },

  itemContainer: {
    overflow: 'hidden',
    position: 'relative',
    width: `${slotDimensions}px`,
    height: `${slotDimensions}px`,
    margin: '0px 2.5px',
    border: '1px solid rgba(200, 200, 200, 0.3)',
    background: 'rgba(200, 200, 200, 0.1)',
    display: 'inline-block',
  },
};

export enum SlotType {
  Empty,
  // Standard - item slot for a general item
  Standard,
  // Stack - item slot with a stack of items
  Stack,
  // Container - a standard container
  Container,
  // CraftingContainer - item slot which accepts an array of crafting items
  // that will be implicitly containered together
  CraftingContainer,
  // CraftingItem - item slots in an item container
  CraftingItem,
}

export interface InventorySlotItemDef {
  itemID?: string;
  slotType: SlotType;
  groupStackHashID?: string;
  stackedItems?: InventoryItemFragment[];
  item?: InventoryItemFragment;
  slotIndex: number;
  icon: string;
}

export interface CraftingSlotItemDef {
  itemID?: string;
  slotType: SlotType;
  groupStackHashID?: string;
  icon: string;
  slotIndex: number;
  quality?: number;
  itemCount?: number;
  item?: InventoryItemFragment;
}

export interface InventorySlotProps {
  styles?: Partial<InventorySlotStyle>;
  filtering: boolean;
  item: InventorySlotItemDef & CraftingSlotItemDef;
  itemIndex: number;
  onToggleContainer: (index: number, itemId: string) => void;
  equippedItems?: ql.schema.EquippedItem[];
  onDropOnZone: (dragItemData: ql.schema.Item, dropZoneData: ql.schema.Item | number) => void;
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
    const ss = StyleSheet.create(defaultInventorySlotStyle);
    const custom = StyleSheet.create(this.props.styles || {});

    const usesContainer = item.slotType === SlotType.Container || item.slotType === SlotType.CraftingContainer;
    const id = item.itemID;

    return id ? (
      <div className={css(ss.InventorySlot, custom.InventorySlot)}>
        <Tooltip
          show={getDragStore().isDragging ? false : this.state.showTooltip}
          styles={defaultTooltipStyle}
          content={() =>
            <TooltipContent
              item={item.item}
              shouldOnlyShowPrimaryInfo={item.slotType === SlotType.CraftingContainer}
              instructions={item.item && item.item.staticDefinition && item.item.staticDefinition.gearSlotSets.length > 0 ?
                'Double click to equip or right click to open context menu' : ''}
            />
          }>
          <ContextMenu
            onContextMenuContentShow={this.onContextMenuContentShow}
            onContextMenuContentHide={this.onContextMenuContentHide}
            content={props => <ContextMenuContent item={item.item} contextMenuProps={props} />}
          >
            <div
              className={css(ss.itemContainer, custom.itemContainer)}
              onClick={usesContainer ? this.onToggleContainer : null}
              onMouseEnter={this.onMouseEnter}
              onMouseLeave={this.onMouseLeave}
              onDoubleClick={this.onEquipItem}>
                <DraggableItemComponent
                  item={item}
                  filtering={this.props.filtering}
                  onDrop={this.props.onDropOnZone}
                  onDragStart={this.hideTooltip}
                  onDragEnd={() => this.mouseOver = false}
                />
            </div>
          </ContextMenu>
        </Tooltip>
      </div>
    ) :
      <div className={css(ss.itemContainer, custom.itemContainer)}>
        <EmptyItemDropZone slotIndex={this.props.item.slotIndex} onDrop={this.props.onDropOnZone} />
      </div>;
  }

  public componentDidMount() {
    window.addEventListener('resize', this.hideTooltip);
  }

  public shouldComponentUpdate(nextProps: InventorySlotProps, nextState: InventorySlotState) {
    return this.state.showTooltip !== nextState.showTooltip ||
    this.state.contextMenuVisible !== nextState.contextMenuVisible ||
    this.props.itemIndex !== nextProps.itemIndex ||
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
      if ((gearSlotSets.length === 1 && this.isRightOrLeftItem(gearSlotSets[0].gearSlots as any)) ||
        (this.isRightOrLeftItem(gearSlotSets[0].gearSlots as any) &&
        this.isRightOrLeftItem(gearSlotSets[1].gearSlots as any))) {

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

  private rightOrLeftItemAction = (action: (gearSlots: ql.schema.GearSlotDefRef[]) => void) => {
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
        action(gearSlotSets[1].gearSlots as ql.schema.GearSlotDefRef[]);
        return;
      } else {
        action(gearSlotSets[0].gearSlots as ql.schema.GearSlotDefRef[]);
        return;
      }
    }
  }

  private isRightOrLeftItem = (gearSlots: ql.schema.GearSlotDefRef[]) => {
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
          this.isRightOrLeftItem(gearSlotSets[0].gearSlots as any) &&
          this.isRightOrLeftItem(gearSlotSets[1].gearSlots as any) ||
          (gearSlotSets.length === 1 && this.isRightOrLeftItem(gearSlotSets[0].gearSlots as any))) {

        this.rightOrLeftItemAction((gearSlots) => {
          const payload: EquipItemCallback = {
            inventoryItem: this.props.item.item as any,
            willEquipTo: gearSlots,
          };
          events.fire(eventNames.onEquipItem, payload);
          events.fire(eventNames.onDehighlightSlots);
          this.setState({ showTooltip: false });
        });
        return;
      }
      const payload: EquipItemCallback = {
        inventoryItem: this.props.item.item as any,
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
