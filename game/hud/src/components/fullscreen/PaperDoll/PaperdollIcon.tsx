/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { getPaperDollIcon, getPaperDollBaseIcon } from 'fullscreen/lib/utils';

const query = `
  query PaperdollIcon {
    myCharacter {
      id
      faction
      race
      gender
      archetype
    }
  }
`;

const Icon = styled.img`
  position: absolute;
  right: 0;
  left: 0;
  bottom: 115px;
  margin: auto;
  max-width: 100%;
  width: auto;
  height: 80%;
`;

const Base = styled.img`
  position: absolute;
  right: 0px;
  left: 0px;
  bottom: 115px;
  margin: auto;
  width: auto;
  height: 20%;
  object-fit: contain;
`;

export interface Props {

}

class PaperdollIcon extends React.Component<Props> {
  public render() {
    return (
      <GraphQL query={query}>
        {(graphql: GraphQLResult<Pick<GraphQL.Schema.CUQuery, 'myCharacter'>>) => {
          if (graphql.loading || (graphql.lastError && graphql.lastError !== 'OK') || !graphql.data) {
            return (
              <div>Loading...</div>
            );
          }

          const { myCharacter } = graphql.data;
          const standingIcon = getPaperDollIcon(myCharacter.gender, myCharacter.race, myCharacter.archetype);
          const baseIcon = getPaperDollBaseIcon(myCharacter.faction);
          return (
            <div>
              <Base src={baseIcon} />
              <Icon src={standingIcon} />
            </div>
          );
        }}
      </GraphQL>
    );
  }
}

export default PaperdollIcon;
