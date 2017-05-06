/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-03 20:46:31
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-06 18:08:10
 */

import { Module } from 'redux-typed-modules';
import { InventoryItem } from '../types';

export interface Ingredient extends InventoryItem {
}

export interface JobState {
  type: string;
  recipe: string;
  template: string;
  quality: number;
  ingredients: Ingredient[];
  name: string;
}

const initialState = () : JobState => {
  console.log('CRAFTING: generate initialJobState');
  return {
    type: null,
    recipe: null,
    template: null,
    quality: 0,
    ingredients: [],
    name: null,
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

export const selectJobType = module.createAction({
  type: 'crafting/job/setType',
  action: (jobType: string) => {
    return { jobType };
  },
  reducer: (s, a) => {
    return Object.assign(s, { type: a.jobType });
  },
});

export const addIngredient = module.createAction({
  type: 'crafting/job/addIngredient',
  action: (item: InventoryItem) => {
    return { item };
  },
  reducer: (s, a) => {
    const ingredients = [ ...s.ingredients, a.item ];
    return Object.assign(s, { ingredients });
  },
});

export default module.createReducer();
