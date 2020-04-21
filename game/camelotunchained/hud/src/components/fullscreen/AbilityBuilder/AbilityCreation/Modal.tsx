/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';
import { Button } from './CreateAbilityButton';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';
import { AbilityType } from 'services/session/AbilityBuilderState';
import { AbilityBookContext, Routes } from '../../../context/AbilityBookContext';

// #region Container constants
const CONTAINER_PADDING_TOP = 60;
const CONTAINER_PADDING_BOT = 80;
// #endregion
const Container = styled.div`
  position: absolute;
  top: -25%;
  right: -10%;
  bottom: 0;
  left: -10%;
  margin: auto;
  min-width: 90%;
  height: fit-content;
  padding: ${CONTAINER_PADDING_TOP}px 0 ${CONTAINER_PADDING_BOT}px 0;
  background-image: url(../images/abilitybuilder/uhd/modal-bg.png);
  background-size: 100% 100%;
  z-index: 99;

  &.fail {
    background-image: url(../images/abilitybuilder/uhd/modal-failed-bg.png);
  }

  @media (max-width: 2560px) {
    padding: ${CONTAINER_PADDING_TOP * MID_SCALE}px 0 ${CONTAINER_PADDING_BOT * MID_SCALE}px 0;
  }

  @media (max-width: 1920px) {
    padding: ${CONTAINER_PADDING_TOP * HD_SCALE}px 0 ${CONTAINER_PADDING_BOT * HD_SCALE}px 0;
    background-image: url(../images/abilitybuilder/hd/modal-bg.png);

    &.fail {
      background-image: url(../images/abilitybuilder/hd/modal-failed-bg.png);
    }
  }
`;

const Content = styled.div`
  position: relative;
  width: 100%;
  height: fit-content;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

// #region Title constants
const TITLE_WIDTH = 1144;
const TITLE_HEIGHT = 122;
const TITLE_FONT_SIZE = 50;
const TITLE_LETTER_SPACING = 12;
const TITLE_MARGIN_BOTTOM = 90;
// #endregion
const Title = styled.div`
  position: relative;
  width: ${TITLE_WIDTH}px;
  height: ${TITLE_HEIGHT}px;
  font-size: ${TITLE_FONT_SIZE}px;
  letter-spacing: ${TITLE_LETTER_SPACING}px;
  margin-bottom: ${TITLE_MARGIN_BOTTOM}px;
  background-image: url(../images/abilitybuilder/uhd/modal-title-bg.png);
  background-size: contain;
  display: flex;
  justify-content: center;
  align-items: center;
  font-family: Caudex;
  color: white;
  text-transform: uppercase;

  &.success {
    &.Melee {
      filter: hue-rotate(110deg);
    }

    &.Archery {
      filter: hue-rotate(-75deg);
    }

    &.Shout {
      filter: hue-rotate(135deg);
    }

    &.Throwing {
      filter: hue-rotate(-135deg);
    }
  }

  &.fail {
    background-image: url(../images/abilitybuilder/uhd/modal-title-failed-bg.png);
  }

  @media (max-width: 2560px) {
    width: ${TITLE_WIDTH * MID_SCALE}px;
    height: ${TITLE_HEIGHT * MID_SCALE}px;
    font-size: ${TITLE_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${TITLE_LETTER_SPACING * MID_SCALE}px;
    margin-bottom: ${TITLE_MARGIN_BOTTOM * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${TITLE_WIDTH * HD_SCALE}px;
    height: ${TITLE_HEIGHT * HD_SCALE}px;
    font-size: ${TITLE_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${TITLE_LETTER_SPACING * HD_SCALE}px;
    margin-bottom: ${TITLE_MARGIN_BOTTOM * HD_SCALE}px;
    background-image: url(../images/abilitybuilder/hd/modal-title-bg.png);

    &.fail {
      background-image: url(../images/abilitybuilder/hd/modal-title-failed.png);
    }
  }
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: -10px 0;
  width: 60%;
`;

// #region Text constants
const TEXT_FONT_SIZE = 37;
// #endregion
const Text = styled.div`
  font-family: CaudexBold;
  font-size: ${TEXT_FONT_SIZE}px;

  @media (max-width: 2560px) {
    font-size: ${TEXT_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${TEXT_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region AbilityIconWrapper constants
const ABILITY_ICON_WRAPPER_DIMENSIONS = 298;
// #endregion
const AbilityIconWrapper = styled.div`
  position: absolute;
  top: 0;
  bottom: 0;
  left: 10%;
  margin: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${ABILITY_ICON_WRAPPER_DIMENSIONS}px;
  height: ${ABILITY_ICON_WRAPPER_DIMENSIONS}px;
  background-image: url(../images/abilitybuilder/uhd/modal-skill-icon.png);
  background-size: contain;

  &.fail {
    background-image: url(../images/abilitybuilder/uhd/modal-skill-icon-failed.png);
  }

  @media (max-width: 2560px) {
    width: ${ABILITY_ICON_WRAPPER_DIMENSIONS * MID_SCALE}px;
    height: ${ABILITY_ICON_WRAPPER_DIMENSIONS * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${ABILITY_ICON_WRAPPER_DIMENSIONS * HD_SCALE}px;
    height: ${ABILITY_ICON_WRAPPER_DIMENSIONS * HD_SCALE}px;
    background-image: url(../images/abilitybuilder/hd/modal-skill-icon.png);

    &.fail {
      background-image: url(../images/abilitybuilder/hd/modal-skill-icon-failed.png);
    }
  }
`;

// #region AbilityIcon constants
const ABILITY_ICON_DIMENSIONS = 154;
// #endregion
const AbilityIcon = styled.img`
  width: ${ABILITY_ICON_DIMENSIONS}px;
  height: ${ABILITY_ICON_DIMENSIONS}px;
  border-radius: 50%;

  @media (max-width: 2560px) {
    width: ${ABILITY_ICON_DIMENSIONS * MID_SCALE}px;
    height: ${ABILITY_ICON_DIMENSIONS * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${ABILITY_ICON_DIMENSIONS * HD_SCALE}px;
    height: ${ABILITY_ICON_DIMENSIONS * HD_SCALE}px;
  }
`;

const AbilityActionsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

// #region ActionButtonsContainer constants
const ACTION_BUTTONS_CONTAINER_BOTTOM = -200;
// #endregion
const ActionButtonsContainer = styled.div`
  position: absolute;
  display: flex;
  bottom: ${ACTION_BUTTONS_CONTAINER_BOTTOM}px;

  @media (max-width: 2560px) {
    bottom: ${ACTION_BUTTONS_CONTAINER_BOTTOM * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    bottom: ${ACTION_BUTTONS_CONTAINER_BOTTOM * HD_SCALE}px;
  }
`;

// #region ActionButton constants
const ACTION_BUTTON_PADDING_HORIZONTAL = 40;
const ACTION_BUTTON_HEIGHT = 108;
const ACTION_BUTTON_MIN_WIDTH = 300;
const ACTION_BUTTON_FONT_SIZE = 30;
const ACTION_BUTTON_LETTER_SPACING = 6;
// #endregion
const ActionButton = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 0 ${ACTION_BUTTON_PADDING_HORIZONTAL}px;
  height: ${ACTION_BUTTON_HEIGHT}px;
  min-width: ${ACTION_BUTTON_MIN_WIDTH}px;
  font-size: ${ACTION_BUTTON_FONT_SIZE}px;
  letter-spacing: ${ACTION_BUTTON_LETTER_SPACING}px;
  text-transform: uppercase;
  text-align: center;
  font-family: Caudex;
  color: #cebd9d;
  cursor: pointer;
  background-image: url(../images/abilitybuilder/uhd/modal-btn-bg.png);
  background-size: 100% 100%;
  margin: 0 5px;

  &:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: url(../images/abilitybuilder/uhd/modal-btn-frame.png);
    background-size: 100% 100%;
  }

  &:hover {
    filter: brightness(130%);
  }

  @media (max-width: 2560px) {
    padding: 0 ${ACTION_BUTTON_PADDING_HORIZONTAL * MID_SCALE}px;
    height: ${ACTION_BUTTON_HEIGHT * MID_SCALE}px;
    min-width: ${ACTION_BUTTON_MIN_WIDTH * MID_SCALE}px;
    font-size: ${ACTION_BUTTON_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${ACTION_BUTTON_LETTER_SPACING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding: 0 ${ACTION_BUTTON_PADDING_HORIZONTAL * HD_SCALE}px;
    height: ${ACTION_BUTTON_HEIGHT * HD_SCALE}px;
    min-width: ${ACTION_BUTTON_MIN_WIDTH * HD_SCALE}px;
    font-size: ${ACTION_BUTTON_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${ACTION_BUTTON_LETTER_SPACING * HD_SCALE}px;
  }
`;

export interface Props {
  type: 'success' | 'fail';
  abilityType: AbilityType;
  name: string;
  icon: string;
  errorMessage: string;
  isModifying: boolean;
  onTryAgainClick: () => void;
  onCreateNewClick: () => void;
  onAddToHudClick: () => void;
}

// tslint:disable-next-line:function-name
export function Modal(props: Props) {
  const abilityBookContext = useContext(AbilityBookContext);
  const { type, name, icon, isModifying, errorMessage, abilityType } = props;

  function closeAbilityBuilder() {
    game.trigger('navigate', 'ability-builder');
  }

  function viewInAbilityBook() {
    abilityBookContext.setActiveRoute(Routes[abilityType.name]);
    game.trigger('navigate', 'ability-book-left');
  }

  return (
    <Container className={type}>
      <Content>
        <Title className={`${type} ${abilityType.name}`}>
          <AbilityIconWrapper className={type}>
            <AbilityIcon src={icon} />
          </AbilityIconWrapper>
          {type === 'success' ? 'Success' : 'Failed'}
        </Title>
        <InfoContainer>
          <AbilityActionsContainer>
            <Text>
              {type === 'success' ? `${name} has been ${isModifying ? 'modified' : 'created'}!` :
                `Failed to ${isModifying ? 'modify' : 'create'} ${name}`}
            </Text>
            {errorMessage && <Text>{errorMessage}</Text>}
          </AbilityActionsContainer>
          <Button
            className={abilityType.name}
            onClick={type === 'success' ? props.onAddToHudClick : props.onTryAgainClick}>
            {type === 'success' ? 'Add Ability To HUD' : 'Try again'}
          </Button>
        </InfoContainer>

        <ActionButtonsContainer>
          <ActionButton onClick={props.onCreateNewClick}>Create new ability</ActionButton>
          <ActionButton onClick={type === 'success' ? viewInAbilityBook : closeAbilityBuilder}>
            {type === 'success' ? 'View in ability book' : 'Exit ability builder'}
          </ActionButton>
        </ActionButtonsContainer>
      </Content>
    </Container>
  );
}
