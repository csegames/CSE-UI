/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';

import eventNames, { EquipItemPayload } from 'fullscreen/lib/itemEvents';
import { getInventoryDataTransfer, hasEquipmentPermissions } from 'fullscreen/lib/utils';
import ItemComponent from '../ItemShared/components/Item';
import EmptyItem from '../ItemShared/components/EmptyItem';
import ItemTooltipContent from 'shared/ItemTooltip';
import { showTooltip, hideTooltip } from 'actions/tooltips';
import { InventoryItem, GearSlotDefRef } from 'gql/interfaces';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

declare const toastr: any;

// #region Slot constants
const SLOT_DIMENSIONS = 140;
// #endregion
const Slot = styled.div`
  position: relative;
  pointer-events: all;
  width: ${SLOT_DIMENSIONS}px;
  height: ${SLOT_DIMENSIONS}px;

  @media (max-width: 2560px) {
    width: ${SLOT_DIMENSIONS * MID_SCALE}px;
    height: ${SLOT_DIMENSIONS * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${SLOT_DIMENSIONS * HD_SCALE}px;
    height: ${SLOT_DIMENSIONS * HD_SCALE}px;
  }
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

// #region SlotStyle constants
const SLOT_STYLE_OFFSET = 20;
const SLOT_STYLE_ALIGNMENT = 8;
// #endregion
const SlotStyle = css`
  position: absolute;
  width: ${SLOT_DIMENSIONS - SLOT_STYLE_OFFSET}px;
  height: ${SLOT_DIMENSIONS - SLOT_STYLE_OFFSET}px;
  top: ${SLOT_STYLE_ALIGNMENT}px;
  right: ${SLOT_STYLE_ALIGNMENT}px;
  left: ${SLOT_STYLE_ALIGNMENT}px;
  bottom: ${SLOT_STYLE_ALIGNMENT}px;

  @media (max-width: 2560px) {
    width: ${(SLOT_DIMENSIONS - SLOT_STYLE_OFFSET) * MID_SCALE}px;
    height: ${(SLOT_DIMENSIONS - SLOT_STYLE_OFFSET) * MID_SCALE}px;
    top: ${(SLOT_STYLE_ALIGNMENT) * MID_SCALE}px;
    right: ${(SLOT_STYLE_ALIGNMENT) * MID_SCALE}px;
    left: ${(SLOT_STYLE_ALIGNMENT) * MID_SCALE}px;
    bottom: ${(SLOT_STYLE_ALIGNMENT) * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${(SLOT_DIMENSIONS - SLOT_STYLE_OFFSET) * HD_SCALE}px;
    height: ${(SLOT_DIMENSIONS - SLOT_STYLE_OFFSET) * HD_SCALE}px;
    top: ${(SLOT_STYLE_ALIGNMENT) * HD_SCALE}px;
    right: ${(SLOT_STYLE_ALIGNMENT) * HD_SCALE}px;
    left: ${(SLOT_STYLE_ALIGNMENT) * HD_SCALE}px;
    bottom: ${(SLOT_STYLE_ALIGNMENT) * HD_SCALE}px;
  }
`;

// #region SlotOverlay constants
const SLOT_OVERLAY_ALIGNMENT = 8;
// #endregion
const SlotOverlay = styled.div`
  position: absolute;
  top: ${SLOT_OVERLAY_ALIGNMENT}px;
  right: ${SLOT_OVERLAY_ALIGNMENT}px;
  left: ${SLOT_OVERLAY_ALIGNMENT}px;
  bottom: ${SLOT_OVERLAY_ALIGNMENT}px;
  cursor: pointer;

  @media (max-width: 2560px) {
    top: ${SLOT_OVERLAY_ALIGNMENT * MID_SCALE}px;
    right: ${SLOT_OVERLAY_ALIGNMENT * MID_SCALE}px;
    left: ${SLOT_OVERLAY_ALIGNMENT * MID_SCALE}px;
    bottom: ${SLOT_OVERLAY_ALIGNMENT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    top: ${SLOT_OVERLAY_ALIGNMENT * HD_SCALE}px;
    right: ${SLOT_OVERLAY_ALIGNMENT * HD_SCALE}px;
    left: ${SLOT_OVERLAY_ALIGNMENT * HD_SCALE}px;
    bottom: ${SLOT_OVERLAY_ALIGNMENT * HD_SCALE}px;
  }

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
        <SlotIcon src={'images/inventory/item-slot.png'} />
        <ItemComponent id={item.id} icon={item.staticDefinition.iconUrl} containerClass={SlotStyle} />
        <SlotOverlay />
      </Slot>
    ) : <Slot>
          <SlotIcon src={'images/inventory/item-slot.png'} />
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
    const content = <ItemTooltipContent
      item={item}
      instructions='Left click to equip'
      myCharacterRace={camelotunchained.game.selfPlayerState.race}
      myCharacterFaction={camelotunchained.game.selfPlayerState.faction}
      myCharacterClass={camelotunchained.game.selfPlayerState.classID}
    />;
    showTooltip({ content, event, styles: 'item' });
  }

  private onMouseLeave = () => {
    game.trigger(eventNames.onDehighlightSlots);
    hideTooltip();
  }
}

export default PopupMiniInventorySlot;
