/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import gql from 'graphql-tag';
import * as React from 'react';

import { styled } from '@csegames/linaria/react';
import { GridStats } from '@csegames/camelot-unchained/lib/components';
import { withGraphQL, GraphQLInjectedProps } from '@csegames/camelot-unchained/lib/graphql/react';

import DescriptionItem from '../DescriptionItem';
import StatListItem from '../StatListItem';
import StatListContainer from '../StatListContainer';
import DataUnavailable from '../DataUnavailable';
import { prettifyText } from 'fullscreen/lib/utils';
import eventNames from 'fullscreen/lib/itemEvents';
import { WeaponStatsFragment } from 'gql/fragments/WeaponStatsFragment';
import { OffenseListGQL, ItemType } from 'gql/interfaces';
import TabSubHeader from 'shared/Tabs/TabSubHeader';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

const Container = styled.div`
  flex: 1;
  height: 100%;
`;

// #region NoWeaponsContainer constants
const NO_WEAPONS_CONTAINER_FONT_SIZE = 36;
// #endregion
const NoWeaponsContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #D6C4A2;
  font-family: Caudex;
  font-size: ${NO_WEAPONS_CONTAINER_FONT_SIZE}px;

  @media (max-width: 2560px) {
    font-size: ${NO_WEAPONS_CONTAINER_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${NO_WEAPONS_CONTAINER_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region SectionTitle constants
const SECTION_TITLE_FONT_SIZE = 32;
// #endregion
const SectionTitle = styled.span`
  font-size: ${SECTION_TITLE_FONT_SIZE}px;
  margin-left: 5px;

  @media (max-width: 2560px) {
    font-size: ${SECTION_TITLE_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${SECTION_TITLE_FONT_SIZE * HD_SCALE}px;
  }
`;

const SectionIcon = styled.span`
  font-size: ${SECTION_TITLE_FONT_SIZE}px;
  @media (max-width: 2560px) {
    font-size: ${SECTION_TITLE_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${SECTION_TITLE_FONT_SIZE * HD_SCALE}px;
  }
`;

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

export interface OffenseListProps extends GraphQLInjectedProps<OffenseListGQL.Query> {
  searchValue: string;
}

class OffenseList extends React.PureComponent<OffenseListProps> {
  private eventHandles: EventHandle[] = [];
  public render() {
    const myEquippedItems = this.props.graphql.data && this.props.graphql.data.myEquippedItems;
    if (myEquippedItems && myEquippedItems.items) {
      const weaponSlotArray = this.getWeaponSlotArray().sort((a, b) => a.name.localeCompare(b.name));
      return (
        <Container>
          <StatListContainer
            renderContent={() => (
              weaponSlotArray.length === 0 ?
              <NoWeaponsContainer>You do not have any weapons equipped</NoWeaponsContainer> :
              <div>
                {weaponSlotArray.map((weaponSlot: any, i: number) => (
                  <div key={i}>
                    <TabSubHeader useGrayBG>
                      <SectionIcon className={'icon-filter-weapons'} />
                      <SectionTitle>{prettifyText(weaponSlot.name)}</SectionTitle>
                    </TabSubHeader>
                    <GridStats
                      statArray={weaponSlot.statArray}
                      searchValue={this.props.searchValue}
                      howManyGrids={2}
                      shouldRenderEmptyListItems={true}
                      styles={{
                        statListSection: {
                          margin: '0 1px',
                        },
                      }}
                      renderHeaderItem={() => (
                        <DescriptionItem>
                          <header>Name</header>
                          <header>Value</header>
                        </DescriptionItem>
                      )}
                      renderListItem={(item, index) => (
                        <StatListItem
                          index={index}
                          item={item}
                          statName={item.name}
                          statValue={item.value}
                          searchValue={this.props.searchValue}
                        />
                      )}
                    />
                  </div>
                ))}
              </div>
            )}
          />
        </Container>
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
    this.eventHandles.push(game.on(eventNames.updateCharacterStats, () => {
      this.props.graphql.refetch();
    }));
  }

  public componentWillUnmount() {
    this.eventHandles.forEach(eventHandle => eventHandle.clear());
  }

  private getWeaponSlotArray = () => {
    const weaponItems = {};
    this.props.graphql.data.myEquippedItems.items.forEach((equippedItem) => {
      const weaponStats = equippedItem.item.stats.weapon;
      const isWeapon = equippedItem.item.staticDefinition.itemType === ItemType.Weapon;

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
        equippedItem.gearSlots.forEach(gearSlot =>
          weaponSlotName = weaponSlotName.length > 0 ? `${weaponSlotName} ${gearSlot.id}` : gearSlot.id);

        weaponItems[weaponSlotName] = statItems;
      }
    });

    let weaponSlotArray: { name: string, statArray: any[] }[] = [];
    Object.keys(weaponItems).forEach((weaponSlotName) => {
      const statArray = Object.keys(weaponItems[weaponSlotName])
        .filter(key => weaponItems[weaponSlotName][key] !== 0)
        .map((statName) => {
          return {
            name: statName,
            value: weaponItems[weaponSlotName][statName],
          };
        });
      weaponSlotArray = [...weaponSlotArray,
        {
          name: weaponSlotName,
          statArray,
        },
      ];
    });

    return weaponSlotArray;
  }
}

const OffenseListWithQL = withGraphQL<OffenseListProps>({
  query: gql`
    query OffenseListGQL {
      myEquippedItems {
        items {
          gearSlots {
            id
          }
          item {
            id
            staticDefinition {
              itemType
            }
            stats {
              weapon {
                ...WeaponStats
              }
            }
          }
        }
      }
    }
    ${WeaponStatsFragment}
  `,
})(OffenseList);

export default OffenseListWithQL;
