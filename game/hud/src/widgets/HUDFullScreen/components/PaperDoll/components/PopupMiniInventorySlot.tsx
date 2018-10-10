/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';

import eventNames, { EquipItemPayload } from '../../../lib/eventNames';
import { getInventoryDataTransfer, hasEquipmentPermissions } from '../../../lib/utils';
import ItemComponent from '../../ItemShared/Item';
import EmptyItem from '../../ItemShared/EmptyItem';
import TooltipContent, { defaultTooltipStyle } from '../../Tooltip';
import { showTooltip, hideTooltip } from 'actions/tooltips';
import { InventoryItem, GearSlotDefRef } from 'gql/interfaces';

declare const toastr: any;

export const itemDimensions = {
  height: 70,
  width: 70,
};

const Slot = styled('div')`
  width: ${itemDimensions.width}px;
  height: ${itemDimensions.height}px;
  border: 1px solid white;
`;

const SlotStyle = {
  Item: {
    width: itemDimensions.width,
    height: itemDimensions.height,
    border: '1px solid white',
  },
};

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
        <ItemComponent
          id={item.id}
          icon={item.staticDefinition.iconUrl}
          styles={SlotStyle}
        />
      </Slot>
    ) : <Slot>
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
    game.selfPlayerState.equipItem(item.id);
    game.trigger(eventNames.onDehighlightSlots);
    game.trigger(eventNames.onEquipItem, payload);
  }

  private onMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    const { item } = this.props;
    game.trigger(eventNames.onHighlightSlots, this.props.gearSlots);
    const content = <TooltipContent item={item} instructions='Left click to equip' />;
    showTooltip({ content, event, styles: defaultTooltipStyle });
  }

  private onMouseLeave = () => {
    game.trigger(eventNames.onDehighlightSlots);
    hideTooltip();
  }
}

export default PopupMiniInventorySlot;
