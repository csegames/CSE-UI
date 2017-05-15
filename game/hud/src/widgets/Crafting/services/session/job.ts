/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-03 20:46:31
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-15 13:29:38
 */

import { client, hasClientAPI } from 'camelot-unchained';
import { Module } from 'redux-typed-modules';
import { slash } from '../game/slash';
import { Ingredient, InventoryItem, Recipe, Template, Message } from '../types';

export interface JobState {
  loading: boolean;
  type: string;
  recipe: Recipe;
  template: Template;
  quality: number;
  ingredients: Ingredient[];
  name: string;
  message: Message;
}

const initialState = () : JobState => {
  console.log('CRAFTING: generate initialJobState');
  return {
    loading: false,
    type: null,
    recipe: null,
    template: null,
    quality: 0,
    ingredients: [],
    name: null,
    message: null,
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

export const setJobType = module.createAction({
  type: 'crafting/job/set-job',
  action: (jobType: string) => {
    return { jobType };
  },
  reducer: (s, a) => {
    return Object.assign(s, { type: a.jobType });
  },
});

export const setLoading = module.createAction({
  type: 'crafting/job/set-loading',
  action: (loading: boolean) => {
    return { loading };
  },
  reducer: (s, a) => {
    return Object.assign(s, { loading: a.loading });
  },
});

export const addIngredient = module.createAction({
  type: 'crafting/job/add-ingredient',
  action: (item: InventoryItem, qty: number) => {
    return { item, qty };
  },
  reducer: (s, a) => {
    const ingredient: Ingredient = { ...a.item, qty: a.qty};
    const ingredients = [ ...s.ingredients, ingredient ];
    return Object.assign(s, { ingredients });
  },
});

export const removeIngredient = module.createAction({
  type: 'crafting/job/remove-ingredient',
  action: (item: InventoryItem) => {
    return { item };
  },
  reducer: (s, a) => {
    return Object.assign(s, { ingredients: s.ingredients.filter((item: InventoryItem) => item.id !== a.item.id) });
  },
});

export const startJob = module.createAction({
  type: 'crafting/job/start',
  action: () => {
    return { };
  },
  reducer: (s, a) => {
    return s;
  },
});

export const clearJob = module.createAction({
  type: 'crafting/job/clear',
  action: () => {
    return { };
  },
  reducer: (s, a) => {
    return Object.assign(s, { type: null });
  },
});

export const collectJob = module.createAction({
  type: 'crafting/job/collect',
  action: () => {
    // slash('cr vox collect');
    return { };
  },
  reducer: (s, a) => {
    return s;
  },
});

export const setRecipe = module.createAction({
  type: 'crafting/job/set-recipe',
  action: (recipe: Recipe) => {
    // slash('cr vox setrecipe ' + recipe.id);
    return { recipe };
  },
  reducer: (s, a) => {
    return Object.assign(s, { recipe: a.recipe });
  },
});

export const setQuality = module.createAction({
  type: 'crafting/job/set-quality',
  action: (quality: number) => {
    // slash('cr vox setquality ' + quality);
    return { quality };
  },
  reducer: (s, a) => {
    return Object.assign(s, { quality: a.quality });
  },
});

export const setName = module.createAction({
  type: 'crafting/job/set-name',
  action: (name: string) => {
    // slash('cr vox setname ' + name);
    return { name };
  },
  reducer: (s, a) => {
    return Object.assign(s, { name: a.name });
  },
});

export const setMessage = module.createAction({
  type: 'crafting/job/set-message',
  action: (message: Message) => {
    return { message };
  },
  reducer: (s, a) => {
    return Object.assign(s, { message: a.message });
  },
});

export const setTemplate = module.createAction({
  type: 'crafting/job/set-template',
  action: (template: Template) => {
    slash('cr vox settemplate ' + template.id);
    return { template };
  },
  reducer: (s, a) => {
    return Object.assign(s, { template: a.template });
  },
});

export default module.createReducer();
