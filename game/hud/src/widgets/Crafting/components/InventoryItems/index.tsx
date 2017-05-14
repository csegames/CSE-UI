/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-14 18:15:30
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-14 18:41:03
 */

import * as React from 'react';
import { graphql, InjectedGraphQLProps } from 'react-apollo';
import gql from 'graphql-tag';
import Select from '../Select';
import { InventoryItem } from '../../services/types';

interface InventoryItems {
  myInventoryItems: InventoryItem[];
}

export interface InventoryItemsProps extends InjectedGraphQLProps<InventoryItems> {
  select: (item: InventoryItem) => void;
}

export const InventoryItems = (props: InventoryItemsProps) => {
  debugger;
  const items = (props.data && props.data.myInventoryItems) || [];
  const render = (item: InventoryItem) => item && <div>{item.name}</div>;
  return (
    <Select items={items}
      onSelectedItemChanged={props.select} renderActiveItem={render} renderListItem={render}/>
  );
};

const query = gql`
  query InventoryItems {
    myInventoryItems {
      itemType
      name
      id
    }
  }
`;

const options = (props: InventoryItemsProps) => {
  debugger;
  const opts = {
    variables: {
    },
  };
  return opts;
};

const InventoryItemsWithQL = graphql(query, { options })(InventoryItems);
export default InventoryItemsWithQL;
