/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-20 16:53:52
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-20 17:07:07
 */

import * as React from 'react';
import { graphql, InjectedGraphQLProps } from 'react-apollo';
import gql from 'graphql-tag';
import Select from '../Select';
import FilteredItems from './components/FilteredItems';
import { Ingredient, InventoryItem } from '../../services/types';

interface InventoryItems {
  myInventoryItems: InventoryItem[];
}

export interface InventoryItemsProps extends InjectedGraphQLProps<InventoryItems> {
  selectedItem: InventoryItem;
  onSelect: (item: InventoryItem) => void;
}

export const InventoryItems = (props: InventoryItemsProps) => {
  const items = (props.data && props.data.myInventoryItems) || [];
  return (
    <FilteredItems
      selectedItem={props.selectedItem}
      items={items}
      onSelect={props.onSelect}
      />
  );
};

const query = gql`
  query InventoryItems {
    myInventoryItems {
      itemType
      name
      id
      stats {
        quality,
        unitCount
      }
    }
  }
`;

const options = (props: InventoryItemsProps) => {
  const opts = {
    variables: {
    },
  };
  return opts;
};

const InventoryItemsWithQL = graphql(query, { options })(InventoryItems);
export default InventoryItemsWithQL;

