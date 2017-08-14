/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-08-17 11:47:30
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-08-17 15:56:12
 */

import * as React from 'react';
import * as _ from 'lodash';
import { utils } from 'camelot-unchained';
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';

import GridStats from '../GridStats';
import { StatInterface } from '../StatListItem';
import StatListContainer from '../StatListContainer';
import { prettifyText } from '../../../../lib/utils';
import { colors } from '../../../../lib/constants';

export interface OffenseListStyles extends StyleDeclaration {
  OffenseList: React.CSSProperties;
  statSectionTitle: React.CSSProperties;
}

const defaultOffenseListStyle: OffenseListStyles = {
  OffenseList: {
    flex: 1,
    height: '100%',
    backgroundColor: 'rgba(75, 67, 65, 0.2)',
  },

  statSectionTitle: {
    textAlign: 'center',
    padding:'5px',
    fontSize: 24,
    color: utils.lightenColor(colors.filterBackgroundColor, 150),
    backgroundColor: utils.lightenColor(colors.filterBackgroundColor, 20),
  },
};

export interface OffenseStatInfoSection {
  title: string;
  stats: StatInterface[];
}

export interface OffenseListProps {
  styles?: Partial<OffenseListStyles>;
  statSections: OffenseStatInfoSection[];
}

export interface OffenseListState {
  searchValue: string;
  statSections: OffenseStatInfoSection[];
}

class OffenseList extends React.Component<OffenseListProps, OffenseListState> {
  constructor(props: OffenseListProps) {
    super(props);
    this.state = {
      searchValue: '',
      statSections: [],
    };
  }

  public render() {
    const ss = StyleSheet.create(defaultOffenseListStyle);
    const custom = StyleSheet.create(this.props.styles || {});
    
    return (
      <div className={css(ss.OffenseList, custom.OffenseList)}>
        <StatListContainer
          searchValue={this.state.searchValue}
          onSearchChange={this.onSearchChange}
          renderContent={() => (
            <div>
              {this.state.statSections.map((statSection, i) => {
                return (
                  <div key={i}>
                    <header className={css(ss.statSectionTitle, custom.statSectionTitle)}>
                      {prettifyText(statSection.title)}
                    </header>
                    <GridStats
                      statArray={statSection.stats}
                      searchValue={this.state.searchValue}
                      howManyGrids={2}
                    />
                  </div>
                );
              })}
            </div>
          )}
        />
      </div>
    );
  }

  public componentWillReceiveProps(nextProps: OffenseListProps) {
    if (!_.isEqual(nextProps.statSections, this.props.statSections)) {
      this.setState({ statSections: nextProps.statSections });
    }
  }

  private onSearchChange = (searchValue: string) => {
    this.setState({ searchValue });
  }
}

export default OffenseList;
