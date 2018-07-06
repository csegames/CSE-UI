/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';
import { isEqual, includes } from 'lodash';
import { events } from '@csegames/camelot-unchained';

import { SLOT_DIMENSIONS } from '../../../lib/constants';
import eventNames, { UnequipItemPayload } from '../../../lib/eventNames';
import { getEquippedDataTransfer } from '../../../lib/utils';
import { Alignment } from './PopupMiniInventory';
import DraggableEquippedItem from './DraggableEquippedItem';
import TooltipContent, { defaultTooltipStyle } from '../../Tooltip';
import { showTooltip, hideTooltip } from 'actions/tooltips';
import { EquippedItemFragment } from '../../../../../gqlInterfaces';

export interface EquippedItemSlotStyle {
  equippedItemSlot: React.CSSProperties;
  itemIcon: React.CSSProperties;
  popupMiniInventoryVisible: React.CSSProperties;
  itemContainer: React.CSSProperties;
  highlightSlotContainer: React.CSSProperties;
}

const SlotDecorationPrefix = css`
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: ${SLOT_DIMENSIONS.WIDTH}px;
  height: ${SLOT_DIMENSIONS.HEIGHT}px;
  pointer-events: none;
`;

const Container = styled('div')`
  position: relative;
  width: ${SLOT_DIMENSIONS.WIDTH}px;
  height: ${SLOT_DIMENSIONS.HEIGHT}px;
  cursor: pointer;
  #drag-and-drop-item-container {
    position: relative;
    width: ${SLOT_DIMENSIONS.WIDTH - 11}px;
    height: ${SLOT_DIMENSIONS.HEIGHT - 11}px;
    right: -5px;
    bottom: -5px;
  }
  &:before {
    ${SlotDecorationPrefix}
    width: ${SLOT_DIMENSIONS.WIDTH - 4}px;
    height: ${SLOT_DIMENSIONS.HEIGHT - 4}px;
    background: url(images/paperdoll/slot-gear-bg.png) no-repeat;
    background-size: contain;
  }
  &:after {
    ${SlotDecorationPrefix}
    background: url(images/paperdoll/slot-gear-frame.png) no-repeat;
    background-size: contain;
  }
  &.weapon-slot {
    &:before {
      ${SlotDecorationPrefix}
      width: ${SLOT_DIMENSIONS.WIDTH - 4}px;
      height: ${SLOT_DIMENSIONS.HEIGHT - 4}px;
      top: 1px;
      left: 1px;
      background: url(images/paperdoll/slot-weapon-bg.png) no-repeat;
      background-size: contain;
    }
    &:after {
      ${SlotDecorationPrefix}
      background: url(images/paperdoll/slot-weapon-frame.png) no-repeat;
      background-size: contain;
    }
  }
`;

export interface EquippedItemSlotProps {
  itemMenuVisible: boolean;
  providedEquippedItem: EquippedItemFragment;
  slot: { slotName: string, openingSide: Alignment };
  disableDrag: boolean;
}

export interface EquippedItemSlotState {
  isMouseOver: boolean;
  showTooltip: boolean;
  itemIsOverBGColor: string;
}

export class EquippedItemSlot extends React.Component<EquippedItemSlotProps, EquippedItemSlotState> {
  constructor(props: EquippedItemSlotProps) {
    super(props);
    this.state = {
      isMouseOver: false,
      showTooltip: false,
      itemIsOverBGColor: null,
    };
  }

  public render() {
    const isWeapon = includes(this.props.slot.slotName.toLowerCase(), 'weapon');
    return (
      <Container
        hasItem={this.props.providedEquippedItem}
        className={isWeapon ? 'weapon-slot' : ''}
        onMouseOver={this.onMouseOverItemSlot}
        onMouseLeave={this.onMouseLeave}
        onContextMenu={this.unequipItem}>
          <DraggableEquippedItem
            disableDrag={this.props.disableDrag}
            slotName={this.props.slot.slotName}
            equippedItem={this.props.providedEquippedItem}
            itemMenuVisible={this.props.itemMenuVisible}
          />
      </Container>
    );
  }

  public shouldComponentUpdate(nextProps: EquippedItemSlotProps, nextState: EquippedItemSlotState) {
    return !isEqual(this.state, nextState) || !isEqual(this.props, nextProps);
  }

  private unequipItem = () => {
    // Fires off onUnequipItem event
    if (!this.props.providedEquippedItem) return;

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
    hideTooltip();
    events.fire(eventNames.onUnequipItem, payload);
  }

  private onMouseOverItemSlot = (event: MouseEvent) => {
    const equippedItem = this.props.providedEquippedItem;
    const itemId = equippedItem && equippedItem.item.id;
    const shouldShowTooltip = !this.props.itemMenuVisible && itemId;
    if (shouldShowTooltip) {
      const content = <TooltipContent
        item={this.props.providedEquippedItem.item}
        instructions='Right click to unequip'
      />;
      showTooltip({ content, event, styles: defaultTooltipStyle });
    }
  }

  private onMouseLeave = () => {
    this.setState({ isMouseOver: false, showTooltip: false });
    hideTooltip();
  }
}

export default EquippedItemSlot;
