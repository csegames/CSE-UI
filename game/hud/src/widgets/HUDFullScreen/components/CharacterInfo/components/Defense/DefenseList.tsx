/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import gql from 'graphql-tag';
import * as React from 'react';

import { withGraphQL, GraphQLInjectedProps } from '@csegames/camelot-unchained/lib/graphql/react';
import styled from 'react-emotion';

import BodyPartSection from './BodyPartSection';
import StatListContainer from '../StatListContainer';
import DataUnavailable from '../DataUnavailable';
import eventNames from '../../../../lib/eventNames';
import { DamageTypeValuesFragment } from 'gql/fragments/DamageTypeValuesFragment';
import { DefenseListGQL } from 'gql/interfaces';

const Container = styled('div')`
  flex: 1;
  height: 100%;
  background-color: rgba(75, 67, 65, 0.2);
`;

// This is the highest order data structure. We use an array of StatInfoSection's
// to break up the ArmorStats (resistances, mitigations) into sections.

export interface DefenseListProps extends GraphQLInjectedProps<DefenseListGQL.Query> {
  searchValue: string;
}

export interface DefenseListState {
  searchValue: string;
}

class DefenseList extends React.PureComponent<DefenseListProps> {
  private eventHandles: EventHandle[] = [];
  public render() {
    const myEquippedItems = this.props.graphql.data && this.props.graphql.data.myEquippedItems;

    if (myEquippedItems && myEquippedItems.armorStats) {
      return (
        <Container>
          <StatListContainer
            renderContent={() => (
            <div>
              {myEquippedItems.armorStats.map((bodyPartStats, i) => {
                return (
                  <BodyPartSection
                    key={i}
                    name={bodyPartStats.subpartID}
                    searchValue={this.props.searchValue}
                    bodyPartStats={bodyPartStats}
                  />
                );
              })}
            </div>
          )} />
        </Container>
      );
    } else {
      return (
        <DataUnavailable wait={150}>
          Defensive data is not available at this time.
        </DataUnavailable>
      );
    }
  }

  public componentDidMount() {
    this.eventHandles.push(game.on(eventNames.updateCharacterStats, () => {
      this.props.graphql.refetch();
    }));
  }

  public componentWillUnmount() {
    this.eventHandles.forEach(eventHandle => eventHandle.clear());
  }
}

const DefenseListWithQL = withGraphQL<DefenseListProps>({
  query: gql`
    query DefenseListGQL {
      myEquippedItems {
        armorStats {
          subpartID
          armorClass
          resistances {
            ...DamageTypeValues
          }
          mitigations {
            ...DamageTypeValues
          }
        }
      }
    }
    ${DamageTypeValuesFragment}
  `,
})(DefenseList);

export default DefenseListWithQL;
