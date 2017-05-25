/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-03 20:46:31
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-24 22:54:31
 */

import { client, hasClientAPI } from 'camelot-unchained';
import { Module } from 'redux-typed-modules';
import { slash, isClient } from '../game/slash';
import { Ingredient, InventoryItem, Recipe, Template, Message, VoxStatus } from '../types';

export interface JobState {
  loading: boolean;                   // Are we starting up?
  vox: string;                        // Vox ID (if known)
  status: string;                     // Vox status (if known)
  ready: boolean;                     // Crafting complete? (Item Ready)  -- TODO Do we need this?
  type: string;                       // What type of crafting are we doing?
  started: string;                    // When last job started
  endin: string;                      // How long until it ends
  recipe: Recipe;                     // Selected Recipe
  template: Template;                 // Selected Template (make job)
  quality: number;                    // Desired quality
  possibleIngredients: InventoryItem[];  // ingredients that can go in the vox
  ingredients: Ingredient[];          // ingredients in the vox
  name: string;                       // Item Name (make)
  message: Message;                   // Last message from vox
  count: number;                      // Number of items to make
}

export const initialState = () : JobState => {
  return {
    vox: null,
    status: 'unknown',
    ready: false,
    loading: false,
    type: null,
    started: null,
    endin: null,
    recipe: null,
    template: null,
    quality: undefined,
    possibleIngredients: [],
    ingredients: [],
    name: null,
    message: null,
    count: undefined,
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
    return { type: a.jobType };
  },
});

export const setCount = module.createAction({
  type: 'crafting/job/set-count',
  action: (count: number) => {
    return { count };
  },
  reducer: (s, a) => {
    return { count: a.count };
  },
});

export const setLoading = module.createAction({
  type: 'crafting/job/set-loading',
  action: (loading: boolean) => {
    return { loading };
  },
  reducer: (s, a) => {
    return { loading: a.loading };
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
    return { ingredients };
  },
});

export const removeIngredient = module.createAction({
  type: 'crafting/job/remove-ingredient',
  action: (item: InventoryItem) => {
    return { item };
  },
  reducer: (s, a) => {
    return { ingredients: s.ingredients.filter((item: InventoryItem) => item.id !== a.item.id) };
  },
});

export const startJob = module.createAction({
  type: 'crafting/job/start',
  action: () => {
    return { };
  },
  reducer: (s, a) => {
    return {};
  },
});

export const clearJob = module.createAction({
  type: 'crafting/job/clear',
  action: () => {
    return {};
  },
  reducer: (s, a) => {
    // Clearing a job effectively resets the vox back to idle
    const vox = s.vox;
    return Object.assign({}, initialState(), { vox, status: 'idle' });
  },
});

export const cancelJob = module.createAction({
  type: 'crafting/job/cancel',
  action: () => {
    return { };
  },
  reducer: (s, a) => {
    return {};
  },
});

export const collectJob = module.createAction({
  type: 'crafting/job/collect',
  action: () => {
    return { };
  },
  reducer: (s, a) => {
    // collecting a job, if successful, also clears it
    const vox = s.vox;
    return Object.assign({}, initialState(), { vox, status: 'idle' });
  },
});

export const setRecipe = module.createAction({
  type: 'crafting/job/set-recipe',
  action: (recipe: Recipe) => {
    return { recipe };
  },
  reducer: (s, a) => {
    return { recipe: a.recipe };
  },
});

export const setQuality = module.createAction({
  type: 'crafting/job/set-quality',
  action: (quality: number) => {
    return { quality };
  },
  reducer: (s, a) => {
    return { quality: a.quality };
  },
});

export const setName = module.createAction({
  type: 'crafting/job/set-name',
  action: (name: string) => {
    return { name };
  },
  reducer: (s, a) => {
    return { name: a.name };
  },
});

export const setMessage = module.createAction({
  type: 'crafting/job/set-message',
  action: (message: Message) => {
    return { message };
  },
  reducer: (s, a) => {
    return { message: a.message };
  },
});

export const setTemplate = module.createAction({
  type: 'crafting/job/set-template',
  action: (template: Template) => {
    return { template };
  },
  reducer: (s, a) => {
    return { template: a.template };
  },
});

export const setPossibleIngredients = module.createAction({
  type: 'crafting/job/set-possible-ingredients',
  action: (possible: Ingredient[]) => {
    return { possible };
  },
  reducer: (s, a) => {
    return { possibleIngredients: a.possible };
  },
});

export function getStatus(callback: (response: any) => void) {
  if (!isClient()) {
    callback({
      status: {
        vox: '000000003fb7c1f4',
        type: 'make',
        status: 'configuring',
        recipe: null,
        template: { id: 'item_Arthurian_ArmorMediumForearm01', name: '' },
        ingredients: [
          { id: '1', name: 'Sub Iron x20 - 20kg @ 50%', qty: 1 },
          { id: '2', name: 'Basic Arrow', qty: 1 },
        ],
        name: 'La La Land',
      },
      complete: 'Running cr on aaac with params [ vox status] ... done.',
    });
  } else {
    slash('cr vox status', (response: any) => {
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
    return {
      vox: a.status.vox,
      status: a.status.status,
      ready: a.status.ready,
      type: a.status.type,
      started: a.status.started,
      endin: a.status.endin,
      recipe: a.status.recipe,
      name: a.status.name,
      template: a.status.template,
      ingredients: a.status.ingredients,
    };
  },
});

// Like gotStatus but without vox: ID
export const updateStatus = module.createAction({
  type: 'crafting/job/update-status',
  action: (status: VoxStatus) => {
    return { status };
  },
  reducer: (s, a) => {
    return {
      status: a.status.status,
      ready: a.status.ready,
      type: a.status.type,
      started: a.status.started,
      endin: a.status.endin,
      recipe: a.status.recipe,
      name: a.status.name,
      template: a.status.template,
      ingredients: a.status.ingredients,
    };
  },
});

export default module.createReducer();
