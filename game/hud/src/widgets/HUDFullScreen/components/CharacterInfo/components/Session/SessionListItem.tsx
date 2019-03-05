/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { utils } from '@csegames/camelot-unchained';
import { SkillPartsUsedField } from '@csegames/camelot-unchained/lib/graphql/schema';

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 94px;
  background: rgba(0, 0, 0, 0.5);
  margin-bottom: 5px;
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
    bottom: -5px;
    height: 5px;
    background: url(../images/character-stats/ornament-middle-bottom-list.png) no-repeat;
    background-position: center;
  }
`;

const ImageContainer = styled.div`
  width: 80px;
  height: 80px;
  border: 1px solid #555;
  margin-left: 5px;
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 15px;
  flex: 1;
`;

const Title = styled.div`
  font-size: 16px;
  font-weight: bold;
  font-family: Caudex;
  color: #C3C3C3;
`;

const Description = styled.div`
  font-size: 14px;
  font-family: Caudex;
  color: #C3C3C3;
  margin-right: 50px;
`;

const Section = styled.div`
  display: flex;
  flex: ${(props: { flex?: number }) => props.flex || 1};
  align-items: center;
`;

const TimesUsed = styled.div`
  font-size: 16px;
  font-weight: bold;
  font-family: Caudex;
  color: #C3C3C3;
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
