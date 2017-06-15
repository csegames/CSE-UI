/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-03 20:46:31
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-15 21:25:09
 */

import { client, hasClientAPI } from 'camelot-unchained';
import { Module } from 'redux-typed-modules';
import { slash, isClient } from '../game/slash';
import { Ingredient, InventoryItem, Recipe, Template, Message, SlashVoxStatus } from '../types';
import { VoxStatus, VoxIngredient, VoxPossibleIngredient, VoxOutputItem, VoxItem } from '../game/crafting';

export interface JobState {
  loading: boolean;                   // Are we starting up?
  status: string;                     // Vox status (if known)
  ready: boolean;                     // Crafting complete? (Item Ready)  -- TODO Do we need this?
  type: string;                       // What type of crafting are we doing?
  started: string;                    // When last job started
  endin: number;                      // How long until it ends
  timeRemaining: number;              // For running job, how long left
  recipe: Recipe;                     // Selected Recipe
  template: Template;                 // Selected Template (make job)
  quality: number;                    // Desired quality
  possibleIngredients: Ingredient[];  // ingredients that can go in the vox
  possibleType: string;               // job type of possible ingredients
  ingredients: Ingredient[];          // ingredients in the vox
  outputItems: InventoryItem[];       // Output items of the current vox job
  name: string;                       // Item Name (make)
  message: Message;                   // Last message from vox
  count: number;                      // Number of items to make
}

export const initialState = () : JobState => {
  return {
    status: 'unknown',
    ready: false,
    loading: false,
    type: null,
    started: null,
    endin: null,
    timeRemaining: 0,
    recipe: null,
    template: null,
    quality: undefined,
    possibleIngredients: [],
    possibleType: undefined,
    ingredients: [],
    outputItems: [],
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

export const setStatus = module.createAction({
  type: 'crafting/job/set-status',
  action: (status: string) => {
    return { status };
  },
  reducer: (s, a) => {
    return { status: a.status };
  },
});

export const setCount = module.createAction({
  type: 'crafting/job/set-count',
  action: (count: number) => {
    return { count };
  },
  reducer: (s, a) => {
    return { count: a.count || 0 };
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
  action: (ingredient: Ingredient, qty: number, movedTo: string) => {
    return { ingredient, qty, movedTo };
  },
  reducer: (s, a) => {
    const ingredients = [ ...s.ingredients ];
    const possibleIngredients = [ ...s.possibleIngredients ];
    const qty = a.qty;
    if (a.movedTo) {
      let i;
      // find and remove quantity used from possibleIngredients
      for (i = 0; i < possibleIngredients.length; i++) {
        const ingredient = possibleIngredients[i];
        if (isSameIngredient(ingredient, a.ingredient)) {
          ingredient.stats.unitCount -= qty;
          break;
        }
      }
      // Upadte existing ingredient
      for (i = 0; i < ingredients.length; i++) {
        const ingredient = ingredients[i];
        if (ingredient.id === a.movedTo) {
          ingredient.qty += qty;
          break;
        }
      }
      if (i === ingredients.length) {
        // or add new one
        ingredients.push(Object.assign({}, a.ingredient, {
          id: a.movedTo,
          qty: a.qty,
        }));
      }
      return { ingredients, possibleIngredients };
    }
    console.error('job:addIngredient missing modedTo ID');
    return {};
  },
});

function isSameIngredient(a: Ingredient, b: Ingredient): boolean {
  return a.static.id === b.static.id && a.stats.quality === b.stats.quality;
}

export const removeIngredient = module.createAction({
  type: 'crafting/job/remove-ingredient',
  action: (item: Ingredient) => {
    return { item };
  },
  reducer: (s, a) => {
    const ingredients = s.ingredients.filter((item: InventoryItem) => item.id !== a.item.id);
    const possibleIngredients = [ ...s.possibleIngredients ];
    const qty = a.item.qty;  // the quantity of the item added to the vox
    let i;
    // add back to possible ingredients
    for (i = 0; i < possibleIngredients.length; i++) {
      const ingredient = possibleIngredients[i];
      if (isSameIngredient(ingredient, a.item)) {
        ingredient.stats.unitCount += qty;
        break;
      }
    }
    if (i === possibleIngredients.length) {
      // or add new possible ingredient
      possibleIngredients.push(a.item);
    }
    return { ingredients, possibleIngredients };
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
    // but keep possible ingredients incase we use them again
    return Object.assign({}, initialState(), {
      status: 'idle',
      possibleIngredients: s.possibleIngredients,
      possibleType: s.possibleType,
    });
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
    return Object.assign({}, initialState(), {
      status: 'idle',
      possibleIngredients: s.possibleIngredients,
      possibleType: s.possibleType,
    });
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
    return { quality: a.quality || 0 };
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

export const gotVoxPossibleIngredients = module.createAction({
  type: 'crafting/job/got-vox-possible-ingredients',
  action: (ingredients: VoxPossibleIngredient[], ingredientsType: string) => {
    return { ingredients, ingredientsType };
  },
  reducer: (s, a) => {
    return {
      possibleIngredients: mapVoxIngredientsToIngredients(a.ingredients),
      possibleType: a.ingredientsType,
    };
  },
});

function mapVoxIngredientsToIngredients(vis: VoxIngredient[]): Ingredient[] {
  const ingredients: Ingredient[] = [];
  if (vis) {
    for (let i = 0; i < vis.length; i++) {
      const item = vis[i].stats.item;
      ingredients.push({
        id: vis[i].id,
        name: vis[i].givenName || vis[i].staticDefinition.name,
        qty: item.unitCount,
        static: {
          id: vis[i].staticDefinition.id,
          icon: vis[i].staticDefinition.iconUrl,
          description: vis[i].staticDefinition.description,
        },
        stats: {
          quality: item.quality,
          unitCount: item.unitCount,
          weight: item.mass,
          durability: {
            current: vis[i].stats.durability.currentDurability,
            currentPoints: vis[i].stats.durability.currentRepairPoints,
          },
        },
      });
    }
  }
  return ingredients;
}

export const gotVoxStatus = module.createAction({
  type: 'crafting/job/got-vox-status',
  action: (status: VoxStatus) => {
    return { status };
  },
  reducer: (s, a) => {
    const status = a.status;
    const startTime = new Date(status.startTime);
    const endTime = new Date(startTime.valueOf() + (status.totalCraftingTime * 1000));
    const ingredients: Ingredient[] = mapVoxIngredientsToIngredients(a.status.ingredients);
    return {
      status: a.status.jobState,
      ready: undefined,
      type: a.status.jobType,
      quality: ((a.status.endQuality * 100) + 0.5) | 0,           // 0.57 * 100 = 56.9999999 in javascript!
      quantity: (a.status.itemCount | 0),
      started: startTime.toISOString(),
      endin: ((endTime.valueOf() - startTime.valueOf()) / 1000),
      timeRemaining: a.status.timeRemaining,
      recipe: a.status.recipeID && { id: a.status.recipeID, name: '' },
      name: a.status.givenName,
      template: status.template && { id: status.template.id, name: '' },
      ingredients,
    };
  },
});

function mapVoxItemToInventoryItem(vis: VoxItem[]): InventoryItem[] {
  const items: InventoryItem[] = [];
  if (vis) {
    for (let i = 0; i < vis.length; i++) {
      const item = vis[i].stats.item;
      items.push({
        id: vis[i].id,
        name: vis[i].staticDefinition.name,
        static: {
          id: vis[i].staticDefinition.id,
          icon: vis[i].staticDefinition.iconUrl,
          description: vis[i].staticDefinition.description,
        },
        stats: {
          quality: item.quality,
          unitCount: item.unitCount,
          weight: item.mass,
          durability: {
            current: vis[i].stats.durability.currentDurability,
            currentPoints: vis[i].stats.durability.currentRepairPoints,
          },
        },
      });
    }
  }
  return items;
}

export const gotOutputItems = module.createAction({
  type: 'crafting/job/got-output-items',
  action: (outputItems: VoxOutputItem[]) => {
    return { outputItems };
  },
  reducer: (s, a) => {
    return { outputItems: a.outputItems && mapVoxItemToInventoryItem(a.outputItems) };
  },
});

export default module.createReducer();
