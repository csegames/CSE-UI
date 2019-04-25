/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import gql from 'graphql-tag';
import { styled } from '@csegames/linaria/react';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { AbilityTypeSelectItem } from './AbilityTypeSelectItem';
import { AbilityTypeSelectQuery } from 'gql/interfaces';
import { AbilityType } from 'services/session/AbilityBuilderState';

const query = gql`
  query AbilityTypeSelectQuery($classID: String!) {
    game {
      class(class: $classID) {
        buildableAbilityNetworks {
          id
          display {
            name
          }
        }
      }
    }
  }
`;

const Container = styled.div`
  margin: 20px;
  fleX: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-image: url(../images/abilitybuilder/hd/select-frame-border-bg.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;

  @media (max-width: 2560px) {
    margin: 15px;
  }

  @media (max-width: 1920px) {
    margin: 10px;
  }
`;

export interface Props {
  onSelectType: (type: AbilityType) => void;
}

export class AbilityTypeSelect extends React.PureComponent<Props> {
  public render() {
    return (
      <GraphQL query={{ query, variables: { classID: Archetype[game.selfPlayerState.classID] } }}>
        {(graphql: GraphQLResult<AbilityTypeSelectQuery.Query>) => {
          if (graphql.loading || !graphql.data) return null;
          const buildableNetworks = graphql.data.game.class.buildableAbilityNetworks;
          return (
            <Container>
              {buildableNetworks.map((network) => {
                return (
                  <AbilityTypeSelectItem
                    type={{ id: network.id, name: network.display.name }}
                    width={100 / buildableNetworks.length}
                    onSelectType={this.props.onSelectType}
                  />
                );
              })}
            </Container>
          );
        }}
      </GraphQL>
    );
  }
}
