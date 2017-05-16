/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-14 18:15:30
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-16 22:19:15
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
  selectedItem: InventoryItem;
  onSelect: (item: InventoryItem) => void;
}

export const InventoryItems = (props: InventoryItemsProps) => {
  const items = (props.data && props.data.myInventoryItems) || [];
  const render = (item: InventoryItem) => item && (
    <div className='inventory-item'>
      <span className='name'>{item.name}</span>
      <span className='quantity'>x{item.stats.unitCount}</span>
      <span className='quality'>@ {(item.stats.quality * 100) | 0}%</span>
    </div>
  );
  return (
    <Select items={items}
      onSelectedItemChanged={props.onSelect}
      renderActiveItem={render}
      renderListItem={render}
      selectedItem={props.selectedItem}
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
