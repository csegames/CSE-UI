/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { Tooltip, events } from '@csegames/camelot-unchained';
import { StyleDeclaration, StyleSheet, css } from 'aphrodite';

import eventNames, { UnequipItemPayload } from '../../../lib/eventNames';
import { getEquippedDataTransfer } from '../../../lib/utils';
import { Alignment } from './PopupMiniInventory';
import DraggableEquippedItem from './DraggableEquippedItem';
import TooltipContent, { defaultTooltipStyle } from '../../Tooltip';
import { EquippedItemFragment } from '../../../../../gqlInterfaces';

export interface EquippedItemSlotStyle extends StyleDeclaration {
  equippedItemSlot: React.CSSProperties;
  itemIcon: React.CSSProperties;
  popupMiniInventoryVisible: React.CSSProperties;
  itemContainer: React.CSSProperties;
  highlightSlotContainer: React.CSSProperties;
}

export const defaultEquippedItemSlotStyle: EquippedItemSlotStyle = {
  equippedItemSlot: {
    width: '70px',
    height: '70px',
    border: '1px solid #AAACB1',
    cursor: 'pointer',
    fontSize: '55px',
    lineHeight: '55px',
    backgroundColor: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
  },

  itemIcon: {
    width: '70px',
    height: '70px',
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
};

export interface EquippedItemSlotProps {
  styles?: Partial<EquippedItemSlotStyle>;
  tooltipDisabled: boolean;
  providedEquippedItem: EquippedItemFragment;
  slot: { slotName: string, openingSide: Alignment };
}

export interface EquippedItemSlotState {
  isMouseOver: boolean;
  itemMenuVisible: boolean;
  showTooltip: boolean;
  itemIsOverBGColor: string;
}

export class EquippedItemSlot extends React.PureComponent<EquippedItemSlotProps, EquippedItemSlotState> {
  constructor(props: EquippedItemSlotProps) {
    super(props);
    this.state = {
      isMouseOver: false,
      itemMenuVisible: false,
      showTooltip: false,
      itemIsOverBGColor: null,
    };
  }

  public render() {
    const style = StyleSheet.create(defaultEquippedItemSlotStyle);
    const customStyle = StyleSheet.create(this.props.styles || {});
    const equippedItem = this.props.providedEquippedItem;
    const showTooltip = !this.props.tooltipDisabled &&
                        !this.state.itemMenuVisible &&
                        this.state.isMouseOver;

    const itemId = equippedItem && equippedItem.item.id;
    return (
      <Tooltip show={itemId ? showTooltip : false}
        styles={defaultTooltipStyle} content={() =>
        <TooltipContent
          isVisible={showTooltip}
          item={equippedItem.item}
          instructions='Right click to unequip'
        />
      }>
          <div
            className={css(
              style.equippedItemSlot,
              customStyle.equippedItemSlot,
              this.state.itemMenuVisible && style.highlightSlotContainer,
              this.state.itemMenuVisible && customStyle.highlightSlotContainer,
            )}
            onMouseOver={this.onMouseOverItemSlot}
            onMouseLeave={this.onMouseLeave}
            onContextMenu={this.unequipItem}>
              <DraggableEquippedItem slotName={this.props.slot.slotName} equippedItem={this.props.providedEquippedItem} />
          </div>
      </Tooltip>
    );
  }

  private unequipItem = () => {
    // Fires off onUnequipItem event
    const equippedItem = this.props.providedEquippedItem;
    const equippedItemDataTransfer = getEquippedDataTransfer({
      item: equippedItem.item,
      position: 0,
      location: 'Equipped',
      gearSlots: equippedItem.gearSlots,
    });
    const payload: UnequipItemPayload = {
      item: equippedItemDataTransfer,
    };
    events.fire(eventNames.onUnequipItem, payload);
  }

  private onMouseOverItemSlot = () => {
    this.setState({ isMouseOver: true });
    if (this.state.itemMenuVisible || this.props.tooltipDisabled) {
      this.setState({ showTooltip: false });
    } else {
      this.setState({ showTooltip: true });
    }
  }

  private onMouseLeave = () => {
    this.setState({ isMouseOver: false, showTooltip: false });
  }
}

export default EquippedItemSlot;
