/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { utils } from '@csegames/library/lib/camelotunchained';
import { SkillPartsUsedField } from '@csegames/library/lib/_baseGame/graphql/schema';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region Container constants
const CONTAINER_HEIGHT = 188;
const CONTAINER_MARGIN_BOTTOM = 10;
const CONTAINER_ORNAMENT_BOTTOM = -10;
const CONTAINER_ORNAMENT_HEIGHT = 10;
// #endregion
const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: ${CONTAINER_HEIGHT}px;
  margin-bottom: ${CONTAINER_MARGIN_BOTTOM}px;
  background: rgba(0, 0, 0, 0.5);
  cursor: default;
  &:hover {
    filter: brightness(150%);
  }
  &.not-search {
    opacity: 0.1;
  }
  &:after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: ${CONTAINER_ORNAMENT_BOTTOM}px;
    height: ${CONTAINER_ORNAMENT_HEIGHT}px;
    background: url(../images/character-stats/ornament-middle-bottom-list.png) no-repeat;
    background-position: center;
  }

  @media (max-width: 2560px) {
    height: ${CONTAINER_HEIGHT * MID_SCALE}px;
    margin-bottom: ${CONTAINER_MARGIN_BOTTOM * MID_SCALE}px;

    &:after {
      bottom: ${CONTAINER_ORNAMENT_BOTTOM * MID_SCALE}px;
      height: ${CONTAINER_ORNAMENT_HEIGHT * MID_SCALE}px;
    }
  }

  @media (max-width: 1920px) {
    height: ${CONTAINER_HEIGHT * HD_SCALE}px;
    margin-bottom: ${CONTAINER_MARGIN_BOTTOM * HD_SCALE}px;

    &:after {
      bottom: ${CONTAINER_ORNAMENT_BOTTOM * HD_SCALE}px;
      height: ${CONTAINER_ORNAMENT_HEIGHT * HD_SCALE}px;
    }
  }
`;

// #region ImageContainer constants
const IMAGE_CONTAINER_DIMENSIONS = 160;
const IMAGE_CONTAINER_BORDER = 2;
const IMAGE_CONTAINER_MARGIN_LEFT = 10;
// #endregion
const ImageContainer = styled.div`
  width: ${IMAGE_CONTAINER_DIMENSIONS}px;
  height: ${IMAGE_CONTAINER_DIMENSIONS}px;
  border: ${IMAGE_CONTAINER_BORDER}px solid #555;
  margin-left: ${IMAGE_CONTAINER_MARGIN_LEFT}px;

  @media (max-width: 2560px) {
    width: ${IMAGE_CONTAINER_DIMENSIONS * MID_SCALE}px;
    height: ${IMAGE_CONTAINER_DIMENSIONS * MID_SCALE}px;
    border: ${IMAGE_CONTAINER_BORDER * MID_SCALE}px solid #555;
    margin-left: ${IMAGE_CONTAINER_MARGIN_LEFT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${IMAGE_CONTAINER_DIMENSIONS * HD_SCALE}px;
    height: ${IMAGE_CONTAINER_DIMENSIONS * HD_SCALE}px;
    border: ${IMAGE_CONTAINER_BORDER * HD_SCALE}px solid #555;
    margin-left: ${IMAGE_CONTAINER_MARGIN_LEFT * HD_SCALE}px;
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
`;

// #region InfoContainer constants
const INFO_CONTAINER_MARGIN_LEFT = 30;
// #endregion
const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: ${INFO_CONTAINER_MARGIN_LEFT}px;
  flex: 1;

  @media (max-width: 2560px) {
    margin-left: ${INFO_CONTAINER_MARGIN_LEFT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-left: ${INFO_CONTAINER_MARGIN_LEFT * HD_SCALE}px;
  }
`;

// #region Title constants
const TITLE_FONT_SIZE = 32;
// #endregion
const Title = styled.div`
  font-size: ${TITLE_FONT_SIZE}px;
  font-weight: bold;
  font-family: Caudex;
  color: #C3C3C3;

  @media (max-width: 2560px) {
    font-size: ${TITLE_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${TITLE_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region Description constants
const DESCRIPTION_FONT_SIZE = 28;
const DESCRIPTION_MARGIN_RIGHT = 100;
// #endregion
const Description = styled.div`
  font-size: ${DESCRIPTION_FONT_SIZE}px;
  margin-right: ${DESCRIPTION_MARGIN_RIGHT}px;
  font-family: Caudex;
  color: #C3C3C3;

  @media (max-width: 2560px) {
    font-size: ${DESCRIPTION_FONT_SIZE * MID_SCALE}px;
    margin-right: ${DESCRIPTION_MARGIN_RIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${DESCRIPTION_FONT_SIZE * HD_SCALE}px;
    margin-right: ${DESCRIPTION_MARGIN_RIGHT * HD_SCALE}px;
  }
`;

const Section = styled.div`
  display: flex;
  flex: ${(props: { flex?: number }) => props.flex || 1};
  align-items: center;
`;

// #region TimesUsed constants
const TIMES_USED_FONT_SIZE = 32;
// #endregion
const TimesUsed = styled.div`
  font-size: ${TIMES_USED_FONT_SIZE}px;
  font-weight: bold;
  font-family: Caudex;
  color: #C3C3C3;

  @media (max-width: 2560px) {
    font-size: ${TIMES_USED_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${TIMES_USED_FONT_SIZE * HD_SCALE}px;
  }
`;

export interface SessionListItemProps {
  skillPartUsed: SkillPartsUsedField;
  searchValue: string;
}

class SessionListItem extends React.Component<SessionListItemProps> {
  public render() {
    const { skillPartUsed } = this.props;
    const searchIncludes = this.doesSearchInclude();
    return (
      <Container className={searchIncludes ? '' : 'not-search'}>
        <Section flex={2}>
          <ImageContainer>
            <Image src={skillPartUsed.skillPart.icon} />
          </ImageContainer>
          <InfoContainer>
            <Title>{skillPartUsed.skillPart.name}</Title>
            <Description>{skillPartUsed.skillPart.description}</Description>
          </InfoContainer>
        </Section>
        <Section>
          <TimesUsed>{skillPartUsed.timesUsed}</TimesUsed>
        </Section>
      </Container>
    );
  }

  private doesSearchInclude = () => {
    const { skillPartUsed, searchValue } = this.props;
    if (searchValue !== '') {
      return utils.doesSearchInclude(searchValue, skillPartUsed.skillPart.name) ||
        utils.doesSearchInclude(searchValue, skillPartUsed.skillPart.description);
    } else {
      return true;
    }
  }
}

export default SessionListItem;
