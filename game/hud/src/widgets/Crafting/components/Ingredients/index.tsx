/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-06 16:09:59
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-07 23:30:02
 */

import * as React from 'react';
import { graphql, InjectedGraphQLProps } from 'react-apollo';
import gql from 'graphql-tag';

import { Ingredient } from '../../services/types';

import Label from '../Label';

import { InventoryItem } from '../../services/types';

interface InventoryItems {
  myInventoryItems: InventoryItem[];
}

export interface IngredientsProps extends InjectedGraphQLProps<InventoryItems> {
  job: string;
  ingredients: Ingredient[];
  add: (item: InventoryItem, qty: number) => void;
}

export const Ingredients = (props: IngredientsProps) => {
  if (!props.job) return null;
  let selected: InventoryItem;
  const ingredients = {};
  const select = (el: HTMLSelectElement) => {
    const find = el.selectedOptions[0].value;
    const { id, itemType, name } = props.data.myInventoryItems.find((item: InventoryItem) => {
      return item.id === find;
    });
    selected = { id, itemType, name };
  };
  // ingredient qty
  let qty: number = 1;
  const count = (el: HTMLInputElement) => {
    qty = ((el.value as any) | 0) || 1;
  };
  // show already loaded ingredients
  const loaded = props.ingredients.map((i: Ingredient) => {
    ingredients[i.id] = i;
    return (
      <div key={i.id}>{i.qty} x {i.itemType}: {i.name}</div>
    );
  });

  let add;
  if (props.data && props.data.myInventoryItems && props.data.myInventoryItems.length) {
    const options = props.data.myInventoryItems.map((item: InventoryItem) => {
      return ingredients[item.id] ? undefined : (
        <option key={item.id} value={item.id}>{item.itemType}: {item.name}</option>
      );
    });
    const { id, itemType, name } = props.data.myInventoryItems[0];
    selected = { id, itemType, name };
    add = (
      <div className='add-ingredient'>
        <select onChange={(e: React.ChangeEvent<HTMLSelectElement>) => select(e.target)}>
          {options}
        </select>
        x<input onChange={(e: React.ChangeEvent<HTMLInputElement>) => count(e.target)} size={2} />
        <button className='add' onClick={_ => props.add(selected, qty)}>Add Ingredient</button>
      </div>
    );
  }
  return (
    <div className='job-ingredients'>
      <h1 className='ingredients-title'>Ingredients...</h1>
      <div className='loaded-ingredients'>
        {loaded}
      </div>
      {add}
    </div>
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

const options = (props: IngredientsProps) => {
  const opts = {
    variables: {
    },
  };
  return opts;
};

const IngredientsWithQL = graphql(query, { options })(Ingredients);
export default IngredientsWithQL;
