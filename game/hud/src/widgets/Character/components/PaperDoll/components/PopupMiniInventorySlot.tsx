/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-06-08 11:10:29
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-07-06 14:30:50
 */

import * as React from 'react';
import { ql, client, events, Tooltip } from 'camelot-unchained';

import eventNames, { EquipItemCallback } from '../../../lib/eventNames';
import Item from '../../Item';
import TooltipContent, { defaultTooltipStyle } from '../../TooltipContent';

export interface PopupMiniInventorySlotStyles {
  PopupMiniInventorySlot: React.CSSProperties;
}

const defaultPopupMiniInventorySlotStyles: PopupMiniInventorySlotStyles = {
  PopupMiniInventorySlot: {
    width: '65px',
    height: '65px',
    border: '1px solid white',
    marginBottom: '10px',
  },
};

export interface PopupMiniInventorySlotProps {
  styles?: Partial<PopupMiniInventorySlotStyles>;
  item: ql.schema.Item;
  gearSlots: ql.schema.GearSlotDefRef[];
  equippedItem: ql.schema.EquippedItem;
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
    return (
      <Tooltip styles={defaultTooltipStyle} content={() =>
        <TooltipContent itemId={item.id} instructions='Left click to equip' />
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
            }}
          />
        </div>
      </Tooltip>
    );
  }

  private onEquipItem = () => {
    const { item, gearSlots, equippedItem } = this.props;
    const payload: EquipItemCallback = {
      inventoryItem: item,
      willEquipTo: gearSlots,
      prevEquippedItem: equippedItem,
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
