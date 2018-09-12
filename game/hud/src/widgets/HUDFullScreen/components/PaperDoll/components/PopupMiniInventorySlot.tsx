/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';

import eventNames, { EquipItemPayload } from '../../../lib/itemEvents';
import { getInventoryDataTransfer, hasEquipmentPermissions } from '../../../lib/utils';
import ItemComponent from '../../ItemShared/components/Item';
import EmptyItem from '../../ItemShared/components/EmptyItem';
import ItemTooltipContent, { defaultTooltipStyle } from '../../Tooltip';
import { showTooltip, hideTooltip } from 'actions/tooltips';
import { InventoryItem, GearSlotDefRef } from 'gql/interfaces';

declare const toastr: any;

export const itemDimensions = {
  height: 70,
  width: 70,
};

const Slot = styled.div`
  position: relative;
  pointer-events: all;
  width: ${itemDimensions.width}px;
  height: ${itemDimensions.height}px;
`;

const SlotIcon = styled.img`
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0px;
  right: 0px;
  left: 0px;
  bottom: 0px;
  object-fit: cover;
`;

const SlotStyle = css`
  position: absolute;
  width: ${itemDimensions.width - 10}px;
  height: ${itemDimensions.height - 10}px;
  top: 4px;
  right: 4px;
  left: 4px;
  bottom: 4px;
`;

const SlotOverlay = styled.div`
  position: absolute;
  top: 4px;
  right: 4px;
  left: 4px;
  bottom: 4px;
  cursor: pointer;
  &:hover {
    box-shadow: inset 0 0 10px rgba(255, 255, 255, 0.3);
  }
  &:active {
    box-shadow: none;
  }
`;

export interface PopupMiniInventorySlotProps {
  item: InventoryItem.Fragment;
  gearSlots: GearSlotDefRef[];
}

export interface PopupMiniInventorySlotState {

}

class PopupMiniInventorySlot extends React.Component<PopupMiniInventorySlotProps, PopupMiniInventorySlotState> {
  constructor(props: PopupMiniInventorySlotProps) {
    super(props);
    this.state = {
    };
  }

  public render() {
    const { item } = this.props;
    return item ? (
      <Slot
        onClick={this.onEquipItem}
        onMouseEnter={this.onMouseEnter}
        onMouseLeave={this.onMouseLeave}>
        <SlotIcon src={'../images/inventory/item-slot.png'} />
        <ItemComponent id={item.id} icon={item.staticDefinition.iconUrl} containerClass={SlotStyle} />
        <SlotOverlay />
      </Slot>
    ) : <Slot>
          <SlotIcon src={'../images/inventory/item-slot.png'} />
          <EmptyItem />
        </Slot>;
  }

  private onEquipItem = () => {
    const { item } = this.props;
    if (!hasEquipmentPermissions(item)) {
      // Check if item has equipment permissions
      toastr.error('You do not have equip permissions on this item', 'Oh No!', { timeout: 3000 });
      return;
    }
    const inventoryItemDataTransfer = getInventoryDataTransfer({
      item,
      position: item.location.inContainer ? item.location.inContainer.position : item.location.inventory.position,
      location: item.location.inContainer ? 'inContainer' : 'inventory',
    });
    const payload: EquipItemPayload = {
      newItem: inventoryItemDataTransfer,
      willEquipTo: this.props.gearSlots,
    };
    game.trigger(eventNames.onDehighlightSlots);
    game.trigger(eventNames.onEquipItem, payload);
    hideTooltip();
  }

  private onMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    const { item } = this.props;
    game.trigger(eventNames.onHighlightSlots, this.props.gearSlots);
    const content = <ItemTooltipContent item={item} instructions='Left click to equip' />;
    showTooltip({ content, event, styles: defaultTooltipStyle });
  }

  private onMouseLeave = () => {
    game.trigger(eventNames.onDehighlightSlots);
    hideTooltip();
  }
}

export default PopupMiniInventorySlot;
