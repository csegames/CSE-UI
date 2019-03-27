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
import { placeholderIcon } from 'fullscreen/lib/constants';
import ItemImage from '../../ItemImage';
import TooltipContent from 'shared/ItemTooltip';
import CraftingDefTooltip from '../CraftingDefTooltip';
import { MediaBreakpoints } from 'fullscreen/Crafting/lib/MediaBreakpoints';

const ItemContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 60px;
  height: 60px;
  pointer-events: all;
  cursor: pointer;
  background-size: cover;
  @media (max-width: ${MediaBreakpoints.SmallScreen}px) {
    width: 60px;
    height: 60px;
  }

  &:after {
    content: '';
    position: absolute;
    width: 145px;
    height: 145px;
    top: -43px;
    left: -45px;
    background: url(../images/crafting/1080/output-item-ring.png);
    background-size: contain;
    @media (max-width: ${MediaBreakpoints.SmallScreen}px) {
      width: 125px;
      height: 125px;
      left: -33px;
      top: -33px;
    }
  }

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    width: 78px;
    height: 78px;

    &:after {
      background: url(../images/crafting/4k/output-item-ring.png);
      background-size: contain;
      width: 189px;
      height: 189px;
      left: -56px;
      top: -56px;
    }
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    width: 155px;
    height: 155px;

    &:after {
      background: url(../images/crafting/4k/output-item-ring.png);
      background-size: contain;
      width: 348px;
      height: 348px;
      left: -89px;
      top: -92px;
    }
  }
`;

const ItemSlotBG = styled.div`
  position: absolute;
  background: url(../images/crafting/1080/output-item-slot.png) no-repeat;
  background-size: contain;
  width: 75px;
  height: 75px;
  top: -7px;
  left: -10px;

  @media (max-width: ${MediaBreakpoints.SmallScreen}px) {
    width: 60px;
    height: 60px;
    top: 1px;
    left: 0;
  }

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    background: url(../images/crafting/4k/output-item-slot.png) no-repeat;
    background-size: contain;
    width: 98px;
    height: 98px;
    left: -9px;
    top: -9px;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    background: url(../images/crafting/4k/output-item-slot.png) no-repeat;
    background-size: contain;
    width: 180px;
    height: 180px;
    left: -5px;
    top: -5px;
  }
`;

const ItemSlot = styled.div`
  width: 100%;
  height: 100%;

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    position: relative;
    left: 5px;
    top: 7px;
  }
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
