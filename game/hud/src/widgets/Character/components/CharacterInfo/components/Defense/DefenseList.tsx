/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-08-14 16:48:10
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-08-17 15:00:03
 */

import * as React from 'react';
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';
import { utils } from 'camelot-unchained';

import BodyPartSection from './BodyPartSection';
import StatListContainer from '../StatListContainer';
import { colors } from '../../../../lib/constants';

// Will need to change this with a fragment interface once we hook up graphql
import { TestBodyPartStats } from '../../testCharacterStats';

export interface DefenseListStyle extends StyleDeclaration {
  DefenseList: React.CSSProperties;
  statSectionTitle: React.CSSProperties;
}

const defaultDefenseListStyle: DefenseListStyle = {
  DefenseList: {
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

// This is the highest order data structure. We use an array of StatInfoSection's
// to break up the ArmorStats (resistances, mitigations) into sections.

export interface DefenseListProps {
  styles?: Partial<DefenseListStyle>;
  defensiveStats: TestBodyPartStats;
}

export interface DefenseListState {
  searchValue: string;
}

class DefenseList extends React.Component<DefenseListProps, DefenseListState> {
  private ss: DefenseListStyle;
  private custom: Partial<DefenseListStyle>;

  constructor(props: DefenseListProps) {
    super(props);
    this.state = {
      searchValue: '',
    };
  }

  public render() {
    const ss = this.ss =  StyleSheet.create(defaultDefenseListStyle);
    const custom = this.custom = StyleSheet.create(this.props.styles || {});

    return (
      <div className={css(ss.DefenseList, custom.DefenseList)}>
        <StatListContainer
          searchValue={this.state.searchValue}
          onSearchChange={this.onSearchChange}
          renderContent={() => (
          <div>
            {Object.keys(this.props.defensiveStats).map((bodyPart, i) => {
              return (
                <BodyPartSection
                  key={i}
                  name={bodyPart}
                  searchValue={this.state.searchValue}
                  bodyPartStats={this.props.defensiveStats[bodyPart]}
                />
              );     
            })}
          </div>
        )} />
      </div>
    );
  }

  private onSearchChange = (searchValue: string) => {
    this.setState({ searchValue });
  }
}

export default DefenseList;
