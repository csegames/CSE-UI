/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';
import { utils } from '@csegames/camelot-unchained';

import {
  shortenedWeaponStatWords,
  weaponStatUnits,
  MORE_THAN_STAT_COLOR,
  LESS_THAN_STAT_COLOR,
  TOOLTIP_PADDING,
} from '../../../lib/constants';
import { prettifyText } from '../../../lib/utils';
import { InventoryItemFragment, EquippedItemFragment } from '../../../../../gqlInterfaces';

const Container = styled('div')`
  padding: ${TOOLTIP_PADDING};
  column-count: 2;
  color: #C3C3C3;
`;

const StatContainer = styled('div')`
  width: 100%;
  -webkit-column-break-inside: avoid;
`;

const WeaponStatItem = styled('div')`
  display: flex;
  justify-content: space-between;
  white-space: nowrap;
  font-size: 12px;
`;

const StatName = styled('div')`
  display: flex;
  margin-right: 5px;
`;

const StatValueContainer = styled('div')`
  display: flex;
  justify-content: flex-end;
  min-width: 50px;
`;

const StatValue = styled('div')`
  color: ${(props: any) => props.color ? props.color : '#C3C3C3'};
`;

const UnitText = styled('div')`
  display: flex;
  align-items: flex-end;
  font-size: 0.85em;
  height: 18px;
  margin-left: 4px;
  color: ${utils.darkenColor('#C3C3C3', 40)}
`;

export interface TooltipWeaponInfoState {
  weaponStats: {[statName: string]: {
    value: number,
    compared: number | boolean,
  }};
}

export interface TooltipWeaponInfoProps {
  item: InventoryItemFragment;
  equippedItems: EquippedItemFragment[];
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
    let itemsWithComparedStats: InventoryItemFragment[] = [];

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
