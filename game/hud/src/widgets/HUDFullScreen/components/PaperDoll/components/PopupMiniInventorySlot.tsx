/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import { ql, client, events, Tooltip } from '@csegames/camelot-unchained';

import eventNames, { EquipItemPayload } from '../../../lib/eventNames';
import { getInventoryDataTransfer, hasEquipmentPermissions } from '../../../lib/utils';
import ItemComponent from '../../ItemShared/Item';
import EmptyItem from '../../ItemShared/EmptyItem';
import TooltipContent, { defaultTooltipStyle } from '../../Tooltip';
import { InventoryItemFragment } from '../../../../../gqlInterfaces';

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
  item: InventoryItemFragment;
  gearSlots: ql.schema.GearSlotDefRef[];
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
      <Tooltip styles={defaultTooltipStyle} content={() =>
        <TooltipContent isVisible={true} item={item} instructions='Left click to equip' />
      }>
        <div
          onClick={this.onEquipItem}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}>
          <ItemComponent
            id={item.id}
            icon={item.staticDefinition.iconUrl}
            styles={SlotStyle}
          />
        </div>
      </Tooltip>
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
      location: item.location.inContainer ? 'Container' : 'Inventory',
    });
    const payload: EquipItemPayload = {
      inventoryItem: inventoryItemDataTransfer,
      willEquipTo: this.props.gearSlots,
    };
    client.EquipItem(item.id);
    events.fire(eventNames.onDehighlightSlots);
    events.fire(eventNames.onEquipItem, payload);
  }

  private onMouseEnter = () => {
    events.fire(eventNames.onHighlightSlots, this.props.gearSlots);
  }

  private onMouseLeave = () => {
    events.fire(eventNames.onDehighlightSlots);
  }
}

export default PopupMiniInventorySlot;
