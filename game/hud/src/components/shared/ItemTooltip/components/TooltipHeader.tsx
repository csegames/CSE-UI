/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

import { SlotType } from 'fullscreen/lib/itemInterfaces';
import { getTooltipColor, getContainerInfo } from 'fullscreen/lib/utils';
import { InventoryItem } from 'gql/interfaces';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region Container constants
const CONTAINER_PADDING = 20;
const CONTAINER_DIVIDER_HORIZONTAL_ALIGNMENT = 140;
const CONTAINER_DIVIDER_BOTTOM = -10;
const CONTAINER_DIVIDER_HEIGHT = 20;
// #endregion
const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: ${CONTAINER_PADDING}px;
  border-bottom: 2px solid #292929;
  &:after {
    content: '';
    position: absolute;
    left: ${CONTAINER_DIVIDER_HORIZONTAL_ALIGNMENT}px;
    right: ${CONTAINER_DIVIDER_HORIZONTAL_ALIGNMENT}px;
    bottom: ${CONTAINER_DIVIDER_BOTTOM}px;
    height: ${CONTAINER_DIVIDER_HEIGHT}px;
    background-image: url(../images/item-tooltips/divider_top.png);
    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;
  }

  @media (max-width: 2560px) {
    padding: ${CONTAINER_PADDING * MID_SCALE}px;

    &:after {
      left: ${CONTAINER_DIVIDER_HORIZONTAL_ALIGNMENT * MID_SCALE}px;
      right: ${CONTAINER_DIVIDER_HORIZONTAL_ALIGNMENT * MID_SCALE}px;
      bottom: ${CONTAINER_DIVIDER_BOTTOM * MID_SCALE}px;
      height: ${CONTAINER_DIVIDER_HEIGHT * MID_SCALE}px;
    }
  }

  @media (max-width: 1920px) {
    padding: ${CONTAINER_PADDING * HD_SCALE}px;

    &:after {
      left: ${CONTAINER_DIVIDER_HORIZONTAL_ALIGNMENT * HD_SCALE}px;
      right: ${CONTAINER_DIVIDER_HORIZONTAL_ALIGNMENT * HD_SCALE}px;
      bottom: ${CONTAINER_DIVIDER_BOTTOM * HD_SCALE}px;
      height: ${CONTAINER_DIVIDER_HEIGHT * HD_SCALE}px;
      background-image: url(../images/item-tooltips/divider_top.png);
    }
  }
`;

// #region HeaderOverlay constants
const HEADER_OVERLAY_VEIL_HEIGHT = 212;
// #endregion
const HeaderOverlay = styled.div`
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
    height: ${HEADER_OVERLAY_VEIL_HEIGHT}px;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: url(../images/item-tooltips/title_viel.png);
    background-size: cover;
    background-repeat: no-repeat;
  }

  @media (max-width: 2560px) {
    height: ${HEADER_OVERLAY_VEIL_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    &:after {
      height: ${HEADER_OVERLAY_VEIL_HEIGHT * HD_SCALE}px;
      background-image: url(../images/item-tooltips/title_viel.png);
    }
  }
`;

// #region InfoContainer constants
const INFO_CONTAINER_MAX_WIDTH = 600;
const INFO_CONTAINER_MARGIN_RIGHT = 10;
// #endregion
const InfoContainer = styled.div`
  max-width: ${INFO_CONTAINER_MAX_WIDTH}px;
  margin-right: ${INFO_CONTAINER_MARGIN_RIGHT}px;

  @media (max-width: 2560px) {
    max-width: ${INFO_CONTAINER_MAX_WIDTH * MID_SCALE}px;
    margin-right: ${INFO_CONTAINER_MARGIN_RIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    max-width: ${INFO_CONTAINER_MAX_WIDTH * HD_SCALE}px;
    margin-right: ${INFO_CONTAINER_MARGIN_RIGHT * HD_SCALE}px;
  }
`;

const SubContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

// #region ItemName constants
const ITEM_NAME_FONT_SIZE = 36;
// #endregion
const ItemName = styled.div`
  font-family: Caudex;
  font-size: ${ITEM_NAME_FONT_SIZE}px;
  white-space: wrap;
  color: white;

  @media (max-width: 2560px) {
    font-size: ${ITEM_NAME_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${ITEM_NAME_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region ItemSubtitle constants
const ITEM_SUBTITLE = 28;
// #endregion
const ItemSubtitle = styled.div`
  font-size: ${ITEM_SUBTITLE}px;
  white-space: wrap;
  color: #C3C3C3;

  @media (max-width: 2560px) {
    font-size: ${ITEM_SUBTITLE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${ITEM_SUBTITLE * HD_SCALE}px;
  }
`;

// #region ItemStatInfo constants
const ITEM_STAT_INFO_FONT_SIZE = 28;
// #endregion
const ItemStatInfo = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  text-align: right;
  font-size: ${ITEM_STAT_INFO_FONT_SIZE}px;
  color: ${(props: any) => props.color ? props.color : '#C3C3C3'};

  @media (max-width: 2560px) {
    font-size: ${ITEM_STAT_INFO_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${ITEM_STAT_INFO_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region Icon constants
const ICON_MARGIN_RIGHT = 10;
// #endregion
const Icon = styled.div`
  margin-right: ${ICON_MARGIN_RIGHT}px;
  -webkit-transform: ${(props: any) => props.flip ? 'scaleX(-1)' : ''};
  transform: ${(props: any) => props.flip ? 'scaleX(-1)' : ''};

  @media (max-width: 2560px) {
    margin-right: ${ICON_MARGIN_RIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-right: ${ICON_MARGIN_RIGHT * HD_SCALE}px;
  }
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
        <HeaderOverlay factionColor={getTooltipColor(game.selfPlayerState.faction)} />
        <InfoContainer>
          <ItemName>{item.givenName ? `${item.givenName} (${itemInfo.name})` : itemInfo.name}</ItemName>
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
          {item.stats && item.stats.armor &&
            <ItemStatInfo>
              <Icon className='icon-category-shield'></Icon>
              {item.stats.armor.armorClass}
            </ItemStatInfo>
          }
        </SubContainer>
      </Container>
    );
  }

  public componentDidMount() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  public componentWillUnmount() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keydown', this.handleKeyUp);
  }

  private handleKeyDown = (e: MouseEvent) => {
    if (e.altKey) {
      this.setState({ showAdminInfo: true });
    }
  }

  private handleKeyUp = (e: MouseEvent) => {
    if (this.state.showAdminInfo) {
      this.setState({ showAdminInfo: false });
    }
  }
}

export default TooltipHeader;
