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
  sectionTitle?: string;
  howManyGrids: number;
  searchValue: string;
  statArray: any[];
  renderListItem: (item: any, index: number) => JSX.Element;
  shouldRenderEmptyListItems?: boolean;
}

const GridStats = (props: GridStatsProps) => {
  const ss = StyleSheet.create(defaultGridStatsStyle);
  const custom = StyleSheet.create(props.styles || {});

  const statArray = props.statArray;
  const numberOfItemsInGrid = Math.ceil((statArray.length) / props.howManyGrids);
  const emptyListItems: any[] = props.shouldRenderEmptyListItems ?
    _.fill(Array(numberOfItemsInGrid * props.howManyGrids - statArray.length), '') : [];

  let beginningArrayIndex = 0;
  const arrayOfGrids = _.fill(Array(props.howManyGrids), '').map((ignore, index) => {
    const isLastGrid = (index + 1) === props.howManyGrids;
    let grids = [];
    if (isLastGrid) {
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
              return <div key={i}>{props.renderListItem(item, i)}</div>;
            })}
          </div>
        );
      })}
    </div>
  );
};

export default GridStats;
