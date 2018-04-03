/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ql, client, events, Tooltip } from '@csegames/camelot-unchained';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';

import eventNames, { EquipItemCallback } from '../../../lib/eventNames';
import Item from '../../Item';
import EmptyItem from '../../EmptyItem';
import TooltipContent, { defaultTooltipStyle } from '../../Tooltip';
import { InventoryItemFragment } from '../../../../../gqlInterfaces';

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
            }}
          />
        </div>
      </Tooltip>
    ) : <div className={css(ss.PopupMiniInventorySlot, custom.PopupMiniInventorySlot)}><EmptyItem /></div>;
  }

  private onEquipItem = () => {
    const { item } = this.props;
    const payload: EquipItemCallback = {
      inventoryItem: item,
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
