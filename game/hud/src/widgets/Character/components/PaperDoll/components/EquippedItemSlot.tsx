/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-03-23 17:42:12
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-07-18 12:06:27
 */

import * as React from 'react';
import * as _ from 'lodash';

import TooltipContent, { defaultTooltipStyle } from '../../TooltipContent';

import { ListenerInfo, Tooltip, client, events, ql } from 'camelot-unchained';
import { StyleDeclaration, StyleSheet, css } from 'aphrodite';
import eventNames, {
  EquipItemCallback,
  UnequipItemCallback,
  UpdateInventoryItemsOnEquipCallback,
} from '../../../lib/eventNames';

import ItemsMenu from './ItemsMenu';
import { defaultSlotIcons } from '../../../lib/constants';

export interface EquippedItemSlotStyle extends StyleDeclaration {
  equippedItemSlot: React.CSSProperties;
  popupMiniInventoryVisible: React.CSSProperties;
  itemContainer: React.CSSProperties;
  highlightSlotContainer: React.CSSProperties;
  highlightSlotOverlay: React.CSSProperties;
  defaultSlotIcon: React.CSSProperties;
}

export const defaultEquippedItemSlotStyle: EquippedItemSlotStyle = {
  equippedItemSlot: {
    width: '70px',
    height: '70px',
    border: '1px solid #AAACB1',
    cursor: 'pointer',
    fontSize: '65px',
    lineHeight: '65px',
    backgroundColor: 'rgba(255,255,255,0.3)',
  },
  popupMiniInventoryVisible: {
    border: '1px solid yellow',
  },
  itemContainer: {
    position: 'relative',
  },
  highlightSlotContainer: {
    border: '1px solid yellow',
  },
  highlightSlotOverlay: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    boxShadow: 'inset 0 0 15px 5px yellow',
    top: 0,
    left: 0,
  },
  defaultSlotIcon: {
    width: '65px',
    height: '65px',
  },
};

export interface EquippedItemSlotProps {
  styles?: Partial<EquippedItemSlotStyle>;
  openingSide: string;
  slotName: string;
  providedEquippedItem: ql.schema.EquippedItem;
}

export interface EquippedItemSlotState {
  itemMenuVisible: boolean;
  highlightSlot: boolean;
  equippedItem: ql.schema.EquippedItem;
  showTooltip: boolean;
}

export class EquippedItemSlot extends React.Component<EquippedItemSlotProps, EquippedItemSlotState> {

  private mouseOverElement: boolean;
  private onEquipListener: ListenerInfo;
  private onUnequipListener: ListenerInfo;
  private onHighlightListener: ListenerInfo;
  private onDehighlightListener: ListenerInfo;

  constructor(props: EquippedItemSlotProps) {
    super(props);
    this.state = {
      itemMenuVisible: false,
      highlightSlot: false,
      equippedItem: null,
      showTooltip: false,
    };
  }

  public render() {
    const style = StyleSheet.create(defaultEquippedItemSlotStyle);
    const customStyle = StyleSheet.create(this.props.styles || {});
    const { equippedItem, highlightSlot, showTooltip } = this.state;
    const { openingSide, slotName } = this.props;
    // const { equippedItemSlot, popupMiniInventoryVisible } = defaultEquippedItemSlotStyle;

    const itemId = equippedItem && equippedItem.item.id;
    const iconUrl = equippedItem &&
      equippedItem.item.staticDefinition.iconUrl || `${defaultSlotIcons[slotName]} \
      ${css(style.defaultSlotIcon, customStyle.defaultSlotIcon)}`;
    const placeholderIcon = 'images/unknown-item.jpg';
    return (
      <ItemsMenu
        inventoryState={null}
        visible={this.state.itemMenuVisible}
        slotName={slotName}
        openingSide={openingSide}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}
        equippedItem={equippedItem}
      >
        <Tooltip show={itemId ? showTooltip : false} styles={defaultTooltipStyle} content={() =>
          <TooltipContent
            itemId={itemId}
            slotName={slotName && slotName}
            instructions='Double click to unequip'
          />
        }>
          <div
            className={css(style.itemContainer, customStyle.itemContainer)}
            onClick={this.showItemMenuVisibility}
            onDoubleClick={this.onDoubleClick}>
            {equippedItem ?
              <img
                src={iconUrl || placeholderIcon}
                className={css(style.equippedItemSlot, customStyle.equippedItemSlot)}
              /> :
                <div className={`${css(style.equippedItemSlot, customStyle.equippedItemSlot)} ${iconUrl}`} />}
            {highlightSlot && <div className={css(style.highlightSlotOverlay, customStyle.highlightSlotOverlay)} />}
          </div>
        </Tooltip>
      </ItemsMenu>
    );
  }

  public componentDidMount() {
    window.addEventListener('mousedown', this.onMouseDownOutsideComp);
    this.onUnequipListener = events.on(eventNames.onUnequipItem, this.onUnequipItem);
    this.onEquipListener = events.on(eventNames.onEquipItem, this.onEquipItem);
    this.onHighlightListener = events.on(eventNames.onHighlightSlots, this.onHighlightSlots);
    this.onDehighlightListener = events.on(eventNames.onDehighlightSlots, this.onDehighlightSlots);
    this.setEquippedItemSlot(this.props.providedEquippedItem);
  }

  public componentWillReceiveProps(nextProps: EquippedItemSlotProps) {
    if (!_.isEqual(nextProps.providedEquippedItem, this.state.equippedItem)) {
      this.setEquippedItemSlot(nextProps.providedEquippedItem);
    }
  }

  public componentWillUnmount() {
    window.removeEventListener('mousedown', this.onMouseDownOutsideComp);
    events.off(this.onUnequipListener);
    events.off(this.onEquipListener);
    events.off(this.onHighlightListener);
    events.off(this.onDehighlightListener);
  }

  private setEquippedItemSlot = (equippedItem: ql.schema.EquippedItem) => {
    this.setState({ equippedItem });
  }

  private onDoubleClick = () => {
    // Fires off onUnequipItem event
    const { equippedItem } = this.state;
    const payload: UnequipItemCallback = equippedItem;
    client.UnequipItem(equippedItem.item.id);
    events.fire(eventNames.onUnequipItem, payload);
  }

  private onUnequipItem = (equippedItem: UnequipItemCallback) => {
    // Listens to onUnequipItem event. We need this in order to update other slots affected by the unequip.
    const { slotName } = this.props;
    if (_.isEqual(this.state.equippedItem, equippedItem)) {
      if (_.find(equippedItem.gearSlots, gearSlot => slotName === gearSlot.id)) {
        const payload: any = { equippedItem };
        events.fire(eventNames.updateInventoryItems, payload);
        
        this.setState({ equippedItem: null });
      }
    }
  }

  private onEquipItem = (payload: EquipItemCallback) => {
    const { equippedItem } = this.state;
    const { slotName } = this.props;
    const { inventoryItem, willEquipTo } = payload;
    const shouldUpdate = _.find(willEquipTo, (gearSlot) => {
      return slotName === gearSlot.id ||
      equippedItem && _.find(equippedItem.gearSlots, equippedSlot => equippedSlot.id === gearSlot.id);
    });
    let newItem: any = null;
    if (shouldUpdate) {
      // Should equip to slots
      willEquipTo.forEach((gearSlot: ql.schema.GearSlotDefRef) => {
        if (gearSlot.id === this.props.slotName) {
          newItem = { item: inventoryItem, gearSlots: willEquipTo };
        }
      });

      // Update inventory item once if there is an equipped item
      const payload: UpdateInventoryItemsOnEquipCallback = {
        equippedItem,
        inventoryItem: inventoryItem as any,
      };
      events.fire(eventNames.updateInventoryItems, payload);
      

      // Return itemId and iconUrl, can be empty if the inventoryItem doesn't fill up slots current equippedItem did.
      if (equippedItem) {
        equippedItem.gearSlots.forEach((gearSlot) => {
          if (gearSlot.id === this.props.slotName) {
            this.setState({ equippedItem: newItem });
            return;
          }
        });
      } else {
        this.setState({ equippedItem: newItem });
        return;
      }
    }
  }

  private onHighlightSlots = (gearSlots: ql.schema.GearSlotDefRef[]) => {
    if (_.find(gearSlots, (gearSlot: ql.schema.GearSlotDefRef) => this.props.slotName === gearSlot.id)) {
      this.setState({ highlightSlot: true });
    }
  }

  private onDehighlightSlots = () => {
    if (this.state.highlightSlot) this.setState({ highlightSlot: false });
  }

  private showItemMenuVisibility = () => {
    this.setState({ itemMenuVisible: !this.state.itemMenuVisible, showTooltip: this.state.itemMenuVisible });
  }

  private onMouseEnter = () => {
    const { itemMenuVisible } = this.state;
    if (itemMenuVisible) {
      this.setState({ showTooltip: false });
    } else {
      this.setState({ showTooltip: true });
    }
    this.mouseOverElement = true;
  }

  private onMouseLeave = () => {
    this.setState({ showTooltip: false });
    this.mouseOverElement = false;
  }

  private onMouseDownOutsideComp = () => {
    if (!this.mouseOverElement && this.state.itemMenuVisible) {
      this.setState({ itemMenuVisible: false, showTooltip: false });
    }
  }
}

export default EquippedItemSlot;
