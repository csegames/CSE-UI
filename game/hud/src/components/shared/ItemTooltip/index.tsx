/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';

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
  isAlloyItem,
} from 'fullscreen/lib/utils';
import { SlotType } from 'fullscreen/lib/itemInterfaces';
import {
  InventoryItem,
  EquippedItem,
} from 'gql/interfaces';
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

export const Container = styled.div`
  pointer-events: none;
  position: relative;
  display: flex;
  flex-direction: column;
  color: #ABABAB;
  width: auto;
  overflow: hidden;
`;

export interface TooltipContentProps {
  item: InventoryItem.Fragment;
  instructions: string;
  equippedItems?: EquippedItem.Fragment[];
  stackedItems?: InventoryItem.Fragment[];
  slotType?: SlotType;
}

class ItemTooltipContent extends React.Component<TooltipContentProps> {
  public render() {
    const { item, slotType, equippedItems, stackedItems, instructions } = this.props;
    const itemInfo = item && item.staticDefinition && item.staticDefinition;

    return itemInfo ? (
      <Container>
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

export default ItemTooltipContent;
