/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';
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
  isAlloyItem,
} from '../../lib/utils';
import { SlotType } from '../../lib/itemInterfaces';
import { InventoryItemFragment, EquippedItemFragment } from '../../../../gqlInterfaces';
import TooltipAlloyInfo from './components/TooltipAlloyInfo';

export const defaultTooltipStyle: { tooltip: string } = {
  tooltip: css`
    box-shadow: 0px;
    padding: 0px;
    border: 0px;
    background: none;
    max-width: 500px;
    max-height: 750px;
  `,
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
  instructions: string;
  equippedItems?: EquippedItemFragment[];
  stackedItems?: InventoryItemFragment[];
  slotType?: SlotType;
}

class TooltipContent extends React.Component<TooltipContentProps> {
  public render() {
    const { item, slotType, equippedItems, stackedItems, instructions } = this.props;
    const itemInfo = item && item.staticDefinition && item.staticDefinition;

    return itemInfo ? (
      <Container factionColor={getTooltipColor(client.playerState.faction)}>
        <TooltipHeader item={item} slotType={slotType} stackedItems={stackedItems} />
        {isArmorItem(item) && <TooltipArmorInfo item={item} equippedItems={equippedItems} />}
        {isWeaponItem(item) && <TooltipWeaponInfo item={item} equippedItems={equippedItems} />}
        {isContainerItem(item) && <TooltipContainerInfo item={item} />}
        {isSubstanceItem(item) && (!stackedItems || stackedItems.length === 1) && <TooltipSubstanceInfo item={item} />}
        {isAlloyItem(item) && (!stackedItems || stackedItems.length === 1) && <TooltipAlloyInfo item={item} />}
        {isBuildingBlockItem(item) && <TooltipBuildingBlockInfo item={item} />}
        <TooltipFooter item={item} instructions={instructions} />
      </Container>
    ) : <div>This item does not exist anymore.</div>;
  }
}

export default TooltipContent;
