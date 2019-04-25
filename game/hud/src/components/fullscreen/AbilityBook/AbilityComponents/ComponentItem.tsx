/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';
import { AbilityBookQuery } from 'gql/interfaces';
import { AbilityBookContext } from '..';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';
import { Tooltip } from 'shared/Tooltip';
import { TooltipContent } from 'fullscreen/AbilityBuilder/AbilityCreation/TooltipContent';

// #region Container constants
const CONTAINER_MARGIN_LEFT = 10;
const CONTAINER_MARGIN_LEFT_SECOND = 60;
const CONTAINER_MARGIN_BOTTOM = 50;
// #endregion
const Container = styled.div`
  display: flex;
  align-items: center;
  width: calc(50% - ${CONTAINER_MARGIN_LEFT_SECOND}px);
  margin-left: ${CONTAINER_MARGIN_LEFT}px;
  margin-bottom: ${CONTAINER_MARGIN_BOTTOM}px;

  &:nth-child(2) {
    margin-left: ${CONTAINER_MARGIN_LEFT_SECOND}px;
  }

  @media (max-width: 2560px) {
    width: calc(50% - ${CONTAINER_MARGIN_LEFT_SECOND * MID_SCALE}px);
    margin-left: ${CONTAINER_MARGIN_LEFT * MID_SCALE}px;
    margin-bottom: ${CONTAINER_MARGIN_BOTTOM * MID_SCALE}px;

    &:nth-child(2) {
      margin-left: ${CONTAINER_MARGIN_LEFT_SECOND * MID_SCALE}px;
    }
  }

  @media (max-width: 1920px) {
    width: calc(50% - ${CONTAINER_MARGIN_LEFT_SECOND * HD_SCALE}px);
    margin-left: ${CONTAINER_MARGIN_LEFT * HD_SCALE}px;
    margin-bottom: ${CONTAINER_MARGIN_BOTTOM * HD_SCALE}px;

    &:nth-child(2) {
      margin-left: ${CONTAINER_MARGIN_LEFT_SECOND * HD_SCALE}px;
    }
  }
`;

// #region Icon constants
const ICON_WIDTH = 123;
const ICON_BORDER_WIDTH = 5;
const ICON_MARGIN_RIGHT = 24;
// #endregion
const Icon = styled.img`
  width: ${ICON_WIDTH}px;
  height: ${ICON_WIDTH}px;
  border: ${ICON_BORDER_WIDTH}px solid rgba(124, 92, 76, 0.5);
  margin-right: ${ICON_MARGIN_RIGHT}px;

  @media (max-width: 2560px) {
    width: ${ICON_WIDTH * MID_SCALE}px;
    height: ${ICON_WIDTH * MID_SCALE}px;
    border: ${ICON_BORDER_WIDTH * MID_SCALE}px solid rgba(124, 92, 76, 0.5);
    margin-right: ${ICON_MARGIN_RIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${ICON_WIDTH * HD_SCALE}px;
    height: ${ICON_WIDTH * HD_SCALE}px;
    border: ${ICON_BORDER_WIDTH * HD_SCALE}px solid rgba(124, 92, 76, 0.5);
    margin-right: ${ICON_MARGIN_RIGHT * HD_SCALE}px;
  }
`;

const InfoContainer = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
`;

// #region Name constants
const NAME_FONT_SIZE = 36;
// #endregion
const Name = styled.div`
  font-size: ${NAME_FONT_SIZE}px;
  font-family: CaudexBold;

  @media (max-width: 2560px) {
    font-size: ${NAME_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${NAME_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region ExperienceBarContainer constants
const EXPERIENCE_BAR_CONTAINER_HEIGHT = 10;
const EXPERIENCE_BAR_CONTAINER_PADDING_HORIZONTAL = 1;
const EXPERIENCE_BAR_CONTAINER_PADDING_VERTICAL = 2;
// #endregion
const ExperienceBarContainer = styled.div`
  position: relative;
  height: ${EXPERIENCE_BAR_CONTAINER_HEIGHT}px;
  max-height: ${EXPERIENCE_BAR_CONTAINER_HEIGHT}px;
  padding: ${EXPERIENCE_BAR_CONTAINER_PADDING_VERTICAL}px ${EXPERIENCE_BAR_CONTAINER_PADDING_HORIZONTAL}px;
  background-image: url(../images/abilitybook/uhd/proficiency-frame.png);
  background-size: 100% 100%;
  flex: 1;

  @media (max-width: 2560px) {
    height: ${EXPERIENCE_BAR_CONTAINER_HEIGHT * MID_SCALE}px;
    max-height: ${EXPERIENCE_BAR_CONTAINER_HEIGHT * MID_SCALE}px;
    padding: ${EXPERIENCE_BAR_CONTAINER_PADDING_VERTICAL * MID_SCALE}px
    ${EXPERIENCE_BAR_CONTAINER_PADDING_HORIZONTAL * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    height: ${EXPERIENCE_BAR_CONTAINER_HEIGHT * HD_SCALE}px;
    max-height: ${EXPERIENCE_BAR_CONTAINER_HEIGHT * HD_SCALE}px;
    padding: ${EXPERIENCE_BAR_CONTAINER_PADDING_VERTICAL * HD_SCALE}px
    ${EXPERIENCE_BAR_CONTAINER_PADDING_HORIZONTAL * HD_SCALE}px;
    background-image: url(../images/abilitybook/hd/proficiency-frame.png);
  }
`;

const ExperienceBar = styled.div`
  position: absolute;
  height: calc(100% - ${EXPERIENCE_BAR_CONTAINER_PADDING_VERTICAL * 2}px);
  background-color: #49302A;

  @media (max-width: 2560px) {
    height: calc(100% - ${(EXPERIENCE_BAR_CONTAINER_PADDING_VERTICAL * 2) * MID_SCALE}px);
  }

  @media (max-width: 1920px) {
    height: calc(100% - ${(EXPERIENCE_BAR_CONTAINER_PADDING_VERTICAL * 2) * HD_SCALE}px);
  }
`;

// #region LevelText constants
const LEVEL_TEXT_FONT_SIZE = 24;
const LEVEL_TEXT_LETTER_SPACING = 2;
// #endregion
const LevelText = styled.div`
  text-transform: uppercase;
  font-family: CaudexBold;
  letter-spacing: ${LEVEL_TEXT_LETTER_SPACING}px;
  font-size: ${LEVEL_TEXT_FONT_SIZE}px;

  @media (max-width: 2560px) {
    letter-spacing: ${LEVEL_TEXT_LETTER_SPACING * MID_SCALE}px;
    font-size: ${LEVEL_TEXT_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    letter-spacing: ${LEVEL_TEXT_LETTER_SPACING * HD_SCALE}px;
    font-size: ${LEVEL_TEXT_FONT_SIZE * HD_SCALE}px;
  }
`;

export interface Props {
  abilityComponent: AbilityBookQuery.AbilityComponents;
}

// tslint:disable-next-line:function-name
export function ComponentItem(props: Props) {
  const { abilityComponentIDToProgression } = useContext(AbilityBookContext);
  const progressionData = abilityComponentIDToProgression[props.abilityComponent.id];
  let levelProgress = 0;

  if (progressionData) {
    const levelInfo = props.abilityComponent.progression.levels.levels.find(level =>
      level.levelNumber === progressionData.level);
    levelProgress = progressionData.progressionPoints / levelInfo.progressionForLevel;
  }
  return (
    <Container>
      <Tooltip content={<TooltipContent componentItem={props.abilityComponent} selectedComponentsList={[]} />}>
        <Icon src={props.abilityComponent.display.iconURL} />
      </Tooltip>
      <InfoContainer>
        <Name>{props.abilityComponent.display.name}</Name>
        <ExperienceBarContainer>
          <ExperienceBar style={{ width: `${levelProgress}%` }} />
        </ExperienceBarContainer>
        <LevelText>
          Level: {progressionData ? progressionData.level :
            props.abilityComponent.progression ? props.abilityComponent.progression.levels.levels[0].levelNumber : 0}
        </LevelText>
      </InfoContainer>
    </Container>
  );
}
