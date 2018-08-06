/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Module } from 'redux-typed-modules';
import { Ingredient, InventoryItem, Recipe, Message } from '../types';
import { VoxStatus, VoxOutputItem, VoxItem, VoxIngredient } from '../game/crafting';

export interface JobState {
  loading: boolean;                   // Are we starting up?
  status: string;                     // Vox status (if known)
  ready: boolean;                     // Crafting complete? (Item Ready)  -- TODO Do we need this?
  type: string;                       // What type of crafting are we doing?
  started: string;                    // When last job started
  timeRemaining: number;              // For running job, how long left
  totalCraftingTime: number;          // For running job, how long left
  recipe: Recipe;                     // Selected Recipe
  possibleItemSlots: string[];        // Possible recipe slots
  quality: number;                    // Desired quality
  possibleIngredientsForSlot: Ingredient[];  // ingredients that can go in the vox
  slot: string;                       // current slot type selected
  ingredients: Ingredient[];          // ingredients in the vox
  outputItems: InventoryItem[];       // Output items of the current vox job
  name: string;                       // Item Name (make)
  message: Message;                   // Last message from vox
  itemCount: number;                      // Number of items to make
  count: number;
}

export const initialState = (): JobState => {
  return {
    status: 'unknown',
    ready: false,
    loading: false,
    type: null,
    started: null,
    timeRemaining: 0,
    totalCraftingTime: 0,
    recipe: null,
    possibleItemSlots: undefined,
    quality: undefined,
    possibleIngredientsForSlot: undefined,
    slot: undefined,
    ingredients: [],
    outputItems: [],
    name: null,
    message: null,
    itemCount: undefined,
    count: 0,
  };
};

const module = new Module({
  initialState: initialState(),
  actionExtraData: () => ({ when: new Date() }),
});

export const setJobType = module.createAction({
  type: 'crafting/job/set-job',
  action: (jobType: string) => ({ jobType }),
  reducer: (s, a) => ({ type: a.jobType }),
});

export const setStatus = module.createAction({
  type: 'crafting/job/set-status',
  action: (status: string) => ({ status }),
  reducer: (s, a) => ({ status: a.status }),
});

export const setCount = module.createAction({
  type: 'crafting/job/set-count',
  action: (count: number) => ({ count }),
  reducer: (s, a) => ({ count: a.count || 0 }),
});

export const setLoading = module.createAction({
  type: 'crafting/job/set-loading',
  action: (loading: boolean) => ({ loading }),
  reducer: (s, a) => ({ loading: a.loading }),
});

export const addIngredient = module.createAction({
  type: 'crafting/job/add-ingredient',
  action: (ingredient: Ingredient, qty: number, movedTo: string) => {
    return { ingredient, qty, movedTo };
  },
  reducer: (s, a) => {
    const ingredients = [...s.ingredients];
    const qty = a.qty;
    // Update existing ingredient
    let i;
    for (i = 0; i < ingredients.length; i++) {
      const ingredient = ingredients[i];
      if (ingredient.id === (a.movedTo || a.ingredient.id)) {
        ingredients[i] = Object.assign({}, ingredient, {
          qty: ingredient.qty + qty,
        });
        break;
      }
    }
    if (i === ingredients.length) {
      // or add new one
      ingredients.push(Object.assign({}, a.ingredient, {
        id: a.movedTo || a.ingredient.id,
        qty: a.qty,
      }));
    }
    return {
      ingredients: ingredients.sort((a, b) => a.name.localeCompare(b.name)),
    };
  },
});

export const removeIngredient = module.createAction({
  type: 'crafting/job/remove-ingredient',
  action: (item: Ingredient) => ({ item }),
  reducer: (s, a) => {
    const ingredients = s.ingredients.filter((item: InventoryItem) => item.id !== a.item.id);
    return {
      ingredients,
    };
  },
});

export const removePossibleIngredientForSlot = module.createAction({
  type: 'crafting/job/remove-possible-ingredient-for-slot',
  action: (slot: string, item: Ingredient, qty: number) => ({ slot, item, qty }),
  reducer: (s, a) => {
    const possibleIngredientsForSlot = s.possibleIngredientsForSlot.map((ingredient: Ingredient) => {
      if (ingredient.id === a.item.id) {
        const unitCount = ingredient.stats.unitCount - a.qty;
        return Object.assign({}, ingredient, {
          stats: Object.assign({}, ingredient.stats, { unitCount }),
          qty: unitCount,
        });
      }
      return ingredient;
    });
    return {
      possibleIngredientsForSlot,
    };
  },
});

export const restorePossibleIngredientForSlot = module.createAction({
  type: 'crafting/job/restore-possible-ingredient-for-slot',
  action: (slot: string, item: Ingredient) => ({ slot, item }),
  reducer: (s, a) => {
    // Cop-out: clear current slot when removing items from
    // vox, force re-selection (which will update possible ingredients
    // list) so we don't need to worry about updating the list
    return {
      slot: undefined,
      possibleIngredientsForSlot: undefined,
    };
  },
});

export const startJob = module.createAction({
  type: 'crafting/job/start',
  action: () => ({}),
  reducer: (s, a) => ({}),
});

export const clearJob = module.createAction({
  type: 'crafting/job/clear',
  action: () => ({}),
  reducer: (s, a) => {
    // Clearing a job effectively resets the vox back to idle
    // but keep possible ingredients incase we use them again
    return Object.assign({}, initialState(), {
      status: 'idle',
      slot: undefined,
      possibleItemSlots: undefined,
      possibleIngredientsForSlot: undefined,
    });
  },
});

export const cancelJob = module.createAction({
  type: 'crafting/job/cancel',
  action: () => ({}),
  reducer: (s, a) => ({ status: 'Configuring' }),
});

export const collectJob = module.createAction({
  type: 'crafting/job/collect',
  action: () => ({}),
  reducer: (s, a) => ({
    // collecting a job should clear some stuff
    recipe: undefined,
    possibleItemSlots: undefined,
    slot: undefined,
    possibleIngredientsForSlot: undefined,
  }),
});

export const setRecipe = module.createAction({
  type: 'crafting/job/set-recipe',
  action: (recipe: Recipe) => ({ recipe }),
  reducer: (s, a) => ({
    recipe: a.recipe,
    possibleItemSlots: undefined,   // selecting a recipe clears the possible slots
    slot: undefined,
    possibleIngredientsForSlot: undefined,    // and possible ingredients for slot
  }),
});

export const setQuality = module.createAction({
  type: 'crafting/job/set-quality',
  action: (quality: number) => ({ quality }),
  reducer: (s, a) => ({ quality: a.quality || 0 }),
});

export const setName = module.createAction({
  type: 'crafting/job/set-name',
  action: (name: string) => ({ name }),
  reducer: (s, a) => ({ name: a.name }),
});

export const setMessage = module.createAction({
  type: 'crafting/job/set-message',
  action: (message: Message) => ({ message }),
  reducer: (s, a) => ({ message: a.message }),
});

export const gotVoxPossibleIngredientsForSlot = module.createAction({
  type: 'crafting/job/got-vox-possible-ingredients-with-slots',
  action: (ingredients: VoxIngredient[], slot: string) => ({
    ingredients,
    slot,
  }),
  reducer: (s, a) => {
    return {
      possibleIngredientsForSlot: a.ingredients
        && mapVoxIngredientsToIngredients(a.ingredients).sort((a, b) => a.name.localeCompare(b.name)),
      slot: a.slot,
    };
  },
});

function mapVoxIngredientsToIngredients(vis: VoxIngredient[]): Ingredient[] {
  const ingredients: Ingredient[] = [];
  if (vis) {
    for (let i = 0; i < vis.length; i++) {
      const item = vis[i].stats.item;
      const durability = vis[i].stats.durability;
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
          weight: item.selfMass,
          durability: {
            current: durability ? durability.currentDurability : 0,
            currentPoints: durability ? durability.currentRepairPoints : 0,
          },
        },
        slot: vis[i].location && vis[i].location.inVox.itemSlot,
      });
    }
  }
  return ingredients;
}

export const gotVoxStatus = module.createAction({
  type: 'crafting/job/got-vox-status',
  action: (status: VoxStatus) => ({ status }),
  reducer: (s, a) => {
    const status = a.status;
    const startTime = new Date(status.startTime);
    const ingredients: Ingredient[] = mapVoxIngredientsToIngredients(status.ingredients);
    return {
      status: status.jobState,
      ready: undefined,
      type: status.jobType.toLowerCase(),
      quality: ((status.endQuality * 100) + 0.5) | 0,           // 0.57 * 100 = 56.9999999 in javascript!
      itemCount: (status.itemCount | 0),
      started: startTime.toISOString(),
      timeRemaining: status.timeRemaining,
      totalCraftingTime: status.totalCraftingTime,
      recipe: status.recipeID && { id: status.recipeID, name: '' },
      name: status.givenName,
      ingredients,
    };
  },
});

function mapVoxItemsToInventoryItems(vis: VoxItem[]): InventoryItem[] {
  const items: InventoryItem[] = [];
  if (vis) {
    for (let i = 0; i < vis.length; i++) {
      const item = vis[i].stats.item;
      const durability = vis[i].stats.durability;
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
          weight: item.selfMass,
          durability: {
            current: durability ? durability.currentDurability : 0,
            currentPoints: durability ? durability.currentRepairPoints : 0,
          },
        },
      });
    }
  }
  return items;
}

export const gotOutputItems = module.createAction({
  type: 'crafting/job/got-output-items',
  action: (outputItems: VoxOutputItem[]) => ({ outputItems }),
  reducer: (s, a) => ({ outputItems: a.outputItems && mapVoxItemsToInventoryItems(a.outputItems) }),
});

export const gotPossibleItemSlots = module.createAction({
  type: 'crafting/job/got-possible-slots',
  action: (slots: string[]) => ({ slots }),
  reducer: (s, a) => ({
    possibleItemSlots: a.slots.slice(0),
  }),
});

export default module.createReducer();
