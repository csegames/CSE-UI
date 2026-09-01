/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { RootState } from '../redux/store';
import { connect } from 'react-redux';

export interface GridStatsStyles {
  statContainer: React.CSSProperties;
  statListSection: React.CSSProperties;
  listItemContainer: React.CSSProperties;
}

const Root = 'GridStats-Root';
const StatListSection = 'GridStats-StatListSection';

interface ReactProps {
  styles?: Partial<GridStatsStyles>;
  sectionTitle?: string;
  renderHeaderItem?: () => JSX.Element;
  howManyGrids: number;
  searchValue: string;
  statArray: any[];
  renderListItem: (item: any, index: number) => JSX.Element;
  shouldRenderEmptyListItems?: boolean;
}

interface InjectedProps {}

type Props = ReactProps & InjectedProps;

class AGridStats extends React.Component<Props> {
  render(): React.ReactNode {
    const customStyles = this.props.styles || {};
    const statArray = this.props.statArray;
    const numberOfItemsInGrid = Math.ceil(statArray.length / this.props.howManyGrids);
    const emptyListItems: any[] = this.props.shouldRenderEmptyListItems
      ? Array(numberOfItemsInGrid * this.props.howManyGrids - statArray.length).fill('')
      : [];

    let beginningArrayIndex = 0;
    const arrayOfGrids = Array(this.props.howManyGrids)
      .fill('')
      .map((ignore, index) => {
        const isLastGrid = index + 1 === this.props.howManyGrids;
        let grids = [];
        if (isLastGrid) {
          grids = statArray.slice(beginningArrayIndex, numberOfItemsInGrid * (index + 1)).concat(emptyListItems);
        } else {
          grids = statArray.slice(beginningArrayIndex, numberOfItemsInGrid * (index + 1));
        }
        beginningArrayIndex = numberOfItemsInGrid * (index + 1);
        return grids;
      });

    return (
      <div className={Root} style={customStyles.statContainer}>
        {arrayOfGrids.map((grid, index) => {
          return (
            <div className={StatListSection} key={index} style={customStyles.statListSection}>
              {this.props.renderHeaderItem && this.props.renderHeaderItem()}
              {grid.map((item, i) => {
                return (
                  <div key={i} style={customStyles.listItemContainer}>
                    {this.props.renderListItem(item, i)}
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    );
  }
}

const mapStateToProps = (state: RootState, ownProps: ReactProps): Props => {
  return {
    ...ownProps
  };
};

export const GridStats = connect(mapStateToProps)(AGridStats);
