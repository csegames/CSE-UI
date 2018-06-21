/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import { client } from '@csegames/camelot-unchained';

import TooltipHeader from './components/TooltipHeader';
import TooltipArmorInfo from './components/TooltipArmorInfo';
import TooltipWeaponInfo from './components/TooltipWeaponInfo';
import TooltipSubstanceInfo from './components/TooltipSubstanceInfo';
import TooltipContainerInfo from './components/TooltipContainerInfo';
import TooltipBuildingBlockInfo from './components/TooltipBuildingBlockInfo';
import TooltipFooter from './components/TooltipFooter';
import {
  isContainerItem,
  isSubstanceItem,
  isBuildingBlockItem,
  isArmorItem,
  isWeaponItem,
  getTooltipColor,
} from '../../lib/utils';
import { SlotType } from '../../lib/itemInterfaces';
import { InventoryItemFragment, EquippedItemFragment } from '../../../../gqlInterfaces';

export const defaultTooltipStyle = {
  tooltip: {
    boxShadow: '0px',
    padding: '0px',
    border: '0px',
    background: 'none',
    maxWidth: '500px',
    maxHeight: '750px',
  },
  tooltipFixed: {
    boxShadow: '0px',
    padding: '0px',
    border: '0px',
    background: 'none',
    width: '750px',
    maxWidth: '750px',
  },
};

const Container = styled('div')`
  pointer-events: none;
  position: relative;
  display: flex;
  flex-direction: column;
  border-width: 2px;
  border-style: solid;
  border-image: linear-gradient(to bottom, ${(props: any) => props.factionColor}, transparent);
  border-image-slice: 1;
  background: url(images/item-tooltips/bg.png);
  background-size: cover;
  -webkit-mask-image: url(images/item-tooltips/ui-mask.png);
  -webkit-mask-size: cover;
  color: #ABABAB;
  width: auto;
  overflow: hidden;
  &:before {
    content: '';
    position: absolute;
    top: 0px;
    left: 0px;
    background: url(images/item-tooltips/ornament_left.png);
    width: 35px;
    height: 35px;
  }
  &:after {
    content: '';
    position: absolute;
    top: 0px;
    right: 0px;
    background: url(images/item-tooltips/ornament_right.png);
    width: 35px;
    height: 35px;
  }
`;

export interface TooltipContentProps {
  item: InventoryItemFragment;
  isVisible: boolean;
  equippedItems?: EquippedItemFragment[];
  instructions?: string;
  stackedItems?: InventoryItemFragment[];
  slotType?: SlotType;
}

class TooltipContent extends React.Component<TooltipContentProps> {
  public render() {
    const { item, equippedItems, slotType, stackedItems } = this.props;
    const itemInfo = item && item.staticDefinition && item.staticDefinition;

    return itemInfo ? (
      <Container factionColor={getTooltipColor(client.playerState.faction)}>
        <TooltipHeader item={item} slotType={slotType} stackedItems={stackedItems} />
        {isArmorItem(item) && <TooltipArmorInfo item={item} equippedItems={equippedItems} />}
        {isWeaponItem(item) && <TooltipWeaponInfo item={item} equippedItems={equippedItems} />}
        {isContainerItem(item) && <TooltipContainerInfo item={item} />}
        {isSubstanceItem(item) && (!stackedItems || stackedItems.length === 1) && <TooltipSubstanceInfo item={item} />}
        {isBuildingBlockItem(item) && <TooltipBuildingBlockInfo item={item} />}
        <TooltipFooter item={item} slotType={slotType} />
      </Container>
    ) : <div>This item does not exist anymore.</div>;
  }

  public shouldComponentUpdate(nextProps: TooltipContentProps) {
    const showing = !this.props.isVisible && nextProps.isVisible;
    const hiding = this.props.isVisible && !nextProps.isVisible;
    return showing || hiding;
  }
}

export default TooltipContent;
