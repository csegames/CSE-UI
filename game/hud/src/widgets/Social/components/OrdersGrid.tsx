/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-03-08
 */

import * as React from 'react';
import { graphql, InjectedGraphQLProps } from 'react-apollo';
import { connect } from 'react-redux';
import gql from 'graphql-tag';
import { StyleSheet, css, StyleDeclaration } from 'aphrodite';
import { Spinner, ColumnDefinition } from 'camelot-unchained';
import GridViewPager from './GridViewPager';
import GroupTitle from './GroupTitle';

export interface OrdersGridStyle extends StyleDeclaration {
  container : React.CSSProperties;
}

export const defaultOrdersGridStyle : OrdersGridStyle = {
  container: {
    flex: '1 1 auto',
    display: 'flex',
    flexDirection: 'column'
  },
};

export interface OrdersGridQuery {
  orders: {
    totalCount: number;
    data: {
      id: string;
      name: string;
      realm: string;
      created: string;
      creator: string;
    }[]
  }
}

export interface OrdersGridProps extends InjectedGraphQLProps<OrdersGridQuery> {
  styles?: Partial<OrdersGridStyle>;
  columnDefinitions?: ColumnDefinition[];
  shard: number;
  skip: number;
  itemsPerPage: number;
  filter: string;
  gotoPage: (page: number) => void;
  sort: string;
  reverse: boolean;
  orderBy: (by: string, asc: boolean) => void;
};

interface OrdersListColumn extends ColumnDefinition {
  sortField?: string;
}

export const defaultOrdersGridColumnDefinitions: OrdersListColumn[] = [
  {
    key: (m: {name: string}) => m.name,
    title: 'Name',
    sortable: true,
    sortField: "name",
    style: { width: '40%' },
  },
  {
    key: (m: {realm: string}) => m.realm,
    title: 'Realm',
    sortable: true,
    sortField: "realm",
    style: { width: '15%' },
  },
  {
    key: (m: {creator: string}) => m.creator,
    title: 'Creator',
    sortable: false, sortField: "creator",    // not supported
    style: { width: '35%' },
  },
  {
    key: (m: {created: string}) => new Date(m.created).toLocaleDateString(),
    title: 'Created',
    sortable: false, sortField: "created",    // not supported
    style: { width: '10%' },
  },
];

const OrdersGrid = (props : OrdersGridProps) => {

  const ss = StyleSheet.create(defaultOrdersGridStyle);
  const custom = StyleSheet.create(props.styles || {});
  const columnDefs: OrdersListColumn[] = props.columnDefinitions || defaultOrdersGridColumnDefinitions;

  return (
    <div className={css(ss.container)}>
      { props.data.orders ?
        <GridViewPager
          /* Pager Props */
          gotoPage={props.gotoPage}
          total={props.data.orders.totalCount}
          currentPage={props.skip/props.itemsPerPage}
          onSort={(index: number, asc: boolean) => {
            props.orderBy(columnDefs[index].sortField, asc);
          }}
          /* GridView Props */
          itemsPerPage={props.itemsPerPage}
          items={props.data.orders.data}
          columnDefinitions={columnDefs}
          renderData={{ refetch: props.data.refetch }}
          />
      : <Spinner/>
      }
    </div>
  )
};

const query = gql`
  query OrdersGrid($shard: Int!, $count: Int!, $skip: Int!, $filter: String!,
                   $sort: String!, $reverse: Boolean!) {
    orders(shard: $shard, count: $count, skip: $skip, filter: $filter,
           sort: $sort, reverseSort: $reverse,
           includeDisbanded: false)  {
      totalCount,
      data {
        id
        name
        realm
        created
        creator
      }
    }
  }
`;

const options = (props: OrdersGridProps) => {
  const opts = {
    variables: {
      filter: props.filter||"",
      shard: props.shard|0,
      skip: props.skip|0,
      count: props.itemsPerPage|0,
      sort: props.sort||"",
      reverse: props.reverse||false,
    }
  }
  return opts;
};

const OrdersGridWithQL = graphql(query, { options: options })(OrdersGrid);
export default OrdersGridWithQL;
