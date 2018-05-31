/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ql, client, events, Tooltip } from '@csegames/camelot-unchained';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';

import eventNames, { EquipItemCallback } from '../../../lib/eventNames';
import { getInventoryDataTransfer, hasEquipmentPermissions } from '../../../lib/utils';
import Item from '../../Item';
import EmptyItem from '../../EmptyItem';
import TooltipContent, { defaultTooltipStyle } from '../../Tooltip';
import { InventoryItemFragment } from '../../../../../gqlInterfaces';

declare const toastr: any;

export const itemDimensions = {
  height: 70,
  width: 70,
};

export interface PopupMiniInventorySlotStyles extends StyleDeclaration {
  PopupMiniInventorySlot: React.CSSProperties;
}

const defaultPopupMiniInventorySlotStyles: PopupMiniInventorySlotStyles = {
  PopupMiniInventorySlot: {
    width: `${itemDimensions.width}px`,
    height: `${itemDimensions.height}px`,
    border: '1px solid white',
  },
};

export interface PopupMiniInventorySlotProps {
  styles?: Partial<PopupMiniInventorySlotStyles>;
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
    const ss = StyleSheet.create(defaultPopupMiniInventorySlotStyles);
    const custom = StyleSheet.create(this.props.styles || {});
    const { item } = this.props;
    return item ? (
      <Tooltip styles={defaultTooltipStyle} content={() =>
        <TooltipContent isVisible={true} item={item} instructions='Left click to equip' />
      }>
        <div
          onClick={this.onEquipItem}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}>
          <Item
            id={item.id}
            icon={item.staticDefinition.iconUrl}
            styles={{
              Item: defaultPopupMiniInventorySlotStyles.PopupMiniInventorySlot,
            }} />
        </div>
      </Tooltip>
    ) : <div className={css(ss.PopupMiniInventorySlot, custom.PopupMiniInventorySlot)}>
          <EmptyItem />
        </div>;
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
    const payload: EquipItemCallback = {
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
