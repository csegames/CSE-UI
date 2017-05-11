/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-03 20:46:31
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-12 00:07:16
 */

import { client, hasClientAPI } from 'camelot-unchained';
import { Module } from 'redux-typed-modules';
import { slash } from './recipes';
import { Ingredient, InventoryItem } from '../types';

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
    slash('cr vox setjob ' + jobType);
    return { jobType };
  },
  reducer: (s, a) => {
    return Object.assign(s, { type: a.jobType });
  },
});

export const addIngredient = module.createAction({
  type: 'crafting/job/addIngredient',
  action: (item: InventoryItem, qty: number) => {
    return { item, qty };
  },
  reducer: (s, a) => {
    const ingredient: Ingredient = { ...a.item, qty: a.qty};
    const ingredients = [ ...s.ingredients, ingredient ];
    return Object.assign(s, { ingredients });
  },
});

export const startJob = module.createAction({
  type: 'crafting/job/start',
  action: () => {
    slash('cr vox startjob');
    return { };
  },
  reducer: (s, a) => {
    return s;
  },
});

export const clearJob = module.createAction({
  type: 'crafting/job/clear',
  action: () => {
    slash('cr vox clearjob');
    return { };
  },
  reducer: (s, a) => {
    return s;
  },
});

export const collectJob = module.createAction({
  type: 'crafting/job/collect',
  action: () => {
    slash('cr vox collect');
    return { };
  },
  reducer: (s, a) => {
    return s;
  },
});

export const setRecipe = module.createAction({
  type: 'crafting/job/set-recipe',
  action: (id: string) => {
    slash('cr vox setrecipe ' + id);
    return { id };
  },
  reducer: (s, a) => {
    return Object.assign(s, { recipe: a.id });
  },
});

export const setQuality = module.createAction({
  type: 'crafting/job/set-quality',
  action: (quality: number) => {
    slash('cr vox setquality ' + quality);
    return { quality };
  },
  reducer: (s, a) => {
    return Object.assign(s, { quality: a.quality });
  },
});

export const setName = module.createAction({
  type: 'crafting/job/set-name',
  action: (name: string) => {
    slash('cr vox setname ' + name);
    return { name };
  },
  reducer: (s, a) => {
    return Object.assign(s, { name: a.name });
  },
});

export const setTemplate = module.createAction({
  type: 'crafting/job/set-template',
  action: (id: string) => {
    slash('cr vox settemplate ' + id);
    return { id };
  },
  reducer: (s, a) => {
    return Object.assign(s, { template: a.id });
  },
});

export default module.createReducer();
