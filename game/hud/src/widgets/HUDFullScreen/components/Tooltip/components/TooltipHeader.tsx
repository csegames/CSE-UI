/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { client } from '@csegames/camelot-unchained';

import { SlotType } from '../../../lib/itemInterfaces';
import { TOOLTIP_PADDING } from '../../../lib/constants';
import { getTooltipColor, getContainerInfo } from '../../../lib/utils';
import { InventoryItem } from 'gql/interfaces';

const Container = styled('div')`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${TOOLTIP_PADDING};
  border-bottom: 2px solid #292929;
  &:after {
    content: '';
    position: absolute;
    left: 70px;
    right: 70px;
    bottom: -5px;
    height: 10px;
    background-image: url(images/item-tooltips/divider_top.png);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }
`;

const HeaderOverlay = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: -1;
  background: linear-gradient(to right, ${(props: any) => props.factionColor}, transparent);
  box-shadow: inset 0 0 20px 2px rgba(0,0,0,0.8);
  &:after {
    content: '';
    position: absolute;
    height: 106px;
    left: 0;
    right: 0;
    bottom: 0;
    background: url(images/item-tooltips/title_viel.png);
    background-size: cover;
    background-repeat: no-repeat;
  }
`;

const InfoContainer = styled('div')`
  max-width: 300px;
  margin-right: 5px;
`;

const SubContainer = styled('div')`
  display: flex;
  flex-direction: column;
`;

const ItemName = styled('div')`
  font-family: Caudex;
  font-size: 18px;
  white-space: wrap;
  color: white;
`;

const ItemSubtitle = styled('div')`
  font-size: 14px;
  white-space: wrap;
  color: #C3C3C3;
`;

const ItemStatInfo = styled('div')`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-align: right;
  font-size: 14px;
  color: ${(props: any) => props.color ? props.color : '#C3C3C3'};
`;

const Icon = styled('div')`
  margin-right: 5px;
  -webkit-transform: ${(props: any) => props.flip ? 'scaleX(-1)' : ''};
  transform: ${(props: any) => props.flip ? 'scaleX(-1)' : ''};
`;

export interface TooltipHeaderProps {
  item: InventoryItem.Fragment;
  slotType?: SlotType;
  stackedItems?: InventoryItem.Fragment[];
}

export interface TooltipHeaderState {
  showAdminInfo: boolean;
}

class TooltipHeader extends React.PureComponent<TooltipHeaderProps, TooltipHeaderState> {
  constructor(props: TooltipHeaderProps) {
    super(props);
    this.state = {
      showAdminInfo: false,
    };
  }

  public render() {
    const { item, slotType, stackedItems } = this.props;
    const containerInfo = slotType && slotType === SlotType.CraftingContainer &&
      stackedItems && getContainerInfo(stackedItems);
    const itemInfo = item.staticDefinition;
    const itemQuality = slotType && slotType === SlotType.CraftingContainer && containerInfo ?
      containerInfo.averageQuality : Number((item.stats.item.quality * 100).toFixed(1));

    return (
      <Container>
        <HeaderOverlay factionColor={getTooltipColor(client.playerState.faction)} />
        <InfoContainer>
          <ItemName>{itemInfo.name}</ItemName>
          {this.state.showAdminInfo && <ItemSubtitle>{item.id}</ItemSubtitle>}
          {itemInfo.description && <ItemSubtitle>({itemInfo.description})</ItemSubtitle>}
          <ItemSubtitle>{itemInfo.itemType}</ItemSubtitle>
        </InfoContainer>
        <SubContainer>
          <ItemStatInfo color={itemQuality < 30 ? '#E2392D' : '#5CF442'}>
            {itemQuality}%
          </ItemStatInfo>
          <ItemStatInfo>
            <Icon className={'icon-ui-weight'}></Icon>
            {Number(item.stats.item.totalMass.toFixed(3))}kg
          </ItemStatInfo>
          <ItemStatInfo color={item.location.equipped ? 'red' : '#555'}>
            <Icon flip className={'icon-ui-weight'}></Icon>
            +{item.stats.item.encumbrance.toFixed(3)}%
          </ItemStatInfo>
        </SubContainer>
      </Container>
    );
  }
}

export default TooltipHeader;
