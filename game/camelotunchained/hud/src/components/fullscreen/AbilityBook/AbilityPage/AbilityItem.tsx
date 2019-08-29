/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { AbilityBookQuery } from 'gql/interfaces';
import { AbilityComponent } from './AbilityComponent';
import { useAbilityBuilderReducer } from 'services/session/AbilityBuilderState';
import { Tooltip } from 'shared/Tooltip';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region ListItem constants
const LIST_ITEM_PADDING = 20;
const LIST_ITEM_BOTTOM_PADDING = 50;
// #endregion
const ListItem = styled.div`
  position: relative;
  display: flex;
  align-items: flex-start;
  width: calc(100% - ${LIST_ITEM_PADDING * 2}px);
  height: calc(100% - ${LIST_ITEM_PADDING + LIST_ITEM_BOTTOM_PADDING}px);
  padding ${LIST_ITEM_PADDING}px ${LIST_ITEM_PADDING}px ${LIST_ITEM_BOTTOM_PADDING}px ${LIST_ITEM_PADDING}px;
  background-image: url(../images/abilitybook/hd/ability-border.png);
  background-size: 100% 100%;
  box-shadow: inset 0 0 50px 19px rgba(126, 95, 72, 0.2);

  @media (max-width: 2560px) {
    width: calc(100% - ${(LIST_ITEM_PADDING * 2) * MID_SCALE}px);
    height: calc(100% - ${(LIST_ITEM_PADDING + LIST_ITEM_BOTTOM_PADDING) * MID_SCALE}px);
    padding ${LIST_ITEM_PADDING * MID_SCALE}px ${LIST_ITEM_PADDING * MID_SCALE}px
    ${LIST_ITEM_BOTTOM_PADDING * MID_SCALE}px ${LIST_ITEM_PADDING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: calc(100% - ${(LIST_ITEM_PADDING * 2) * HD_SCALE}px);
    height: calc(100% - ${(LIST_ITEM_PADDING + LIST_ITEM_BOTTOM_PADDING) * HD_SCALE}px);
    padding ${LIST_ITEM_PADDING * HD_SCALE}px ${LIST_ITEM_PADDING * HD_SCALE}px
    ${LIST_ITEM_BOTTOM_PADDING * HD_SCALE}px ${LIST_ITEM_PADDING * HD_SCALE}px;
  }
`;

// #region Icon constants
const ICON_DIMENSIONS = 128;
// #endregion
const Icon = styled.img`
  width: ${ICON_DIMENSIONS}px;
  height: ${ICON_DIMENSIONS}px;
  border-radius: 50%;
  border: 1px solid black;

  @media (max-width: 2560px) {
    width: ${ICON_DIMENSIONS * MID_SCALE}px;
    height: ${ICON_DIMENSIONS * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${ICON_DIMENSIONS * HD_SCALE}px;
    height: ${ICON_DIMENSIONS * HD_SCALE}px;
  }
`;

// #region InfoContainer constants
const INFO_CONTAINER_MARGIN_LEFT = 25;
// #endregion
const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: ${INFO_CONTAINER_MARGIN_LEFT}px;

  @media (max-width: 2560px) {
    margin-left: ${INFO_CONTAINER_MARGIN_LEFT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-left: ${INFO_CONTAINER_MARGIN_LEFT * HD_SCALE}px;
  }
`;

// #region Name constants
const NAME_FONT_SIZE = 36;
const NAME_MARGIN_BOTTOM = 10;
// #endregion
const Name = styled.div`
  font-family: CaudexBold;
  font-size: ${NAME_FONT_SIZE}px;
  margin-bottom: ${NAME_MARGIN_BOTTOM}px;
  cursor: default;
  word-break: break-all;

  @media (max-width: 2560px) {
    font-size: ${NAME_FONT_SIZE * MID_SCALE}px;
    margin-bottom: ${NAME_MARGIN_BOTTOM * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${NAME_FONT_SIZE * HD_SCALE}px;
    margin-bottom: ${NAME_MARGIN_BOTTOM * HD_SCALE}px;
  }
`;

const ComponentContainer = styled.div`
  display: flex;
`;

// #region AddToBarButton constants
const ADD_TO_BAR_BUTTON_FONT_SIZE = 24;
const ADD_TO_BAR_BUTTON_BOTTOM = 20;
const ADD_TO_BAR_BUTTON_RIGHT = 20;
// #endregion
const AddToBarButton = styled.div`
  position: absolute;
  cursor: pointer;
  font-family: CaudexBold;
  font-size: ${ADD_TO_BAR_BUTTON_FONT_SIZE}px;
  bottom: ${ADD_TO_BAR_BUTTON_BOTTOM}px;
  right: ${ADD_TO_BAR_BUTTON_RIGHT}px;
  opacity: 1;
  transition: opacity 0.2s;
  letter-spacing: 2px;

  &:hover {
    opacity: 0.5;
  }

  @media (max-width: 2560px) {
    font-size: ${ADD_TO_BAR_BUTTON_FONT_SIZE * MID_SCALE}px;
    bottom: ${ADD_TO_BAR_BUTTON_BOTTOM * MID_SCALE}px;
    right: ${ADD_TO_BAR_BUTTON_RIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${ADD_TO_BAR_BUTTON_FONT_SIZE * HD_SCALE}px;
    bottom: ${ADD_TO_BAR_BUTTON_BOTTOM * HD_SCALE}px;
    right: ${ADD_TO_BAR_BUTTON_RIGHT * HD_SCALE}px;
  }
`;

// #region EditIcon constants
const EDIT_ICON_FONT_SIZE = 28;
const EDIT_ICON_TOP = 10;
const EDIT_ICON_RIGHT = 10;
// #endregion
const EditIcon = styled.div`
  position: absolute;
  cursor: pointer;
  font-size: ${EDIT_ICON_FONT_SIZE}px;
  top: ${EDIT_ICON_TOP}px;
  right: ${EDIT_ICON_RIGHT}px;
  opacity: 1;
  transition: opacity 0.3s;

  &:hover {
    opacity: 0.5;
  }

  @media (max-width: 2560px) {
    font-size: ${EDIT_ICON_FONT_SIZE * MID_SCALE}px;
    top: ${EDIT_ICON_TOP * MID_SCALE}px;
    right: ${EDIT_ICON_RIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${EDIT_ICON_FONT_SIZE * HD_SCALE}px;
    top: ${EDIT_ICON_TOP * HD_SCALE}px;
    right: ${EDIT_ICON_RIGHT * HD_SCALE}px;
  }
`;

// #region TooltipHeader constants
const TOOLTIP_HEADER_FONT_SIZE = 44;
// #endregion
const TooltipHeader = styled.div`
  font-size: ${TOOLTIP_HEADER_FONT_SIZE}px;
  font-family: Caudex;
  color: white;
  font-weight: 700;

  @media (max-width: 2560px) {
    font-size: ${TOOLTIP_HEADER_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${TOOLTIP_HEADER_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region TooltipContentContainer constants
const TOOLTIP_CONTENT_CONTAINER_FONT_SIZE = 32;
// #endregion
const TooltipContentContainer = styled.div`
  font-size: ${TOOLTIP_CONTENT_CONTAINER_FONT_SIZE}px;
  color: #BBBCBC;

  @media (max-width: 2560px) {
    font-size: ${TOOLTIP_CONTENT_CONTAINER_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${TOOLTIP_CONTENT_CONTAINER_FONT_SIZE * HD_SCALE}px;
  }
`;

const DefaultTooltipStyles = {
  tooltip: css`
    padding: 2px 5px 5px 5px;
    min-width: 200px;
    max-width: 300px;
    max-height: 750px;
  `,
};

export interface Props {
  ability: AbilityBookQuery.Abilities;
  onEditClick: (ability: AbilityBookQuery.Abilities) => void;
}

// tslint:disable-next-line:function-name
export function AbilityItem(props: Props) {
  const { ability } = props;

  // @ts-ignore:no-unused-var
  const [_, dispatch] = useAbilityBuilderReducer();

  function getTooltipContent() {
    return (
      <TooltipContentContainer>
        <TooltipHeader>{ability.name}</TooltipHeader>
        <div dangerouslySetInnerHTML={{ __html: ability.description }} />
      </TooltipContentContainer>
    );
  }

  const tooltipContent = getTooltipContent();
  return (
    <ListItem>
      <Tooltip styles={{ tooltip: DefaultTooltipStyles.tooltip }} content={tooltipContent}>
        <Icon src={ability.icon} />
      </Tooltip>
      {!ability.readOnly && <EditIcon className='icon-edit' onClick={() => props.onEditClick(ability)} />}
      <InfoContainer>
        <Tooltip styles={{ tooltip: DefaultTooltipStyles.tooltip }} content={tooltipContent}>
          <Name>{ability.name}</Name>
        </Tooltip>
        <ComponentContainer>
          {ability.abilityComponents.map(component => (
            <AbilityComponent abilityComponent={component} />
          ))}
        </ComponentContainer>
      </InfoContainer>
      <Tooltip content='Not yet implemented'>
        <AddToBarButton>+ ADD TO ACTION BAR</AddToBarButton>
      </Tooltip>
    </ListItem>
  );
}
