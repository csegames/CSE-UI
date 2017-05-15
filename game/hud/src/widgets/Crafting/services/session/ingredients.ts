/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-15 05:24:05
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-15 06:46:48
 */

import { Module } from 'redux-typed-modules';
import { InventoryItem } from '../types';
import { slash, isClient } from '../game/slash';

export interface IngredientsState {
  ingredients: InventoryItem[];
}

const initialState = () : IngredientsState => {
  console.log('CRAFTING: generate initialItemState');
  return {
    ingredients: [],
  };
};

const module = new Module({
  initialState: initialState(),
  actionExtraData: () => {
    return {
      when: new Date(),
    };
  },
});

export const gotIngredients = module.createAction({
  type: 'crafting/items/got-ingredients',
  action: (ingredients: InventoryItem[]) => {
    return { ingredients };
  },
  reducer: (s, a) => {
    return Object.assign(s, { ingredients: [...a.ingredients] });
  },
});

// Ingredients

export const itemTypes = [
  'ingredients',
];

// TESTING: Dummy Ingredients

const dummyData = {
  ingredients: [
    { id: '1', name: 'Mushy Peas' },
    { id: '2', name: 'Soggy Chips' },
    { id: '3', name: 'Gravy' },
    { id: '4', name: 'Greacy Fish' },
  ],
};

export function getIngredients(callback: (type: string, list: InventoryItem[]) => void) {
  const what = 'ingredients';
  if (!isClient()) {
    callback(what, dummyData[what] as InventoryItem[]);    // no cuAPI, simulation
  } else {
    slash('cr vox listpossibleingredients' , (response: any) => {
      switch (response.type) {
        case what:
          callback(what, response.list);
          break;
      }
    });
  }
}

export default module.createReducer();
