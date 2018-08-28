/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';

import { TOOLTIP_PADDING } from '../../../lib/constants';
import TooltipInfoSection, { TooltipSection } from './TooltipInfoSection';
import { InventoryItem, EquippedItem } from 'gql/interfaces';

const Container = styled('div')`
  padding: 0 ${TOOLTIP_PADDING};
`;

export interface TooltipArmorInfoMap {
  [section: string]: TooltipSection[];
}

export interface TooltipArmorInfoState {
  resistances: TooltipArmorInfoMap;
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
        {!_.isEmpty(resistances) && Object.keys(resistances).map((section) => {
          // Resistances
          const slotNames = this.getSlotNames(section);
          return (
            <TooltipInfoSection
              useIcon
              turnValueToPercent
              key={section}
              columnCount={4}
              padding={'5px 0'}
              section={section}
              name={'Resistances'}
              stats={resistances[section]}
              slotNames={slotNames}
            />
          );
        })}
      </Container>
    );
  }

  public shouldComponentUpdate(nextProps: TooltipArmorInfoProps, nextState: TooltipArmorInfoState) {
    return !_.isEqual(this.state.resistances, nextState.resistances);
  }

  private getSlotNames = (sectionName: string) => {
    const slotNames: string[] = [];
    const { item } = this.props;
    item.stats.armor.forEach((armorStat) => {
      armorStat.statsPerSlot.forEach((statPerSlot) => {
        if (_.includes(statPerSlot.gearSlot.subpartIDs, sectionName)) {
          slotNames.push(statPerSlot.gearSlot.id);
        }
      });
    });

    return slotNames;
  }

  private getTooltipArmorInfoList = () => {
    const comparedStats = this.getComparedArmorStats();
    const armorResistances: TooltipArmorInfoMap = {};

    const { item } = this.props;
    item.stats.armorBySubpart.forEach((slotStats) => {
      const armorSection = slotStats.subPartId;
      const resistances: { name: string, value: number, compared: number }[] = [];

      // Get resistances
      Object.keys(slotStats.resistances).forEach((statName) => {
        const shouldAdd = slotStats.resistances[statName] !== 0 ||
          (comparedStats.comparedResistances[armorSection] &&
            typeof comparedStats.comparedResistances[armorSection][statName] === 'number');
        if (shouldAdd) {
          resistances.push({
            name: statName,
            value: slotStats.resistances[statName],
            compared: comparedStats.comparedResistances[armorSection] &&
              slotStats.resistances[statName] - comparedStats.comparedResistances[armorSection][statName],
          });
        }
      });

      if (!_.isEmpty(resistances)) {
        armorResistances[armorSection] = resistances;
      }
    });

    // Add stats that equipped items have but inventory does not
    Object.keys(comparedStats.comparedResistances).forEach((armorSection) => {
      const resistances: { name: string, value: number, compared: number }[] = [];
      if (!armorResistances[armorSection]) {
        Object.keys(comparedStats.comparedResistances[armorSection]).forEach((statName) => {
          resistances.push({
            name: statName,
            value: 0,
            compared: -comparedStats.comparedResistances[armorSection][statName],
          });
        });
      }
    });

    return {
      resistances: armorResistances,
    };
  }

  private getComparedArmorStats = () => {
    const { item, equippedItems } = this.props;
    const comparedResistances: {[section: string]: { [statName: string]: number }} = {};
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

      // Search through the item's sub parts
      item.stats.armorBySubpart.forEach((subpart) => {
        // Go through equipped items to find which ones match item stat slots
        replacedEquippedItems.forEach((equippedItem) => {
          if (equippedItem.item.stats.armorBySubpart) {
            const equippedItemSubpartIDs = equippedItem.item.stats.armorBySubpart.map(_subPart => _subPart.subPartId);
            if (_.includes(equippedItemSubpartIDs, subpart.subPartId)) {
              equippedItem.item.stats.armorBySubpart.forEach((equippedItemStat) => {
                const equippedResistances: { [name: string]: number } = {};
                // Get compared resistances
                Object.keys(equippedItemStat.resistances).forEach((statName) => {
                  const shouldAdd = equippedItemStat.resistances[statName] !== 0;
                  if (shouldAdd) {
                    equippedResistances[statName] = equippedItemStat.resistances[statName];
                  }
                });

                comparedResistances[equippedItemStat.subPartId] = equippedResistances;
              });
            }
          }
        });

        if (!comparedResistances[subpart.subPartId]) {
          comparedResistances[subpart.subPartId] = {};
          Object.keys(subpart.resistances).forEach((statName) => {
            if (subpart.resistances[statName] !== 0) {
              comparedResistances[subpart.subPartId][statName] = 0;
            }
          });
        }
      });
    }
    return {
      comparedResistances,
    };
  }
}

export default TooltipArmorInfo;
