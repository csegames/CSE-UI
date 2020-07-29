/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { includes } from 'lodash';

import { GearSlots, MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';
import eventNames, { UnequipItemPayload } from 'fullscreen/lib/itemEvents';
import { getEquippedDataTransfer } from 'fullscreen/lib/utils';
import { Alignment } from './PopupMiniInventory';
import DraggableEquippedItem from './DraggableEquippedItem';
import ItemTooltipContent from 'shared/ItemTooltip';
import { showTooltip, hideTooltip } from 'actions/tooltips';
import { EquippedItem } from 'gql/interfaces';

export interface EquippedItemSlotStyle {
  equippedItemSlot: React.CSSProperties;
  itemIcon: React.CSSProperties;
  popupMiniInventoryVisible: React.CSSProperties;
  itemContainer: React.CSSProperties;
  highlightSlotContainer: React.CSSProperties;
}

export const SLOT_DIMENSIONS = 160;

const SlotDecorationPrefix = `
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: ${SLOT_DIMENSIONS}px;
  height: ${SLOT_DIMENSIONS}px;
  pointer-events: none;

  @media (max-width: 2560px) {
    width: ${SLOT_DIMENSIONS * MID_SCALE}px;
    height: ${SLOT_DIMENSIONS * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${SLOT_DIMENSIONS * HD_SCALE}px;
    height: ${SLOT_DIMENSIONS * HD_SCALE}px;
  }
`;

// #region Container constants
const CONTAINER_D_AND_D_OFFSET = 22;
const CONTAINER_D_AND_D_ALIGNMENT = -10;
// #endregion
const Container = styled.div`
  position: relative;
  width: ${SLOT_DIMENSIONS}px;
  height: ${SLOT_DIMENSIONS}px;
  cursor: pointer;

  #drag-and-drop-item-container {
    position: relative;
    width: ${SLOT_DIMENSIONS - CONTAINER_D_AND_D_OFFSET}px;
    height: ${SLOT_DIMENSIONS - CONTAINER_D_AND_D_OFFSET}px;
    right: ${CONTAINER_D_AND_D_ALIGNMENT}px;
    bottom: ${CONTAINER_D_AND_D_ALIGNMENT}px;
  }


  &:before {
    ${SlotDecorationPrefix}
    width: ${SLOT_DIMENSIONS}px;
    height: ${SLOT_DIMENSIONS}px;
    background: url(../images/paperdoll/slot-gear-bg.png) no-repeat;
    background-size: contain;
  }

  &:after {
    ${SlotDecorationPrefix}
    background: url(../images/paperdoll/slot-gear-frame.png) no-repeat;
    background-size: contain;
  }

  &.readied-weapon {
    &:before {
      ${SlotDecorationPrefix}
      width: ${SLOT_DIMENSIONS}px;
      height: ${SLOT_DIMENSIONS}px;
      background: url(../images/paperdoll/readied-weapon-slot.png) no-repeat;
      background-size: contain;
    }
    &:after {
      ${SlotDecorationPrefix}
      background: url(../images/paperdoll/readied-weapon-slot.png) no-repeat;
      background-size: contain;
      top: 1px;
      left: 1px;
    }
  }

  @media (max-width: 2560px) {
    width: ${SLOT_DIMENSIONS * MID_SCALE}px;
    height: ${SLOT_DIMENSIONS * MID_SCALE}px;

    #drag-and-drop-item-container {
      width: ${(SLOT_DIMENSIONS - CONTAINER_D_AND_D_OFFSET) * MID_SCALE}px;
      height: ${(SLOT_DIMENSIONS - CONTAINER_D_AND_D_OFFSET) * MID_SCALE}px;
      right: ${(CONTAINER_D_AND_D_ALIGNMENT) * MID_SCALE}px;
      bottom: ${(CONTAINER_D_AND_D_ALIGNMENT) * MID_SCALE}px;
    }

    &:before {
      width: ${(SLOT_DIMENSIONS) * MID_SCALE}px;
      height: ${(SLOT_DIMENSIONS) * MID_SCALE}px;
    }
  }

  @media (max-width: 1920px) {
    width: ${SLOT_DIMENSIONS * HD_SCALE}px;
    height: ${SLOT_DIMENSIONS * HD_SCALE}px;

    #drag-and-drop-item-container {
      width: ${(SLOT_DIMENSIONS - CONTAINER_D_AND_D_OFFSET) * HD_SCALE}px;
      height: ${(SLOT_DIMENSIONS - CONTAINER_D_AND_D_OFFSET) * HD_SCALE}px;
      right: ${(CONTAINER_D_AND_D_ALIGNMENT) * HD_SCALE}px;
      bottom: ${(CONTAINER_D_AND_D_ALIGNMENT) * HD_SCALE}px;
    }

    &:before {
      width: ${(SLOT_DIMENSIONS) * HD_SCALE}px;
      height: ${(SLOT_DIMENSIONS) * HD_SCALE}px;
    }
  }
`;

export interface EquippedItemSlotProps {
  isReadiedWeapon: boolean;
  providedEquippedItem: EquippedItem.Fragment;
  slot: { slotName: GearSlots, openingSide: Alignment };
  selectedSlot: { slotName: GearSlots, openingSide: Alignment };
  disableDrag: boolean;
  setSlotInfo: (ref: HTMLDivElement, slot: { slotName: GearSlots, openingSide: Alignment }) => void;

}

export interface EquippedItemSlotState {
  isMouseOver: boolean;
  showTooltip: boolean;
  itemIsOverBGColor: string;
}

export class EquippedItemSlot extends React.PureComponent<EquippedItemSlotProps, EquippedItemSlotState> {
  private ref: HTMLDivElement;
  constructor(props: EquippedItemSlotProps) {
    super(props);
    this.state = {
      isMouseOver: false,
      showTooltip: false,
      itemIsOverBGColor: null,
    };
  }

  public render() {
    const { isReadiedWeapon } = this.props;
    const isWeapon = includes(this.props.slot.slotName.toLowerCase(), 'weapon');
    const weaponClass = isWeapon ? 'weapon-slot' : '';
    const readiedWeaponClass = isReadiedWeapon ? 'readied-weapon' : '';

    return (
      <Container
        ref={(r: HTMLDivElement) => this.ref = r}
        className={`${weaponClass} ${readiedWeaponClass}`}
        onClick={this.onClick}
        onMouseOver={this.onMouseOverItemSlot}
        onMouseLeave={this.onMouseLeave}
        onMouseDown={this.unequipItem}>
          <DraggableEquippedItem
            isReadiedWeapon={this.props.isReadiedWeapon}
            disableDrag={this.props.disableDrag}
            slotName={this.props.slot.slotName}
            equippedItem={this.props.providedEquippedItem}
            itemMenuVisible={this.isItemMenuVisible()}
          />
      </Container>
    );
  }

  private onClick = (e: React.MouseEvent) => {
    if (e.type === 'click') {
      this.props.setSlotInfo(this.ref, this.props.slot);
    }
  }

  private unequipItem = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.button !== 2) return;
    // Fires off onUnequipItem event
    if (!this.props.providedEquippedItem) return;

    const equippedItem = this.props.providedEquippedItem;
    const equippedItemDataTransfer = getEquippedDataTransfer({
      item: equippedItem.item,
      position: 0,
      location: 'equipped',
      gearSlots: equippedItem.gearSlots,
    });
    const payload: UnequipItemPayload = {
      item: equippedItemDataTransfer,
    };
    hideTooltip();
    game.trigger(eventNames.onUnequipItem, payload);
  }

  private onMouseOverItemSlot = (event: React.MouseEvent<HTMLDivElement>) => {
    const equippedItem = this.props.providedEquippedItem;
    const itemId = equippedItem && equippedItem.item.id;
    const shouldShowTooltip = !this.isItemMenuVisible() && itemId;
    if (shouldShowTooltip) {
      const content =
        <ItemTooltipContent
          isReadiedWeapon={this.props.isReadiedWeapon}
          item={this.props.providedEquippedItem.item}
          instructions='Right click to unequip'
          myCharacterRace={camelotunchained.game.selfPlayerState.race}
          myCharacterFaction={camelotunchained.game.selfPlayerState.faction}
          myCharacterClass={camelotunchained.game.selfPlayerState.classID}
        />;
      showTooltip({ content, event, styles: 'item', shouldAnimate: true });
    }
  }

  private onMouseLeave = () => {
    this.setState({ isMouseOver: false, showTooltip: false });
    hideTooltip();
  }

  private isItemMenuVisible = () => {
    if (this.props.selectedSlot && this.props.selectedSlot.slotName === this.props.slot.slotName) {
      return true;
    }

    return false;
  }

}

export default EquippedItemSlot;
