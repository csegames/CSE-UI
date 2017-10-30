/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';

import { ql, utils, events } from 'camelot-unchained';
import { GridStats } from 'camelot-unchained/lib/components';
import { withGraphQL, GraphQLInjectedProps } from 'camelot-unchained/lib/graphql/react';
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';

import DescriptionItem from '../DescriptionItem';
import StatListItem from '../StatListItem';
import StatListContainer from '../StatListContainer';
import DataUnavailable from '../DataUnavailable';
import { colors } from '../../../../lib/constants';
import eventNames from '../../../../lib/eventNames';

export interface OffenseListStyles extends StyleDeclaration {
  OffenseList: React.CSSProperties;
  sectionTitleContainer: React.CSSProperties;
  sectionTitle: React.CSSProperties;
  doesNotMatchSearch: React.CSSProperties;
}

const defaultOffenseListStyle: OffenseListStyles = {
  OffenseList: {
    flex: 1,
    height: '100%',
  },

  sectionTitleContainer: {
    display: 'flex',
    padding: '5px',
    fontSize: 18,
    color: utils.lightenColor(colors.filterBackgroundColor, 150),
    backgroundColor: utils.lightenColor(colors.filterBackgroundColor, 15),
    borderBottom: `1px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)}`,
  },

  sectionTitle: {
    marginLeft: '5px',
  },

  doesNotMatchSearch: {
    opacity: 0.2,
    backgroundColor: `rgba(0,0,0,0.2)`,
  },
};

const defaultStats = {
  piercingDamage: 0,
  piercingBleed: 0,
  piercingArmorPenetration: 0,
  slashingDamage: 0,
  slashingBleed: 0,
  slashingArmorPenetration: 0,
  crushingDamage: 0,
  fallbackCrushingDamage: 0,
  disruption: 0,
  deflectionAmount: 0,
  physicalProjectileSpeed: 0,
  knockbackAmount: 0,
  stability: 0,
  falloffMinDistance: 0,
  falloffMaxDistance: 0,
  falloffReduction: 0,
  deflectionRecovery: 0,
  staminaCost: 0,
  physicalPreparationTime: 0,
  physicalRecoveryTime: 0,
  range: 0,
};

export interface OffenseListProps extends GraphQLInjectedProps<{ myEquippedItems: ql.schema.MyEquippedItems }> {
  styles?: Partial<OffenseListStyles>;
}

export interface OffenseListState {
  searchValue: string;

}

class OffenseList extends React.Component<OffenseListProps, OffenseListState> {
  private updateCharStatsListener: EventListener;

  constructor(props: OffenseListProps) {
    super(props);
    this.state = {
      searchValue: '',
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultOffenseListStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    const myEquippedItems = this.props.graphql.data && this.props.graphql.data.myEquippedItems;

    if (myEquippedItems && myEquippedItems.items) {
      const weaponSlotArray = this.getWeaponSlotArray().sort((a, b) => a.name.localeCompare(b.name));
      return (
        <div className={css(ss.OffenseList, custom.OffenseList)}>
          <StatListContainer
            searchValue={this.state.searchValue}
            onSearchChange={this.onSearchChange}
            renderContent={() => (
              <div>
                {weaponSlotArray.map((weaponSlot: any, i: number) => (
                  <div key={i}>
                    <header
                      className={css(
                      ss.sectionTitleContainer,
                      custom.sectionTitleContainer,
                    )}>
                      <div className={'icon-filter-weapons'} />
                      <span className={css(ss.sectionTitle, custom.sectioTitle)}>{weaponSlot.name}</span>
                    </header>
                    <GridStats
                      statArray={weaponSlot.statArray}
                      searchValue={this.state.searchValue}
                      howManyGrids={2}
                      shouldRenderEmptyListItems={true}
                      renderHeaderItem={() => (
                        <DescriptionItem>
                          <header>Name</header>
                          <header>Value</header>
                        </DescriptionItem>
                      )}
                      renderListItem={(item, index) => (
                        <StatListItem
                          index={index}
                          statName={item.name}
                          statValue={item.value}
                          searchValue={this.state.searchValue}
                        />
                      )}
                    />
                  </div>
                ))}
              </div>
            )}
          />
        </div>
      );
    } else {
      return (
        <DataUnavailable wait={150}>
          Offensive data is not available at this time.
        </DataUnavailable>
      );
    }
  }

  public componentDidMount() {
    this.updateCharStatsListener = events.on(eventNames.updateCharacterStats, () => {
      this.props.graphql.refetch();
    });
  }

  public componentWillUnmount() {
    events.off(this.updateCharStatsListener);
  }

  private onSearchChange = (searchValue: string) => {
    this.setState({ searchValue });
  }

  private getWeaponSlotArray = () => {
    let weaponItems = {};
    this.props.graphql.data.myEquippedItems.items.forEach((equippedItem) => {
      const weaponStats = equippedItem.item.stats.weapon;
      const isWeapon = _.find(equippedItem.gearSlots, (gearSlot) =>
        gearSlot.id === 'PrimaryHandWeapon' || gearSlot.id === 'SecondaryHandWeapon');
      
      if (isWeapon) {
        let statItems = defaultStats;
        Object.keys(weaponStats).forEach((weaponStat) => {
          if (statItems[weaponStat]) {
            statItems = {
              ...statItems,
              [weaponStat]: statItems[weaponStat] + weaponStats[weaponStat],
            };
            return;
          }

          statItems = {
            ...statItems,
            [weaponStat]: weaponStats[weaponStat],
          };

          return;
        });

        let weaponSlotName = '';
        equippedItem.gearSlots.forEach((gearSlot) =>
          weaponSlotName = weaponSlotName.length > 0 ? `${weaponSlotName} ${gearSlot.id}` : gearSlot.id);

        weaponItems[weaponSlotName] = statItems;
      }
    });
    
    let weaponSlotArray: { name: string, statArray: any[] }[] = [];
    Object.keys(weaponItems).forEach((weaponSlotName) => {
      const statArray = Object.keys(weaponItems[weaponSlotName]).map((statName) => {
        return {
          name: statName,
          value: weaponItems[weaponSlotName][statName],
        };
      });
      weaponSlotArray = [...weaponSlotArray,
        {
          name: weaponSlotName,
          statArray,
        }
      ];
    });

    return weaponSlotArray;
  }
}

const OffenseListWithQL = withGraphQL({
  query: `
    query OffenseListQuery {
      myEquippedItems {
        items {
          gearSlots {
            id
          }
          item {
            id
            stats {
              weapon {
                ...WeaponStats
              }
            }
          }
        }
      }
    }

    fragment WeaponStats on WeaponStat_Single {
      piercingDamage
      piercingBleed
      piercingArmorPenetration
      slashingDamage
      slashingBleed
      slashingArmorPenetration
      crushingDamage
      fallbackCrushingDamage
      disruption
      deflectionAmount
      physicalProjectileSpeed
      knockbackAmount
      stability
      falloffMinDistance
      falloffMaxDistance
      falloffReduction
      deflectionRecovery
      staminaCost
      physicalPreparationTime
      physicalRecoveryTime
      range
    }
  `,
})(OffenseList);

export default OffenseListWithQL;
