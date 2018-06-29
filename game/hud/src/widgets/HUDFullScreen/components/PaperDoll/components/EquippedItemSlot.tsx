/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';
import { events } from '@csegames/camelot-unchained';

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

const Container = styled('div')`
  width: 70px;
  height: 70px;
  border: 1px solid #AAACB1;
  cursor: pointer;
  font-size: 55px;
  line-height: 55px;
  background-color: rgba(255, 255, 255, 0.3);
  text-align: center;
`;

const HighlightSlotContainer = css`
  border: 1px solid yellow;
`;

export interface EquippedItemSlotProps {
  tooltipDisabled: boolean;
  providedEquippedItem: EquippedItemFragment;
  slot: { slotName: string, openingSide: Alignment };
  disableDrag: boolean;
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
    return (
      <Container
        className={this.state.itemMenuVisible ? HighlightSlotContainer : ''}
        onMouseOver={this.onMouseOverItemSlot}
        onMouseLeave={this.onMouseLeave}
        onContextMenu={this.unequipItem}>
          <DraggableEquippedItem
            disableDrag={this.props.disableDrag}
            slotName={this.props.slot.slotName}
            equippedItem={this.props.providedEquippedItem}
          />
      </Container>
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

  private onMouseOverItemSlot = (event: MouseEvent) => {
    const equippedItem = this.props.providedEquippedItem;
    const itemId = equippedItem && equippedItem.item.id;
    const shouldShowTooltip = !this.props.tooltipDisabled && !this.state.itemMenuVisible && itemId;
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
