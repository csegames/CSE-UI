/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { css, StyleDeclaration, StyleSheet } from 'aphrodite';
import styled from 'react-emotion';
import { utils } from 'camelot-unchained';

import { prettifyText, searchIncludesSection } from '../../../lib/utils';
import { colors } from '../../../lib/constants';

export interface StatListItemStyles extends StyleDeclaration {
  statsListItem: React.CSSProperties;
  lightListItem: React.CSSProperties;
  statText: React.CSSProperties;
  statValue: React.CSSProperties;
  doesNotMatchSearch: React.CSSProperties;
}

const StatText = styled('p')`
  display: inline-block;
  font-size: 16;
  margin: 0;
  padding: 0;
  text-overflow: ellipsis;
  color: ${(props: any) => props.color ? props.color : utils.lightenColor(colors.filterBackgroundColor, 150)};
`;

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

export interface StatListItemProps {
  styles?: Partial<StatListItemStyles>;
  statName: string;
  statValue: any;
  index: number;
  searchValue: string;
  sectionTitle?: string;
  colorOfName?: string;
}

class StatListItem extends React.Component<StatListItemProps, {}> {
  public render() {
    const ss = StyleSheet.create(defaultStatListItemStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    const lightItem = this.props.index % 2 === 0;
    const searchIncludes = this.searchIncludesListItem(
      this.props.sectionTitle,
      this.props.searchValue,
      this.props.statName,
    );

    return (
      <div
        className={css(
          ss.statsListItem,
          custom.statsListItem,
          lightItem && ss.lightListItem,
          lightItem && custom.lightListItem,
          !searchIncludes && ss.doesNotMatchSearch,
          !searchIncludes && custom.doesNotMatchSearch,
        )}>
        <StatText color={this.props.colorOfName}>{prettifyText(this.props.statName)}</StatText>
        {typeof this.props.statValue === 'function' ?
          this.props.statValue() :
          typeof this.props.statValue === 'number' || typeof this.props.statValue === 'string' ?
            <span className={css(
              ss.statText, custom.statText,
              ss.statValue, custom.statValue,
            )}>
              {this.props.statValue}
            </span> :
            null
        }
      </div>
    );
  }

  public shouldComponentUpdate(nextProps: StatListItemProps) {
    const nextPropsIncludeListItem = this.searchIncludesListItem(
      nextProps.sectionTitle,
      nextProps.searchValue,
      nextProps.statName,
    );
    const currentPropsIncludeListItem = this.searchIncludesListItem(
      this.props.sectionTitle,
      this.props.searchValue,
      this.props.statName,
    );

    return nextPropsIncludeListItem !== currentPropsIncludeListItem || nextProps.statValue !== this.props.statValue;
  }

  private searchIncludesListItem = (sectionTitle: string, searchValue: string, statName: string) => {
    if (searchValue !== '') {
      if (searchIncludesSection(searchValue, sectionTitle)) {
        return statName ? utils.doesSearchInclude(
          searchValue.toLowerCase().replace(/\s/g, '')
          .replace(sectionTitle.replace(/\s/g, '').toLowerCase(), ''), statName.toLowerCase()) : false;
      }
      return utils.doesSearchInclude(searchValue, statName);
    } else {
      return true;
    }
  }
}

export default StatListItem;
