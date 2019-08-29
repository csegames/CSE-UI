/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import { styled } from '@csegames/linaria/react';

import TooltipInfoSection, { TooltipSection } from './TooltipInfoSection';
import { InventoryItem, EquippedItem } from 'gql/interfaces';
import { HD_SCALE, MID_SCALE } from 'fullscreen/lib/constants';

// #region Container constants
const CONTAINER_PADDING_HORIZONTAL = 20;
// #endregion
const Container = styled.div`
  padding: 0 ${CONTAINER_PADDING_HORIZONTAL}px;

  @media (max-width: 2560px) {
    padding: 0 ${CONTAINER_PADDING_HORIZONTAL * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding: 0 ${CONTAINER_PADDING_HORIZONTAL * HD_SCALE}px;
  }
`;

export interface TooltipArmorInfoState {
  resistances: TooltipSection[];
}

export interface TooltipArmorInfoProps {
  item: InventoryItem.Fragment;
  equippedItems: EquippedItem.Fragment[];
}

class TooltipArmorInfo extends React.Component<TooltipArmorInfoProps, TooltipArmorInfoState> {
  constructor(props: TooltipArmorInfoProps) {
    super(props);
    this.state = {
      resistances: this.getTooltipArmorInfoList().resistances,
    };
  }
  public render() {
    const resistances = this.state.resistances;
    return (
      <Container>
        {!_.isEmpty(resistances) &&
          // Resistances
            <TooltipInfoSection
              useIcon
              columnCount={4}
              padding={'5px 0'}
              section={'Resistances'}
              name={'Resistances'}
              stats={resistances}
            />
          }
      </Container>
    );
  }

  public shouldComponentUpdate(nextProps: TooltipArmorInfoProps, nextState: TooltipArmorInfoState) {
    return !_.isEqual(this.state.resistances, nextState.resistances);
  }

  private getTooltipArmorInfoList = () => {
    // const comparedStats = this.getComparedArmorStats();
    const resistances: { name: string, value: number, compared: number }[] = [];

    const { item } = this.props;
    const comparedStats = this.getComparedArmorStats();
    Object.keys(item.stats.resistances).forEach((statName) => {

      // Get resistances
      const shouldAdd = item.stats.resistances[statName] !== 0;
      if (shouldAdd) {
        resistances.push({
          name: statName,
          value: item.stats.resistances[statName],
          compared: item.location.equipped ? null :
            item.stats.resistances[statName] - (comparedStats.comparedResistances[statName] || 0),
        });
      }
    });

    // Add stats that equipped items have but inventory does not
    Object.keys(comparedStats).forEach((statName) => {
      const resistances: { name: string, value: number, compared: number }[] = [];
      if (!resistances[statName]) {
        resistances.push({
          name: statName,
          value: 0,
          compared: item.location.equipped ? null : -comparedStats.comparedResistances[statName],
        });
      }
    });

    return {
      resistances,
    };
  }

  private getComparedArmorStats = () => {
    const { item, equippedItems } = this.props;
    const comparedResistances: { [statName: string]: number } = {};
    if (equippedItems) {
      // Only compare against the equipped items the inventory item will replace
      let replacedEquippedItems: EquippedItem.Fragment[] = [...equippedItems];
      if (item.staticDefinition.gearSlotSets[0]) {
        const itemGearSlotIDs = item.staticDefinition.gearSlotSets[0].gearSlots.map(_gearSlot => _gearSlot.id);
        replacedEquippedItems = _.filter(equippedItems, (_equippedItem) => {
          const equippedGearSlotIDs = _equippedItem.gearSlots.map(_gearSlot => _gearSlot.id);
          return _.findIndex(itemGearSlotIDs, itemSlotID => _.includes(equippedGearSlotIDs, itemSlotID)) !== -1;
        });
      }

      replacedEquippedItems.forEach((equippedItem) => {
        Object.keys(equippedItem.item.stats.resistances).forEach((statName) => {
          const shouldAdd = equippedItem.item.stats.resistances[statName] !== 0 && equippedItem.item.id !== item.id;
          if (shouldAdd) {
            comparedResistances[statName] = equippedItem.item.stats.resistances[statName];
          }
        });
      });
    }
    return {
      comparedResistances,
    };
  }
}

export default TooltipArmorInfo;
