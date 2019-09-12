/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';

export interface GridStatsStyles {
  statContainer: React.CSSProperties;
  statListSection: React.CSSProperties;
  listItemContainer: React.CSSProperties;
}

const StatContainer = styled('div')`
  display: flex;
`;

const StatListSection = styled('div')`
  flex: 1;
`;

export interface GridStatsProps {
  styles?: Partial<GridStatsStyles>;
  sectionTitle?: string;
  renderHeaderItem?: () => JSX.Element;
  howManyGrids: number;
  searchValue: string;
  statArray: any[];
  renderListItem: (item: any, index: number) => JSX.Element;
  shouldRenderEmptyListItems?: boolean;
}

export const GridStats = (props: GridStatsProps) => {
  const customStyles = props.styles || {};
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
    <StatContainer style={customStyles.statContainer}>
      {arrayOfGrids.map((grid, index) => {
        return (
          <StatListSection key={index} style={customStyles.statListSection}>
            {props.renderHeaderItem && props.renderHeaderItem()}
            {grid.map((item, i) => {
              return (
                <div key={i} style={customStyles.listItemContainer}>
                  {props.renderListItem(item, i)}
                </div>
              );
            })}
          </StatListSection>
        );
      })}
    </StatContainer>
  );
};
