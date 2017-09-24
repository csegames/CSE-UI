/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-03-08
 */
import {GridViewImpl, GridViewProps, GridViewState, GridViewSort, ColumnDefinition} from 'camelot-unchained';

export interface GridViewPagerProps extends GridViewProps {
  total: number;
  currentPage: number;
  gotoPage: (page: number) => void;
  onSort: (index: number, asc: boolean) => void;
}

export interface GridViewPagerState extends GridViewState {
}

export default class GridViewPager extends GridViewImpl<GridViewPagerProps, GridViewPagerState> {
  public getItemCount = (): number => {
    return this.props.total;
  }
  public getCurrentPage = () => {
    return this.props.currentPage;
  }
  public goToPage = (page: number) => {
    this.props.gotoPage(page);
  }
  public setSort = (index: number, sortBy: GridViewSort) => {
    this.props.onSort(index, sortBy === GridViewSort.Up);
    this.setState({currentSort: {index, sorted: sortBy}});
  }
  public sortItems = (input: any[], column: ColumnDefinition, sorted: GridViewSort) => {
    return input;
  }
}
