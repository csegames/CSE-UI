/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-08-17 12:38:55
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-08-17 15:55:32
 */

import * as React from 'react';
import * as _ from 'lodash';
import { css, StyleSheet, StyleDeclaration } from 'aphrodite';
import StatListItem, { StatInterface } from './StatListItem';
import { prettifyText } from '../../../lib/utils';

export interface GridStatsStyles extends StyleDeclaration {
  statContainer: React.CSSProperties;
  statListSection: React.CSSProperties;
}

const defaultGridStatsStyle: GridStatsStyles = {
  statContainer: {
    display: 'flex',
  },

  statListSection: {
    flex: 1,
  },
};

export interface GridStatsProps {
  styles?: Partial<GridStatsStyles>;
  statArray: StatInterface[];
  howManyGrids: number;
  searchValue: string;
  sectionTitle?: string;
}

const GridStats = (props: GridStatsProps) => {
  const ss = StyleSheet.create(defaultGridStatsStyle);
  const custom = StyleSheet.create(props.styles || {});

  const statArray = props.statArray.sort((a, b) => a.name.toLowerCase().localeCompare(b.name.toLowerCase()));
  const numberOfItemsInGrid = Math.ceil((props.statArray.length) / props.howManyGrids);
  const emptyListItems: StatInterface[] =
    _.fill(Array(numberOfItemsInGrid * props.howManyGrids - props.statArray.length), { name: '', value: null });
  
  let beginningArrayIndex = 0;
  const arrayOfGrids = _.fill(Array(props.howManyGrids), '').map((ignore, index) => {
    let grids = [];
    if ((index + 1) === props.howManyGrids) {
      grids = statArray.slice(beginningArrayIndex, numberOfItemsInGrid * (index + 1)).concat(emptyListItems);
    } else {
      grids =  statArray.slice(beginningArrayIndex, numberOfItemsInGrid * (index + 1));
    }
    beginningArrayIndex = numberOfItemsInGrid * (index + 1);
    return grids;
  });

  return (
    <div className={css(ss.statContainer, custom.statContainer)}>
      {arrayOfGrids.map((grid, index) => {
        return (
          <div key={index} className={css(ss.statListSection, custom.statListSection)}>
            {grid.map((item, i) => {
              return (
                <StatListItem
                  key={i}
                  stat={item}
                  index={i}
                  searchValue={props.searchValue}
                  sectionTitle={props.sectionTitle && prettifyText(props.sectionTitle)}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export default GridStats;
