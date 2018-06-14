/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as events from '@csegames/camelot-unchained/lib/events';
import { ql } from '@csegames/camelot-unchained';
import { withGraphQL, GraphQLInjectedProps } from '@csegames/camelot-unchained/lib/graphql/react';
import styled from 'react-emotion';

import BodyPartSection from './BodyPartSection';
import StatListContainer from '../StatListContainer';
import DataUnavailable from '../DataUnavailable';
import eventNames from '../../../../lib/eventNames';

const Container = styled('div')`
  flex: 1;
  height: 100%;
  background-color: rgba(75, 67, 65, 0.2);
`;

// This is the highest order data structure. We use an array of StatInfoSection's
// to break up the ArmorStats (resistances, mitigations) into sections.

export interface DefenseListProps extends GraphQLInjectedProps<{ myEquippedItems: ql.schema.MyEquippedItems }> {
}

export interface DefenseListState {
  searchValue: string;
}

class DefenseList extends React.Component<DefenseListProps, DefenseListState> {
  private updateCharacterStatsListener: number;

  constructor(props: DefenseListProps) {
    super(props);
    this.state = {
      searchValue: '',
    };
  }

  public render() {
    const myEquippedItems = this.props.graphql.data && this.props.graphql.data.myEquippedItems;

    if (myEquippedItems && myEquippedItems.armorStats) {
      return (
        <Container>
          <StatListContainer
            searchValue={this.state.searchValue}
            onSearchChange={this.onSearchChange}
            renderContent={() => (
            <div>
              {myEquippedItems.armorStats.map((bodyPartStats, i) => {
                return (
                  <BodyPartSection
                    key={i}
                    name={bodyPartStats.subpartID}
                    searchValue={this.state.searchValue}
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
    this.updateCharacterStatsListener = events.on(eventNames.updateCharacterStats, () => {
      this.props.graphql.refetch();
    });
  }

  public componentWillUnmount() {
    events.off(this.updateCharacterStatsListener);
  }

  private onSearchChange = (searchValue: string) => {
    this.setState({ searchValue });
  }
}

const DefenseListWithQL = withGraphQL({
  query: `
    query DefenseListQuery {
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

    fragment DamageTypeValues on DamageType_Single {
      slashing
      piercing
      crushing
      physical
      acid
      poison
      disease
      earth
      water
      fire
      air
      lightning
      frost
      elemental
      life
      mind
      spirit
      radiant
      light
      death
      shadow
      chaos
      void
      dark
      arcane
    }
  `,
})(DefenseList);

export default DefenseListWithQL;
