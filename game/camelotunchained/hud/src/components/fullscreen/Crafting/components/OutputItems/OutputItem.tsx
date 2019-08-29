/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { InventoryItem, ItemDefRef } from 'gql/interfaces';
import { showTooltip, hideTooltip, ShowTooltipPayload } from 'actions/tooltips';
import { getItemUnitCount, getItemQuality } from 'fullscreen/lib/utils';
import { placeholderIcon, MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';
import ItemImage from '../../ItemImage';
import TooltipContent from 'shared/ItemTooltip';
import CraftingDefTooltip from '../CraftingDefTooltip';

// #region ItemContainer constants
const ITEM_CONTAINER_DIMENSIONS = 120;
const ITEM_CONTAINER_BG_DIMENSIONS = 290;
const ITEM_CONTAINER_BG_ALIGNMENT = -90;
// #endregion
const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: ${ITEM_CONTAINER_DIMENSIONS}px;
  height: ${ITEM_CONTAINER_DIMENSIONS}px;
  pointer-events: all;
  cursor: pointer;
  background-size: cover;

  &:after {
    content: '';
    position: absolute;
    width: ${ITEM_CONTAINER_BG_DIMENSIONS}px;
    height: ${ITEM_CONTAINER_BG_DIMENSIONS}px;
    top: ${ITEM_CONTAINER_BG_ALIGNMENT}px;
    left: ${ITEM_CONTAINER_BG_ALIGNMENT}px;
    background-image: url(../images/crafting/uhd/output-item-ring.png);
    background-size: contain;
  }

  @media (max-width: 2560px) {
    width: ${ITEM_CONTAINER_DIMENSIONS * MID_SCALE}px;
    height: ${ITEM_CONTAINER_DIMENSIONS * MID_SCALE}px;

    &:after {
      width: ${ITEM_CONTAINER_BG_DIMENSIONS * MID_SCALE}px;
      height: ${ITEM_CONTAINER_BG_DIMENSIONS * MID_SCALE}px;
      top: ${ITEM_CONTAINER_BG_ALIGNMENT * MID_SCALE}px;
      left: ${ITEM_CONTAINER_BG_ALIGNMENT * MID_SCALE}px;
    }
  }

  @media (max-width: 1920px) {
    width: ${ITEM_CONTAINER_DIMENSIONS * HD_SCALE}px;
    height: ${ITEM_CONTAINER_DIMENSIONS * HD_SCALE}px;

    &:after {
      width: ${ITEM_CONTAINER_BG_DIMENSIONS * HD_SCALE}px;
      height: ${ITEM_CONTAINER_BG_DIMENSIONS * HD_SCALE}px;
      top: ${ITEM_CONTAINER_BG_ALIGNMENT * HD_SCALE}px;
      left: ${ITEM_CONTAINER_BG_ALIGNMENT * HD_SCALE}px;
      background-image: url(../images/crafting/hd/output-item-ring.png);
    }
  }
`;

// #region ItemSlotBG constants
const ITEM_SLOT_BG_DIMENSIONS = 150;
const ITEM_SLOT_BG_TOP = -14;
const ITEM_SLOT_BG_LEFT = -20;
// #endregion
const ItemSlotBG = styled.div`
  position: absolute;
  background-image: url(../images/crafting/uhd/output-item-slot.png);
  background-repeat: no-repeat;
  background-size: contain;
  width: ${ITEM_SLOT_BG_DIMENSIONS}px;
  height: ${ITEM_SLOT_BG_DIMENSIONS}px;
  top: ${ITEM_SLOT_BG_TOP}px;
  left: ${ITEM_SLOT_BG_LEFT}px;

  @media (max-width: 2560px) {
    width: ${ITEM_SLOT_BG_DIMENSIONS * MID_SCALE}px;
    height: ${ITEM_SLOT_BG_DIMENSIONS * MID_SCALE}px;
    top: ${ITEM_SLOT_BG_TOP * MID_SCALE}px;
    left: ${ITEM_SLOT_BG_LEFT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    background-image: url(../images/crafting/hd/output-item-slot.png);
    width: ${ITEM_SLOT_BG_DIMENSIONS * HD_SCALE}px;
    height: ${ITEM_SLOT_BG_DIMENSIONS * HD_SCALE}px;
    top: ${ITEM_SLOT_BG_TOP * HD_SCALE}px;
    left: ${ITEM_SLOT_BG_LEFT * HD_SCALE}px;
  }
`;

const ItemSlot = styled.div`
  width: 100%;
  height: 100%;
`;

const PlaceholderImage = styled.img`
  width: 100%;
  height: 100%;
  pointer-events: none;
  opacity: 0.5;
  object-fit: cover;
`;

export interface Props {
  item: InventoryItem.Fragment | null;
  staticDef: ItemDefRef.Fragment | null;
  jobNumber: number;
  givenName: string | null;
  onClick?: () => void;
}

class OutputItem extends React.Component<Props> {
  public render() {
    const { item } = this.props;
    const icon = this.getIcon();
    return (
      <ItemContainer
        onClick={this.onClick}
        onMouseOver={this.onMouseOver}
        onMouseLeave={this.onMouseLeave}>
        <ItemSlotBG />
        <ItemSlot>
          {item ?
            <ItemImage count={getItemUnitCount(item)} icon={icon} quality={getItemQuality(item)} /> :
            icon ?
            <PlaceholderImage src={icon} /> : null
          }
        </ItemSlot>
      </ItemContainer>
    );
  }

  private getIcon = () => {
    const { item, staticDef } = this.props;
    let icon = '';
    if (staticDef && staticDef.iconUrl) {
      icon = staticDef.iconUrl;
    }

    if (item) {
      icon = item.staticDefinition.iconUrl || placeholderIcon;
    }

    return icon;
  }

  private getItem = () => {
    // Need to inject givenName from job into item
    if (this.props.item) {
      const item: InventoryItem.Fragment = {
        ...this.props.item,
        givenName: this.props.givenName,
      };

      return item;
    }

    return null;
  }

  private onClick = () => {
    this.props.onClick();
    hideTooltip();
  }

  private onMouseOver = (e: React.MouseEvent<HTMLDivElement>) => {
    if (this.props.item) {
      const payload: ShowTooltipPayload = {
        content: <TooltipContent item={this.getItem()} instructions={''} />,
        event: e,
        styles: 'item',
      };
      showTooltip(payload);
    } else if (this.props.staticDef) {
      const payload: ShowTooltipPayload = {
        content: <CraftingDefTooltip recipeDef={this.props.staticDef} />,
        event: e,
      };
      showTooltip(payload);
    }
  }

  private onMouseLeave = () => {
    hideTooltip();
  }
}

export default OutputItem;
