/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-30 14:52:18
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-27 11:49:08
 */

import * as React from 'react';
import { GridViewImpl, GridViewProps, GridViewState } from 'camelot-unchained';

export interface GridViewPagerProps extends GridViewProps {
  total: number;
  currentPage: number;
  gotoPage: (page: number) => void;
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
}