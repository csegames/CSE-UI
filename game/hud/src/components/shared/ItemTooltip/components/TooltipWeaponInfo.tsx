/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { styled } from '@csegames/linaria/react';

import {
  shortenedWeaponStatWords,
  weaponStatUnits,
  MORE_THAN_STAT_COLOR,
  LESS_THAN_STAT_COLOR,
  HD_SCALE,
  MID_SCALE,
} from 'fullscreen/lib/constants';
import { prettifyText } from 'fullscreen/lib/utils';
import {
  InventoryItem,
  EquippedItem,
} from 'gql/interfaces';

// #region Container constants
const CONTAINER_PADDING = 20;
// #endregion
const Container = styled.div`
  padding: ${CONTAINER_PADDING}px;
  column-count: 2;
  color: #C3C3C3;

  @media (max-widht: 2560px) {
    padding: ${CONTAINER_PADDING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding: ${CONTAINER_PADDING * HD_SCALE}px;
  }
`;

const StatContainer = styled.div`
  width: 100%;
  -webkit-column-break-inside: avoid;
`;

// #region WeaponStatItem constants
const WEAPON_STAT_ITEM_FONT_SIZE = 24;
// #endregion
const WeaponStatItem = styled.div`
  display: flex;
  justify-content: space-between;
  white-space: nowrap;
  font-size: ${WEAPON_STAT_ITEM_FONT_SIZE}px;

  @media (max-width: 2560px) {
    font-size: ${WEAPON_STAT_ITEM_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${WEAPON_STAT_ITEM_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region StatName constants
const STAT_NAME_MARGIN_RIGHT = 10;
const STAT_NAME_FONT_SIZE = 32;
// #endregion
const StatName = styled.div`
  display: flex;
  margin-right: ${STAT_NAME_MARGIN_RIGHT}px;
  font-size: ${STAT_NAME_FONT_SIZE}px;

  @media (max-width: 2560px) {
    margin-right: ${STAT_NAME_MARGIN_RIGHT * MID_SCALE}px;
    font-size: ${STAT_NAME_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    margin-right: ${STAT_NAME_MARGIN_RIGHT * HD_SCALE}px;
    font-size: ${STAT_NAME_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region StatValueContainer constants
const STAT_VALUE_CONTAINER_MIN_WIDTH = 100;
// #endregion
const StatValueContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  min-width: ${STAT_VALUE_CONTAINER_MIN_WIDTH}px;

  @media (max-width: 2560px) {
    min-width: ${STAT_VALUE_CONTAINER_MIN_WIDTH * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    min-width: ${STAT_VALUE_CONTAINER_MIN_WIDTH * HD_SCALE}px;
  }
`;

// #region StatValue constants
const STAT_VALUE_FONT_SIZE = 32;
// #endregion
const StatValue = styled.div`
  color: ${(props: any) => props.color ? props.color : '#C3C3C3'};
  font-size: ${STAT_VALUE_FONT_SIZE}px;

  @media (max-width: 2560px) {
    font-size: ${STAT_VALUE_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${STAT_VALUE_FONT_SIZE * HD_SCALE}px;
  }
`;

// #region UnitText constants
const UNIT_TEXT_HEIGHT = 36;
const UNIT_TEXT_MARGIN_LEFT = 8;
// #endregion
const UnitText = styled.div`
  display: flex;
  align-items: flex-end;
  font-size: 0.85em;
  height: ${UNIT_TEXT_HEIGHT}px;
  margin-left: ${UNIT_TEXT_MARGIN_LEFT}px;
  color: #7d7d7d;

  @media (max-width: 2560px) {
    height: ${UNIT_TEXT_HEIGHT * MID_SCALE}px;
    margin-left: ${UNIT_TEXT_MARGIN_LEFT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    height: ${UNIT_TEXT_HEIGHT * HD_SCALE}px;
    margin-left: ${UNIT_TEXT_MARGIN_LEFT * HD_SCALE}px;
  }
`;

export interface TooltipWeaponInfoState {
  weaponStats: {[statName: string]: {
    value: number,
    compared: number | boolean,
  }};
}

export interface TooltipWeaponInfoProps {
  item: InventoryItem.Fragment;
  equippedItems: EquippedItem.Fragment[];
}

class TooltipWeaponInfo extends React.Component<TooltipWeaponInfoProps, TooltipWeaponInfoState> {
  constructor(props: TooltipWeaponInfoProps) {
    super(props);
    this.state = {
      weaponStats: this.getFilteredWeaponStats(),
    };
  }

  public render() {
    const weaponStats = this.state.weaponStats;
    return (
      <Container>
        {Object.keys(weaponStats).map((statName, i) => {
          const statValues = weaponStats[statName];
          return (
            <StatContainer key={i}>
              <WeaponStatItem>
                <StatName>
                  {prettifyText(statName, shortenedWeaponStatWords)}
                  <UnitText>{weaponStatUnits[statName] ? `${weaponStatUnits[statName]}` : ''}</UnitText>
                </StatName>
                <StatValueContainer>
                  <StatValue>{Number(statValues.value.toFixed(2))}&nbsp;</StatValue>
                  {typeof statValues.compared === 'number' && statValues.compared !== 0 &&
                    <StatValue color={statValues.compared > 0 ? MORE_THAN_STAT_COLOR : LESS_THAN_STAT_COLOR}>
                      ({`${statValues.compared > 0 ? '+' : ''}${Number(statValues.compared.toFixed(2))}`})
                    </StatValue>
                  }
                </StatValueContainer>
              </WeaponStatItem>
            </StatContainer>
          );
        })}
      </Container>
    );
  }

  public shouldComponentUpdate(nextProps: TooltipWeaponInfoProps, nextState: TooltipWeaponInfoState) {
    return !_.isEqual(this.state.weaponStats, nextState.weaponStats);
  }

  private getFilteredWeaponStats = () => {
    const weaponStats = this.props.item.stats.weapon;
    const comparedStats = this.getComparedWeaponStats();
    const filteredWeaponStats = {};
    Object.keys(weaponStats).forEach((statName) => {
      const comparedStat = (comparedStats && typeof comparedStats[statName] === 'number') &&
          (weaponStats[statName] !== 0 || comparedStats[statName] !== 0) ?
          weaponStats[statName] - comparedStats[statName] : false;
      if (weaponStats[statName] !== 0 || comparedStat) {

        filteredWeaponStats[statName] = {
          value: weaponStats[statName],
          compared: comparedStat,
        };
      }
    });

    return filteredWeaponStats;
  }

  private getComparedWeaponStats = () => {
    const { item, equippedItems } = this.props;
    let itemsWithComparedStats: InventoryItem.Fragment[] = [];

    if (equippedItems && item.staticDefinition.gearSlotSets[0]) {
      // Find which items actually contain comparable stats
      if (item.staticDefinition.gearSlotSets[0]) {
        const itemGearSlotIDs = item.staticDefinition.gearSlotSets[0].gearSlots.map(_gearSlot => _gearSlot.id);
        itemsWithComparedStats = _.filter(equippedItems, (_equippedItem) => {
          const equippedGearSlotIDs = _equippedItem.gearSlots.map(_gearSlot => _gearSlot.id);
          return _.findIndex(itemGearSlotIDs, itemSlotID => _.includes(equippedGearSlotIDs, itemSlotID)) !== -1;
        }).map(item => item.item);
      }

      itemsWithComparedStats = _.uniqBy(itemsWithComparedStats, item => item.id);

      const comparedStats = {};
      if (!_.isEmpty(itemsWithComparedStats)) {
        itemsWithComparedStats.forEach((_item) => {
          Object.keys(_item.stats.weapon).forEach((statName) => {
            if (comparedStats[statName]) {
              comparedStats[statName] += _item.stats.weapon[statName];
            } else {
              comparedStats[statName] = _item.stats.weapon[statName];
            }
          });
        });
      } else {
        Object.keys(item.stats.weapon).forEach((statName) => {
          comparedStats[statName] = 0;
        });
      }

      return comparedStats;
    } else {
      // There are no comparable stats
      return false;
    }
  }
}

export default TooltipWeaponInfo;
