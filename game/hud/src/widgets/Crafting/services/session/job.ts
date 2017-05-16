/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-03 20:46:31
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-16 22:42:41
 */

import { client, hasClientAPI } from 'camelot-unchained';
import { Module } from 'redux-typed-modules';
import { slash, isClient } from '../game/slash';
import { Ingredient, InventoryItem, Recipe, Template, Message, VoxStatus } from '../types';

export interface JobState {
  loading: boolean;
  vox: string;
  status: string;
  ready: boolean;
  type: string;
  recipe: Recipe;
  template: Template;
  quality: number;
  ingredients: Ingredient[];
  name: string;
  message: Message;
  count: number;
}

const initialState = () : JobState => {
  console.log('CRAFTING: generate initialJobState');
  return {
    vox: null,
    status: 'unknown',
    ready: false,
    loading: false,
    type: null,
    recipe: null,
    template: null,
    quality: 0,
    ingredients: [],
    name: null,
    message: null,
    count: 1,
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
    console.log('CRAFTING SET JOB: ' + a.jobType);
    return Object.assign(s, { type: a.jobType });
  },
});

export const setCount = module.createAction({
  type: 'crafting/job/set-count',
  action: (count: number) => {
    return { count };
  },
  reducer: (s, a) => {
    return Object.assign(s, { count: a.count });
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

export const cancelJob = module.createAction({
  type: 'crafting/job/cancel',
  action: () => {
    return { };
  },
  reducer: (s, a) => {
    return s;
  },
});

export const collectJob = module.createAction({
  type: 'crafting/job/collect',
  action: () => {
    return { };
  },
  reducer: (s, a) => {
    return s;
  },
});

export const setRecipe = module.createAction({
  type: 'crafting/job/set-recipe',
  action: (recipe: Recipe) => {
    return { recipe };
  },
  reducer: (s, a) => {
    return Object.assign(s, { recipe: a.recipe });
  },
});

export const setQuality = module.createAction({
  type: 'crafting/job/set-quality',
  action: (quality: number) => {
    return { quality };
  },
  reducer: (s, a) => {
    return Object.assign(s, { quality: a.quality });
  },
});

export const setName = module.createAction({
  type: 'crafting/job/set-name',
  action: (name: string) => {
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
    return { template };
  },
  reducer: (s, a) => {
    return Object.assign(s, { template: a.template });
  },
});

export function getStatus(callback: (response: any) => void) {
  if (!isClient()) {
    callback({ status: {
      vox: '000000003f21c895',
      type: 'make',
      status: 'Configuring',
      recipe: { id: 3, name: '' },
      template: null,
      ingredients: [
        { id: 1, name: 'Mushy Peas', qty: 1 },
        { id: 3, name: 'Gravy', qty: 14 },
      ],
     }});    // no cuAPI, simulation
  } else {
    slash('cr vox status', (response: any) => {
      console.log('CRAFTING: GOT STATUS: ' + JSON.stringify(response));
      callback(response);
    });
  }
}
export const gotStatus = module.createAction({
  type: 'crafting/job/got-status',
  action: (status: VoxStatus) => {
    return { status };
  },
  reducer: (s, a) => {
    console.log('CRAFTING GOT STATUS: ' + a.status.type);
    return Object.assign(s, {
      vox: a.status.vox,
      status: a.status.status,
      ready: a.status.ready,
      type: a.status.type,
      recipe: a.status.recipe,
      template: null,
      ingredients: [...a.status.ingredients],
    });
  },
});

export default module.createReducer();
