/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { utils } from 'camelot-unchained';
import { GridStats } from 'camelot-unchained/lib/components';
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';

import StatListItem from '../StatListItem';
import StatListContainer from '../StatListContainer';
import { prettifyText, searchIncludesSection } from '../../../../lib/utils';
import { colors } from '../../../../lib/constants';

import { TestOffenseStatsInterface } from '../../testCharacterStats';

export interface OffenseListStyles extends StyleDeclaration {
  OffenseList: React.CSSProperties;
  sectionTitleContainer: React.CSSProperties;
  sectionTitle: React.CSSProperties;
  doesNotMatchSearch: React.CSSProperties;
}

const defaultOffenseListStyle: OffenseListStyles = {
  OffenseList: {
    flex: 1,
    height: '100%',
    backgroundColor: 'rgba(75, 67, 65, 0.2)',
  },

  sectionTitleContainer: {
    display: 'flex',
    padding: '5px',
    fontSize: 18,
    color: utils.lightenColor(colors.filterBackgroundColor, 150),
    backgroundColor: utils.lightenColor(colors.filterBackgroundColor, 15),
    borderBottom: `1px solid ${utils.lightenColor(colors.filterBackgroundColor, 20)}`,
  },

  sectionTitle: {
    marginLeft: '5px',
  },

  doesNotMatchSearch: {
    opacity: 0.2,
    backgroundColor: `rgba(0,0,0,0.2)`,
  },
};

export interface OffenseStatInfoSection {
  title: string;
  stats: any[];
}

export interface OffenseListProps {
  styles?: Partial<OffenseListStyles>;
  offensiveStats: TestOffenseStatsInterface;
}

export interface OffenseListState {
  searchValue: string;

}

class OffenseList extends React.Component<OffenseListProps, OffenseListState> {
  constructor(props: OffenseListProps) {
    super(props);
    this.state = {
      searchValue: '',
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
              {Object.keys(this.props.offensiveStats).map((weaponSlot, i) => {
                // Prettify name to match what is displayed to user
                const searchIncludes = searchIncludesSection(this.state.searchValue, prettifyText(weaponSlot));
                const statArray = Object.keys(this.props.offensiveStats[weaponSlot]).map((stat) => {
                  return {
                    name: stat,
                    value: this.props.offensiveStats[weaponSlot][stat],
                  };
                });
                return (
                  <div key={i}>
                    <header className={css(
                      ss.sectionTitleContainer,
                      custom.sectionTitleContainer,
                      !searchIncludes && ss.doesNotMatchSearch,
                      !searchIncludes && custom.doesNotMatchSearch,
                    )}>
                      <div className={'icon-filter-weapons'} />
                      <span className={css(ss.sectionTitle, custom.sectioTitle)}>{prettifyText(weaponSlot)}</span>
                    </header>
                    {<GridStats
                      statArray={statArray}
                      searchValue={this.state.searchValue}
                      howManyGrids={2}
                      shouldRenderEmptyListItems={true}
                      renderListItem={(item, index) => (
                        <StatListItem
                          index={index}
                          statName={item.name}
                          statValue={item.value}
                          searchValue={this.state.searchValue}
                          sectionTitle={weaponSlot}
                        />
                      )}
                    />}
                  </div>
                );
              })}
            </div>
          )}
        />
      </div>
    );
  }

  private onSearchChange = (searchValue: string) => {
    this.setState({ searchValue });
  }
}

export default OffenseList;
