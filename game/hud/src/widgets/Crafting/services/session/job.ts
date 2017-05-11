/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-03 20:46:31
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-07 23:09:34
 */

import { client, hasClientAPI } from 'camelot-unchained';
import { Module } from 'redux-typed-modules';
import { Ingredient, Recipe, Template, InventoryItem } from '../types';

export interface JobState {
  type: string;
  recipe: string;
  template: string;
  quality: number;
  ingredients: Ingredient[];
  name: string;
}

/////////////////////////////////////////////////////////////////////////////

function slash(command: string) {
  if (hasClientAPI()) {
    client.SendSlashCommand(command);
  } else {
    console.log('CRAFTING: would have sent ' + command + ' to server');
  }
}

let listening = false;
function listen() {
  if (listening) return;
  if (hasClientAPI()) {
    listening = true;
    client.OnChat((type: number, from: string, body: string, nick: string, iscse: boolean) => {
      console.log('CRAFTING: chat-monitor', type, from, body, nick, iscse);
    });
  }
}

/////////////////////////////////////////////////////////////////////////////

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
    slash('/cr vox setjob ' + jobType);
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
    slash('/cr vox startjob');
    return { };
  },
  reducer: (s, a) => {
    return s;
  },
});

export const clearJob = module.createAction({
  type: 'crafting/job/clear',
  action: () => {
    slash('/cr vox clearjob');
    return { };
  },
  reducer: (s, a) => {
    return s;
  },
});

export const collectJob = module.createAction({
  type: 'crafting/job/collect',
  action: () => {
    slash('/cr vox collect');
    return { };
  },
  reducer: (s, a) => {
    return s;
  },
});

export const setRecipe = module.createAction({
  type: 'crafting/job/set-recipe',
  action: (id: string) => {
    slash('/cr vox setrecipe ' + id);
    return { id };
  },
  reducer: (s, a) => {
    return Object.assign(s, { recipe: a.id });
  },
});

export const setQuality = module.createAction({
  type: 'crafting/job/set-quality',
  action: (quality: number) => {
    slash('/cr vox setquality ' + quality);
    return { quality };
  },
  reducer: (s, a) => {
    return Object.assign(s, { quality: a.quality });
  },
});

export const setName = module.createAction({
  type: 'crafting/job/set-name',
  action: (name: string) => {
    slash('/cr vox setname ' + name);
    return { name };
  },
  reducer: (s, a) => {
    return Object.assign(s, { name: a.name });
  },
});

export const setTemplate = module.createAction({
  type: 'crafting/job/set-template',
  action: (id: string) => {
    slash('/cr vox settemplate ' + id);
    return { id };
  },
  reducer: (s, a) => {
    return Object.assign(s, { template: a.id });
  },
});

// Recipes

export const recipeTypes = [
  'purify', 'refine', 'grind', 'shape', 'block',
];

// TESTING: Dummy Recipies

const dummyRecipies = {
  purify: [
    { id: 1, name: 'Distill Water' },
    { id: 2, name: 'Boil Water' },
    { id: 3, name: 'Smelt Gold' },
  ],
  refine: [
    { id: 1, name: 'Sieve Water' },
    { id: 2, name: 'Sleuse Gold' },
  ],
  grind: [
    { id: 1, name: 'Grind Salt' },
    { id: 2, name: 'Grind Flour' },
    { id: 3, name: 'Grind Stone' },
  ],
  shape: [
    { id: 1, name: 'Mold Clay' },
    { id: 2, name: 'Chisel Wood' },
    { id: 3, name: 'Hammer Metal' },
  ],
  block: [
    { id: 1, name: 'Stone Block' },
    { id: 2, name: 'Wood Block' },
    { id: 3, name: 'Granite Block' },
    { id: 4, name: 'Hardwood Block' },
  ],
};

export function getRecipeFor(what: string, callback: (type: string, list: Recipe[]) => void) {
  listen();
  slash('/cr list ' + what + 'recipes');
  // TODO how to capture response?
  callback(what, dummyRecipies[what]);
}

export function getAllRecipes(callback: (type: string, recipes: Recipe[]) => void) {
  const done = (type: string, list: Recipe[]) => callback(type, list);
  recipeTypes.forEach((type: string) => getRecipeFor(type, done));
  return recipeTypes.length;
}

// Templates

export const templateTypes = [
  'armour', 'weapons',
  'substences', 'inventory', 'blocks',
];

// TESTING: Dummy Templates

const dummyTemplates = {
  armour: [
    { id: 1, name: 'Silly Hat of Awesomness' },
    { id: 2, name: 'Big Boots of Buffalo Hide' },
  ],
  weapons: [
    { id: 1, name: 'Big Sword of Jobber' },
    { id: 2, name: 'Small Kife of Sneakyness' },
  ],
};

export function getTemplateFor(what: string, callback: (type: string, list: Template[]) => void) {
  listen();
  slash('/cr list ' + what + 'recipes');
  // TODO how to capture response
  callback(what, dummyTemplates[what]);
}

export function getAllTemplates(callback: (type: string, templates: Template[]) => void) {
  const done = (type: string, list: Template[]) => callback(type, list);
  templateTypes.forEach((type: string) => getTemplateFor(type, done));
  return templateTypes.length;
}

export default module.createReducer();
