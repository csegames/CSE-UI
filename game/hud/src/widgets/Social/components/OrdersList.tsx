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
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import GroupTitle from './GroupTitle';
import OrdersGrid from './OrdersGrid';
import { client, Input } from 'camelot-unchained';

export interface OrdersListStyle extends StyleDeclaration {
  container : React.CSSProperties;
  filterBox : React.CSSProperties;
};
export const defaultOrdersListStyle : OrdersListStyle = {
  container: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column'
  },
  filterBox: {
    padding: '0.5em'
  }
};

export interface OrdersListProps {
  refetch: () => void;
};

interface OrdersListState {
  page: number;
  itemsPerPage: number;
  filter: string;
}

class OrdersList extends React.Component<OrdersListProps, OrdersListState> {
  searchRef: HTMLInputElement = null;
  constructor(props: OrdersListProps) {
    super(props);
    this.state = {
      page: 0,
      itemsPerPage: 25,       // TODO: Should be calculated to fit space
      filter: ''
    };
  }
  onFilterChanged = (e: any) => {
    this.setState({ filter: this.searchRef.value.toLowerCase() });
  }

  render() {
    const ss = StyleSheet.create(defaultOrdersListStyle);
    const skip = this.state.itemsPerPage * this.state.page;
    return (
      <div className={css(ss.container)}>
        <GroupTitle refetch={this.props.refetch}>
          Orders
        </GroupTitle>
        <div className={css(ss.filterBox)}>
          <Input
            type='text'
            placeholder='Seach for an order ...'
            inputRef={r => this.searchRef = r}
            onChange={this.onFilterChanged}
            />
        </div>
        <OrdersGrid
          shard={client.shardID}
          skip={skip}
          filter={this.state.filter}
          itemsPerPage={this.state.itemsPerPage}
          gotoPage={(page: number) => {
            this.setState({ page: page });
          }} />
      </div>
    );
  }
};

export default OrdersList;