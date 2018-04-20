/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';
import { ql, events, utils } from '@csegames/camelot-unchained';
import { withGraphQL, GraphQLInjectedProps } from '@csegames/camelot-unchained/lib/graphql/react';

import BodyPartSection from './BodyPartSection';
import StatListContainer from '../StatListContainer';
import DataUnavailable from '../DataUnavailable';
import { colors } from '../../../../lib/constants';
import eventNames from '../../../../lib/eventNames';

export interface DefenseListStyle extends StyleDeclaration {
  DefenseList: React.CSSProperties;
  statSectionTitle: React.CSSProperties;
}

const defaultDefenseListStyle: DefenseListStyle = {
  DefenseList: {
    flex: 1,
    height: '100%',
    backgroundColor: 'rgba(75, 67, 65, 0.2)',
  },

  statSectionTitle: {
    textAlign: 'center',
    padding: '5px',
    fontSize: 24,
    color: utils.lightenColor(colors.filterBackgroundColor, 150),
    backgroundColor: utils.lightenColor(colors.filterBackgroundColor, 20),
  },
};

// This is the highest order data structure. We use an array of StatInfoSection's
// to break up the ArmorStats (resistances, mitigations) into sections.

export interface DefenseListProps extends GraphQLInjectedProps<{ myEquippedItems: ql.schema.MyEquippedItems }> {
  styles?: Partial<DefenseListStyle>;
}

export interface DefenseListState {
  searchValue: string;
}

class DefenseList extends React.Component<DefenseListProps, DefenseListState> {
  private ss: DefenseListStyle;
  private custom: Partial<DefenseListStyle>;
  private updateCharacterStatsListener: EventListener;

  constructor(props: DefenseListProps) {
    super(props);
    this.state = {
      searchValue: '',
    };
  }

  public render() {
    const ss = this.ss =  StyleSheet.create(defaultDefenseListStyle);
    const custom = this.custom = StyleSheet.create(this.props.styles || {});
    const myEquippedItems = this.props.graphql.data && this.props.graphql.data.myEquippedItems;

    if (myEquippedItems && myEquippedItems.armorStats) {
      return (
        <div className={css(ss.DefenseList, custom.DefenseList)}>
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
        </div>
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
