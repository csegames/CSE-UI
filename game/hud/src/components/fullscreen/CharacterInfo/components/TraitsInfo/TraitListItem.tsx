/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { utils } from '@csegames/camelot-unchained';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

const COLORS = {
  BOON_PRIMARY: '#41ACE9',
  BANE_PRIMARY: '#E85143',
  CLASS_TRAIT: '#8D6CAB',
  RACE_TRAIT: '#00A0DC',
  FACTION_TRAIT: '#D63C32',
  GENERAL_TRAIT: '#C3C3C3',
};

enum TraitType {
  Bane = 'Bane',
  Boon = 'Boon',
}

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
  background: rgba(0, 0, 0, 0.5);
  margin-bottom: ${CONTAINER_MARGIN_BOTTOM}px;
  height: ${CONTAINER_HEIGHT}px;
  cursor: default;

  &.not-search {
    opacity: 0.1;
  }
  &:hover {
    filter: brightness(150%);
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
    margin-bottom: ${CONTAINER_MARGIN_BOTTOM * MID_SCALE}px;
    height: ${CONTAINER_HEIGHT * MID_SCALE}px;

    &:after {
      bottom: ${CONTAINER_ORNAMENT_BOTTOM * MID_SCALE}px;
      height: ${CONTAINER_ORNAMENT_HEIGHT * MID_SCALE}px;
    }
  }

  @media (max-width: 1920px) {
    margin-bottom: ${CONTAINER_MARGIN_BOTTOM * HD_SCALE}px;
    height: ${CONTAINER_HEIGHT * HD_SCALE}px;

    &:after {
      bottom: ${CONTAINER_ORNAMENT_BOTTOM * HD_SCALE}px;
      height: ${CONTAINER_ORNAMENT_HEIGHT * HD_SCALE}px;
    }
  }
`;

// #region ImageContainer constants
const IMAGE_CONTAINER_DIMENSIONS = 160;
const IMAGE_CONTAINER_MARGIN_LEFT = 10;
const IMAGE_CONTAINER_BORDER_WIDTH = 2;
// #endregion
const ImageContainer = styled.div`
  width: ${IMAGE_CONTAINER_DIMENSIONS}px;
  height: ${IMAGE_CONTAINER_DIMENSIONS}px;
  min-width: ${IMAGE_CONTAINER_DIMENSIONS}px;
  min-height: ${IMAGE_CONTAINER_DIMENSIONS}px;
  margin-left: ${IMAGE_CONTAINER_MARGIN_LEFT}px;
  border: ${IMAGE_CONTAINER_BORDER_WIDTH}px solid ${COLORS.GENERAL_TRAIT};

  &.Class {
    border: ${IMAGE_CONTAINER_BORDER_WIDTH}px solid ${COLORS.CLASS_TRAIT};
  }
  &.Race {
    border: ${IMAGE_CONTAINER_BORDER_WIDTH}px solid ${COLORS.RACE_TRAIT};
  }
  &.Faction {
    border: ${IMAGE_CONTAINER_BORDER_WIDTH}px solid ${COLORS.FACTION_TRAIT};
  }

  @media (max-width: 2560px) {
    width: ${IMAGE_CONTAINER_DIMENSIONS * MID_SCALE}px;
    height: ${IMAGE_CONTAINER_DIMENSIONS * MID_SCALE}px;
    min-width: ${IMAGE_CONTAINER_DIMENSIONS * MID_SCALE}px;
    min-height: ${IMAGE_CONTAINER_DIMENSIONS * MID_SCALE}px;
    margin-left: ${IMAGE_CONTAINER_MARGIN_LEFT * MID_SCALE}px;
    border: ${IMAGE_CONTAINER_BORDER_WIDTH * MID_SCALE}px solid ${COLORS.GENERAL_TRAIT};

    &.Class {
      border: ${IMAGE_CONTAINER_BORDER_WIDTH * MID_SCALE}px solid ${COLORS.CLASS_TRAIT};
    }
    &.Race {
      border: ${IMAGE_CONTAINER_BORDER_WIDTH * MID_SCALE}px solid ${COLORS.RACE_TRAIT};
    }
    &.Faction {
      border: ${IMAGE_CONTAINER_BORDER_WIDTH * MID_SCALE}px solid ${COLORS.FACTION_TRAIT};
    }
  }

  @media (max-width: 1920px) {
    width: ${IMAGE_CONTAINER_DIMENSIONS * HD_SCALE}px;
    height: ${IMAGE_CONTAINER_DIMENSIONS * HD_SCALE}px;
    min-width: ${IMAGE_CONTAINER_DIMENSIONS * HD_SCALE}px;
    min-height: ${IMAGE_CONTAINER_DIMENSIONS * HD_SCALE}px;
    margin-left: ${IMAGE_CONTAINER_MARGIN_LEFT * HD_SCALE}px;
    border: ${IMAGE_CONTAINER_BORDER_WIDTH * HD_SCALE}px solid ${COLORS.GENERAL_TRAIT};

    &.Class {
      border: ${IMAGE_CONTAINER_BORDER_WIDTH * HD_SCALE}px solid ${COLORS.CLASS_TRAIT};
    }
    &.Race {
      border: ${IMAGE_CONTAINER_BORDER_WIDTH * HD_SCALE}px solid ${COLORS.RACE_TRAIT};
    }
    &.Faction {
      border: ${IMAGE_CONTAINER_BORDER_WIDTH * HD_SCALE}px solid ${COLORS.FACTION_TRAIT};
    }
  }
`;

const Image = styled.img`
  width: 100%;
  height: calc(100% - 3px);
`;

// #region InfoContainer constants
const INFO_CONTAINER_MARGIN_LEFT = 20;
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

// #region Title constants
const TITLE_FONT_SIZE = 32;
// #endregion
const Title = styled.div`
  font-size: ${TITLE_FONT_SIZE}px;
  font-family: Caudex;
  font-weight: bold;

  &.Boon {
    color: ${COLORS.BOON_PRIMARY};
  }

  &.Bane {
    color: ${COLORS.BANE_PRIMARY};
  }

  @media (max-width: 2560px) {
    font-size: ${TITLE_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${TITLE_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region SubTitle constants
const SUB_TITLE_FONT_SIZE = 28;
// #endregion
const SubTitle = styled.div`
  font-size: ${SUB_TITLE_FONT_SIZE}px;
  font-family: Caudex;
  color: ${COLORS.GENERAL_TRAIT};

  &.Class {
    color: ${COLORS.CLASS_TRAIT};
  }
  &.Race {
    color: ${COLORS.RACE_TRAIT};
  }
  &.Faction {
    color: ${COLORS.FACTION_TRAIT};
  }

  @media (max-width: 2560px) {
    font-size: ${SUB_TITLE_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${SUB_TITLE_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region Description constants
const DESCRIPTION_MARGIN_TOP = 10;
const DESCRIPTION_FONT_SIZE = 28;
// #endregion
const Description = styled.div`
  margin-top: ${DESCRIPTION_MARGIN_TOP}px;
  font-size: ${DESCRIPTION_FONT_SIZE}px;
  font-family: TitilliumWeb;
  color: ${COLORS.GENERAL_TRAIT};

  @media (max-width: 2560px) {
    margin-top: ${DESCRIPTION_MARGIN_TOP * MID_SCALE}px;
    font-size: ${DESCRIPTION_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-top: ${DESCRIPTION_MARGIN_TOP * HD_SCALE}px;
    font-size: ${DESCRIPTION_FONT_SIZE * HD_SCALE}px;
  }
`;

export interface TraitListItemProps {
  trait: GraphQL.Schema.Trait;
  searchValue: string;
}

class TraitListItem extends React.Component<TraitListItemProps> {
  public render() {
    const { trait } = this.props;
    const traitType = this.getTraitType();
    const searchIncludes = this.doesSearchInclude();
    return (
      <Container className={searchIncludes ? '' : 'not-search'}>
        <ImageContainer className={trait.category}>
          <Image src={trait.icon} />
        </ImageContainer>
        <InfoContainer>
          <Title className={traitType}>{trait.name}</Title>
          <SubTitle className={trait.category}>{trait.category} {traitType}</SubTitle>
          <Description>{trait.description}</Description>
        </InfoContainer>
      </Container>
    );
  }

  private getTraitType = () => {
    const { trait } = this.props;
    if (trait.points > 0) {
      return TraitType.Boon;
    }

    return TraitType.Bane;
  }

  private doesSearchInclude = () => {
    const { searchValue, trait } = this.props;
    if (searchValue !== '') {
      return utils.doesSearchInclude(searchValue, trait.name) ||
        utils.doesSearchInclude(searchValue, trait.description) ||
        utils.doesSearchInclude(searchValue, trait.category);
    } else {
      return true;
    }
  }
}

export default TraitListItem;
