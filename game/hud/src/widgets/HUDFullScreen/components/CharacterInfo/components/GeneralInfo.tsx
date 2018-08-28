/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import gql from 'graphql-tag';
import * as React from 'react';
import styled from 'react-emotion';
import { utils, webAPI, Race } from '@csegames/camelot-unchained';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';

import { characterAvatarIcon, colors } from '../../../lib/constants';
import { GeneralInfoGQL } from 'gql/interfaces';

const query = gql`
  query GeneralInfoGQL {
    myCharacter {
      id
      name
      faction
      race
      gender
      archetype
    }
  }
`;

const Container = styled('div')`
  flex: 1;
  height: 100%;
  background-color: ${utils.lightenColor(colors.filterBackgroundColor, 5)};
  border: 2px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)};
  opacity: 0.8;
`;

const Header = styled('div')`
  height: 100%;
  display: flex;
  justify-content: space-between;
`;

const AvatarIconContainer = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 2px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)};
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5);
  width: 150px;
`;

const CharacterName = styled('div')`
  flex: 1;
  text-align: center;
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5);
`;

const CharacterNameText = styled('p')`
  font-size: 30px;
  margin: 0;
  padding: 0;
  color: ${utils.lightenColor(colors.filterBackgroundColor, 150)};
`;

const OtherInfoContainer = styled('div')`
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;
  flex: 2;
  border-left: 2px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)};
  box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.5);
`;

const OtherInfoText = styled('p')`
  font-size: 20px;
  margin: 0;
  padding: 0;
  color: ${utils.lightenColor(colors.filterBackgroundColor, 150)};
`;

export interface GeneralInfoProps {
}

export interface GeneralInfoState {

}

class GeneralInfo extends React.Component<GeneralInfoProps, GeneralInfoState> {
  constructor(props: GeneralInfoProps) {
    super(props);
    this.state = {

    };
  }

  public render() {
    return (
      <GraphQL query={query}>
        {(graphql: GraphQLResult<GeneralInfoGQL.Query>) => {
          if (graphql.loading || !graphql.data) return null;
          const myCharacter: GeneralInfoGQL.MyCharacter =
            typeof graphql.data === 'string' ? JSON.parse(graphql.data).myCharacter : graphql.data.myCharacter;

          return (
            <Container>
              <Header>
                <AvatarIconContainer>
                  <img src={characterAvatarIcon[`${myCharacter.gender}${myCharacter.race}`]} />
                </AvatarIconContainer>
                <CharacterName>
                  <CharacterNameText>{myCharacter.name}</CharacterNameText>
                  <OtherInfoText>{myCharacter.faction}</OtherInfoText>
                  <OtherInfoText>{myCharacter.gender} {webAPI.raceString(Race[myCharacter.race])}</OtherInfoText>
                </CharacterName>
                <OtherInfoContainer>
                  {/* We can add banners/faction emblem/general stats(agility, strength, etc) here*/}
                  <OtherInfoText>The content of this box is TBD</OtherInfoText>
                </OtherInfoContainer>
              </Header>
            </Container>
          );
        }}
      </GraphQL>
    );
  }
}

export default GeneralInfo;
