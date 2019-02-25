/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from 'linaria/react';
import { utils } from '@csegames/camelot-unchained';

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

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.5);
  margin-bottom: 5px;
  height: 94px;
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
    bottom: -5px;
    height: 5px;
    background: url(/hud-new/images/character-stats/ornament-middle-bottom-list.png) no-repeat;
    background-position: center;
  }
`;

const ImageContainer = styled.div`
  width: 80px;
  height: 80px;
  min-width: 80px;
  min-height: 80px;
  margin-left: 5px;
  border: 1px solid ${COLORS.GENERAL_TRAIT};
  &.Class {
    border: 1px solid ${COLORS.CLASS_TRAIT};
  }
  &.Race {
    border: 1px solid ${COLORS.RACE_TRAIT};
  }
  &.Faction {
    border: 1px solid ${COLORS.FACTION_TRAIT};
  }
`;

const Image = styled.img`
  width: 100%;
  height: calc(100% - 3px);
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 10px;
`;

const Title = styled.div`
  font-size: 16px;
  font-family: Caudex;
  font-weight: bold;

  &.Boon {
    color: ${COLORS.BOON_PRIMARY};
  }

  &.Bane {
    color: ${COLORS.BANE_PRIMARY};
  }
`;

const SubTitle = styled.div`
  font-size: 14px;
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
`;

const Description = styled.div`
  margin-top: 5px;
  font-size: 14px;
  font-family: TitilliumWeb;
  color: ${COLORS.GENERAL_TRAIT};
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
