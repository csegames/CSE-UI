/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-06-06 11:58:20
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-07-06 14:45:00
 */

import * as React from 'react';
import { css, StyleDeclaration, StyleSheet } from 'aphrodite';
import { graphql, InjectedGraphQLProps } from 'react-apollo';

import queries from '../../../../../../gqlDocuments';
import { StatInfoQuery } from '../../../../../../gqlInterfaces';
import { prettifySlotName } from '../../../../lib/utils';

export interface StatInfoStyle extends StyleDeclaration {
  statInfoContainer: React.CSSProperties;
  damageContainer: React.CSSProperties;
  resistancesContainer: React.CSSProperties;
  nameText: React.CSSProperties;
  sectionHeaderText: React.CSSProperties;
  statNumber: React.CSSProperties;
  zeroStatNumber: React.CSSProperties;
  generalText: React.CSSProperties;
  inlineText: React.CSSProperties;
}

export const defaultStatInfoStyles: StatInfoStyle = {
  statInfoContainer: {
    height: '50%',
    width: '55%',
    border: '1px solid #222',
    padding: '5px',
    marginBottom: '10px',
  },
  damageContainer: {
    maxHeight: '50%',
    maxWidth: '100%',
    columnCount: 2,
    webkitColumnCount: 2,
    marginBottom: '10px',
  },
  resistancesContainer: {
    maxHeight: '50%',
    maxWidth: '100%',
    columnCount: 3,
    webkitColumnCount: 3,
    marginBottom: '10px',
  },
  nameText: {
    fontSize: '24px',
    color: 'white',
  },
  sectionHeaderText: {
    fontSize: '18px',
    color: 'white',
    margin: '0 0 5px 0',
    padding: '0',
  },
  statNumber: {
    display: 'inline',
    color: '#08d922',
    fontSize: '16px',
    margin: 0,
    padding: 0,
  },
  zeroStatNumber: {
    display: 'inline',
    color: 'yellow',
    fontSize: '16px',
    margin: 0,
    padding: 0,
  },
  generalText: {
    fontSize: '16px',
    color: 'white',
    margin: 0,
    padding: 0,
  },
  inlineText: {
    display: 'inline',
    fontSize: '16px',
    color: 'white',
    margin: 0,
    padding: 0,
  },
};

export interface StatInfoProps extends InjectedGraphQLProps<StatInfoQuery> {
  styles?: Partial<StatInfoStyle>;
}

export interface StatInfoState {
  weaponStats: any;
  resistances: any;
}

class StatInfo extends React.Component<StatInfoProps, StatInfoState> {
  constructor(props: any) {
    super(props);
    this.state = {
      weaponStats: {},
      resistances: {},
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultStatInfoStyles);
    const custom = StyleSheet.create(this.props.styles || {});

    return (
      <div className={css(ss.statInfoContainer, custom.statInfoContainer)}>
        <p className={css(ss.sectionHeaderText, custom.sectionHeaderText)}>Damage</p>
        {this.renderWeaponStats(ss, custom)}
        <div>
          <p className={css(ss.sectionHeaderText, custom.sectionHeaderText)}>Resistances</p>
          {this.renderResistances(ss, custom)}
        </div>
      </div>
    );
  }

  public componentDidMount() {
    const { data } = this.props;
    const weaponStats = this.state.weaponStats;
    const resistances = this.state.resistances;
    if (data.myEquippedItems) {
      data.myEquippedItems.forEach((equippedItem) => {
        const weapon = equippedItem.item.stats.weapon;
        const armor = equippedItem.item.stats.armor;

        if (weapon) {
          Object.keys(weapon).forEach((weaponStat) => {
            weaponStats[weaponStat] = weapon[weaponStat];
          });
          this.setState({ weaponStats });
        }

        if (armor) {
          Object.keys(armor).forEach((armorSlot) => {
            Object.keys(armor[armorSlot].resistances).forEach((resistance) => {
              if (resistances[resistance]) {
                resistances[resistance] += armor[armorSlot].resistances[resistance];
              } else {
                resistances[resistance] = armor[armorSlot].resistances[resistance];
              }
            });
          });
          this.setState({ resistances });
        }
      });
    }
  }

  private renderWeaponStats = (ss: StatInfoStyle, custom: Partial<StatInfoStyle>) => {
    const { weaponStats } = this.state;
    return (
      <div className={css(ss.damageContainer, custom.damageContainer)}>
        {Object.keys(weaponStats).sort((a, b) => a.localeCompare(b)).map((damageType: string, i: number) => {
          if (Math.round((weaponStats[damageType] * 100)) / 100 >= 0) {
            const statClassName = weaponStats[damageType] > 0 ?
              css(ss.statNumber, custom.statNumber) :
              css(ss.zeroStatNumber, custom.zeroStatNumber);
            return <div key={i}>
              <p className={css(ss.inlineText, custom.inlineText)}>{prettifySlotName(damageType)} </p>
              <p className={statClassName}>{Math.round((weaponStats[damageType] * 100)) / 100}</p>
            </div>;
          }
        })}
      </div>
    );
  }

  private renderResistances = (ss: StatInfoStyle, custom: Partial<StatInfoStyle>) => {
    const { resistances } = this.state;
    return (
      <div className={css(ss.resistancesContainer, custom.resistancesContainer)}>
        {Object.keys(resistances).sort((a, b) => a.localeCompare(b)).map((stat: string, i: number) => {
          const statClassName = Math.round((resistances[stat] * 100)) / 100 > 0 ?
            css(ss.statNumber, custom.statNumber) :
            css(ss.zeroStatNumber, custom.zeroStatNumber);
          if (Math.round((resistances[stat] * 100)) / 100 >= 0) {
            return <div key={i}>
              <p className={css(ss.inlineText, custom.inlineText)}>{prettifySlotName(stat)} </p>
              <p className={statClassName}>{Math.round((resistances[stat] * 100)) / 100}</p>
            </div>;
          }
        })}
      </div>
    );
  }
}

const StatInfoWithQL = graphql(queries.StatInfoQuery as any)(StatInfo);

export default StatInfoWithQL;
