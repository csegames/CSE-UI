/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-06-27 16:43:03
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-06-27 16:57:05
 */

import * as React from 'react';
import * as _ from 'lodash';
import {ql} from 'camelot-unchained';
import {css, StyleSheet, StyleDeclaration} from 'aphrodite';

export interface TooltipArmorInfoStyles extends StyleDeclaration {
  armorInfo: React.CSSProperties;
  totalStatNumber: React.CSSProperties;
  statNumber: React.CSSProperties;
  regularText: React.CSSProperties;
}

export const defaultTooltipArmorInfoStyle: TooltipArmorInfoStyles = {
  armorInfo: {
    columnCount: 3,
    webkitColumnCount: 3,
    maxHeight: '50%',
    maxWidth: '100%',
  },
  totalStatNumber: {
    display: 'inline',
    color: '#00bfff',
    fontSize: '14px',
    margin: 0,
    padding: 0,
  },
  statNumber: {
    display: 'inline',
    color: '#08d922',
    fontSize: '14px',
    margin: 0,
    padding: 0,
  },
  regularText: {
    display: 'inline',
    fontSize: '14px',
    color: 'white',
    margin: 0,
    padding: 0,
  },
};

export interface TooltipArmorInfoProps {
  styles?: Partial<TooltipArmorInfoStyles>;
  item: ql.schema.Item;
  slotName: string;
  gearSlots: ql.schema.GearSlotDefRef;
}

class TooltipArmorInfo extends React.Component<TooltipArmorInfoProps, {}> {
  private ss: TooltipArmorInfoStyles;

  public render() {
    this.ss = StyleSheet.create({...defaultTooltipArmorInfoStyle, ...this.props.styles});
    const {addedResistances, addedMitigations} = this.calculateArmorStats();
    return (
      <div>
        {this.displayArmorSection(addedResistances, 'Resistances')}
        {this.displayArmorSection(addedMitigations, 'Mitigations')}
      </div>
    );
  }

  private calculateArmorStats = () => {
    interface StatInfo {
      [statType: string]: number;
    }
    // Armor has a unique layout so we need a seperate function for armor stat info
    const {item, slotName, gearSlots} = this.props;
    const itemInfo = item.staticDefinition;
    let addedResistances: { total: StatInfo, specific: StatInfo } = {total: {}, specific: {}};
    let addedMitigations: { total: StatInfo, specific: StatInfo } = {total: {}, specific: {}};
    const statSlots = itemInfo.gearSlotSets.length === 1 ?
      itemInfo.gearSlotSets[0].gearSlots : itemInfo.gearSlotSets.length > 1 && gearSlots;

    if (item.stats && item.stats.armor) {

      // Specific stats for
      if (slotName) {
        const validArmorSlotName = slotName.substring(0, 1).toLowerCase() + slotName.substring(1, slotName.length);
        const slot = item.stats.armor[validArmorSlotName];
        const slotResistances = slot && slot.resistances;
        const slotMitigations = slot && slot.mitigations;
        slotResistances && Object.keys(slotResistances).forEach((resistanceType) => {
          const slotResistance = slotResistances[resistanceType];
          if (_.includes(resistanceType, 'typename')) return;
          if (slotResistance > 0) addedResistances.specific[resistanceType] = slotResistances[resistanceType];
        });
        slotMitigations && Object.keys(slotMitigations).forEach((mitigationType) => {
          const slotMitigation = slotMitigations[mitigationType];
          if (_.includes(mitigationType, 'typename')) return;
          if (slotMitigation > 0) addedMitigations.specific[mitigationType] = slotResistances[mitigationType];
        });
      }

      // Total stats for items that only have one possible gearSlotSet
      if (statSlots) {
        const totalStats = this.calculateTotalStats(statSlots, addedResistances, addedMitigations);
        addedResistances = totalStats.addedResistances;
        addedMitigations = totalStats.addedMitigations;
      } else {
        itemInfo.gearSlotSets.forEach((gearSlotSet) => {
          const totalStats = this.calculateTotalStats(gearSlotSet.gearSlots, addedResistances, addedMitigations);
          addedResistances = totalStats.addedResistances;
          addedMitigations = totalStats.addedMitigations;
        });
      }
    }
    return {
      addedResistances,
      addedMitigations,
    };
  }

  private calculateTotalStats = (statSlots: any, addedResistances: any, addedMitigations: any) => {
    const {item} = this.props;
    statSlots.forEach((gearSlot: ql.schema.GearSlotDefRef) => {
      const slotName = gearSlot.id;
      const validArmorSlotName = slotName.substring(0, 1).toLowerCase() + slotName.substring(1, slotName.length);
      const slot = item.stats.armor[validArmorSlotName];
      const slotResistances = slot && slot.resistances;
      const slotMitigations = slot && slot.mitigations;
      slotResistances && Object.keys(slotResistances).forEach((resistanceType) => {
        const slotResistance = slotResistances[resistanceType];
        if (_.includes(resistanceType, 'typename')) return;
        if (slotResistance > 0) {
          if (addedResistances.total[resistanceType]) {
            addedResistances.total[resistanceType] += slotResistance;
          } else {
            addedResistances.total[resistanceType] = slotResistance;
          }
        }
      });
      slotMitigations && Object.keys(slotMitigations).forEach((mitigationType) => {
        const slotMitigation = slotMitigations[mitigationType];
        if (_.includes(mitigationType, 'typename')) return;
        if (slotMitigation > 0) {
          if (addedMitigations.total[mitigationType]) {
            addedMitigations.total[mitigationType] += slotMitigation;
          } else {
            addedMitigations.total[mitigationType] = slotMitigation;
          }
        }
      });
    });
    return {
      addedResistances,
      addedMitigations,
    };
  }

  private displayArmorSection = (stats: any, title: string) => {
    const ss = this.ss;
    const equippedItemInfo = this.props.slotName;

    if (!_.isEmpty(stats.specific) && equippedItemInfo) {
      return (
        <div>
          <p className={css(ss.regularText)}>{title}:</p>
          <div>
            <p className={css(ss.statNumber)}>Slot</p>
            <p className={css(ss.regularText)}> | </p>
            <p className={css(ss.totalStatNumber)}>Total</p>
          </div>
          <div className={css(ss.armorInfo)}>
            {
              Object.keys(stats.specific).map((statType: string, i: number) => {
                const specificStat = (Math.round(stats.specific[statType] * 100) / 100).toFixed(2);
                const totalStat = (Math.round(stats.total[statType] * 100) / 100).toFixed(2);
                return <div key={i}>
                  <p className={css(ss.statNumber)}>{specificStat} </p>
                  <p className={css(ss.regularText)}>| </p>
                  <p className={css(ss.totalStatNumber)}>{totalStat} </p>
                  <p className={css(ss.regularText)}>
                    {statType.charAt(0).toUpperCase()}{statType.substring(1, statType.length)}
                  </p>
                </div>;
              })
            }
          </div>
        </div>
      );
    }
    if (!_.isEmpty(stats.total) && !equippedItemInfo) {
      return (
        <div>
          <p className={css(ss.regularText)}>{title}:</p>
          <div className={css(ss.armorInfo)}>
            {
              Object.keys(stats.total).map((statType: string, i: number) => {
                const totalStat = (Math.round(stats.total[statType] * 100) / 100).toFixed(2);
                return <div key={i}>
                  <p className={css(ss.statNumber)}>{totalStat} </p>
                  <p className={css(ss.regularText)}>
                    {statType.charAt(0).toUpperCase()}{statType.substring(1, statType.length)}
                  </p>
                </div>;
              })
            }
          </div>
        </div>
      );
    }
  }
}

export default TooltipArmorInfo;
