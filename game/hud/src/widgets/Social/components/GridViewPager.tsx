/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-03-08
 */

import * as React from 'react';
import { GridViewImpl, GridViewProps, GridViewState, GridViewSort, ColumnDefinition, SortInfo } from 'camelot-unchained';
import { clone } from 'lodash';

export interface GridViewPagerProps extends GridViewProps {
  total: number;
  currentPage: number;
  gotoPage: (page: number) => void;
  onSort: (index: number, asc: boolean) => void;
}

export interface GridViewPagerState extends GridViewState {
}

export default class GridViewPager extends GridViewImpl<GridViewPagerProps, GridViewPagerState> {
  getItemCount = () : number => {
    return this.props.total;
  }
  getCurrentPage = () => {
    return this.props.currentPage;
  }
  goToPage = (page: number) => {
    this.props.gotoPage(page);
  }
  setSort = (index: number, sortBy: GridViewSort) => {
    this.props.onSort(index, sortBy == GridViewSort.Up);
    this.setState({ currentSort: { index: index, sorted: sortBy } });
  }
  sortItems = (input: any[], column: ColumnDefinition, sorted: GridViewSort) => {
    return input;
  }
}
