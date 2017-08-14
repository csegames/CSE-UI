/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-08-16 10:45:10
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-08-17 16:05:45
 */

import * as React from 'react';
import { css, StyleDeclaration, StyleSheet } from 'aphrodite';
import { utils } from 'camelot-unchained';

import { prettifyText, doesSearchInclude } from '../../../lib/utils';
import { colors } from '../../../lib/constants';

export interface StatListItemStyles extends StyleDeclaration {
  statsListItem: React.CSSProperties;
  lightListItem: React.CSSProperties;
  statText: React.CSSProperties;
  statValue: React.CSSProperties;
  doesNotMatchSearch: React.CSSProperties;
}

const defaultStatListItemStyle: StatListItemStyles = {
  statsListItem: {
    display: 'flex',
    justifyContent: 'space-between',
    position: 'relative',
    cursor: 'default',
    padding: '0 5px',
    height: '25px',
    backgroundColor: `rgba(55, 47, 45, 0.5)`,
    boxShadow: 'inset 0px 0px 3px rgba(0,0,0,0.5)',
    opacity: 0.8,
    borderRight: `1px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)}`,
    borderBottom: `1px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)}`,
    ':hover': {
      backgroundColor: utils.lightenColor(colors.filterBackgroundColor, 20),
    },
  },

  lightListItem: {
    backgroundColor: colors.filterBackgroundColor,
  },

  statText: {
    display: 'inline-block',
    fontSize: 16,
    margin: 0,
    padding: 0,
    color: utils.lightenColor(colors.filterBackgroundColor, 150),
    textOverflow: 'ellipsis',
  },

  statValue: {
    
  },

  doesNotMatchSearch: {
    opacity: 0.2,
    backgroundColor: `rgba(0,0,0,0.2)`,
  },
};

// The StatInterface is the interface for the actual DamageType and gives us the name and the value of the DamageType.
// ex.) { name: 'poison', value: 0.3 }
export interface StatInterface {
  name: string;
  value: number | string;
}

export interface StatListItemProps {
  styles?: Partial<StatListItemStyles>;
  stat: StatInterface;
  index: number;
  searchValue: string;
  sectionTitle?: string;
}

class StatListItem extends React.Component<StatListItemProps, {}> {
  public render() {
    const ss = StyleSheet.create(defaultStatListItemStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    const stat = this.props.stat;
    const lightItem = this.props.index % 2 === 0;
    const searchIncludes = this.searchIncludesListItem(
      this.props.sectionTitle,
      this.props.searchValue,
      this.props.stat.name,
    );

    return (
      <div
        key={stat.name}
        className={css(
          ss.statsListItem,
          custom.statsListItem,
          lightItem && ss.lightListItem,
          lightItem && custom.lightListItem,
          !searchIncludes && ss.doesNotMatchSearch,
          !searchIncludes && custom.doesNotMatchSearch,
        )}>
        <p className={css(ss.statText, custom.statText)}>{prettifyText(stat.name)}</p>
        <p className={css(ss.statText, custom.statText, ss.statValue, custom.statValue)}>
          {stat.value}
        </p>
      </div>
    );
  }

  public shouldComponentUpdate(nextProps: StatListItemProps) {
    const nextPropsIncludeListItem = this.searchIncludesListItem(
      nextProps.sectionTitle,
      nextProps.searchValue,
      nextProps.stat.name,
    );
    const currentPropsIncludeListItem = this.searchIncludesListItem(
      this.props.sectionTitle,
      this.props.searchValue,
      this.props.stat.name,
    );
    return nextPropsIncludeListItem !== currentPropsIncludeListItem;
  }

  private searchIncludesListItem = (sectionTitle: string, searchValue: string, statName: string) => {
    const searchIncludesSection = sectionTitle ?
    doesSearchInclude(sectionTitle, searchValue) ||
    doesSearchInclude(searchValue, sectionTitle) : true;
    const searchIncludes = searchValue !== '' ? sectionTitle ?
      (searchIncludesSection &&
        doesSearchInclude(`${sectionTitle} ${statName}`, searchValue) ||
        doesSearchInclude(`${statName} ${sectionTitle}`, searchValue)) :
        doesSearchInclude(prettifyText(statName), searchValue) : true;
    return searchIncludes;
  }
}

export default StatListItem;
