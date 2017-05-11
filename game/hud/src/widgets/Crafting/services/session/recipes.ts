/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-07 16:16:29
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-12 00:45:51
 */

import { client, hasClientAPI } from 'camelot-unchained';
import { Module } from 'redux-typed-modules';

import { Recipe, Template } from '../types';

/////////////////////////////////////////////////////////////////////////////

export function slash(command: string) {
  if (hasClientAPI()) {
    console.log('CRAFTING: command: ' + command);
    client.SendSlashCommand(command);
  } else {
    console.log('CRAFTING: would have sent ' + command + ' to server');
  }
}

let listening = 0;
const callbacks = {};

export function listen(cb: any) {
  if (hasClientAPI()) {
    callbacks[++listening] = cb;
    function cancel() {
      callbacks[this.id] = null;
    }
    const res = {
      id: listening,
      cancel,
    };
    if (listening > 1) return res;
    client.OnConsoleText((text: string) => {
      const lines = text.split(/[\r\n]/g);
      const what = lines[0];
      switch (what) {
        case 'Purify Recipies:':
        case 'Refine Recipies:':
        case 'Grind Recipies:':
        case 'Shape Recipies:':
        case 'Blocks Recipies:':
          lines.shift();
          const list = [];
          for (let i = 0; i < lines.length; i++) {
            const args = lines[i].split(' - ');
            if (args.length === 2) {
              list.push({ id: args[0], name: args[1] });
            } else {
              // probably an error message
              console.warn(args[0]);
            }
          }
          for (const key in callbacks) {
            if (callbacks[key]) {
              callbacks[key](what, list);
            }
          }
          break;
      }
    });
    return res;
  }
}

/////////////////////////////////////////////////////////////////////////////

export interface RecipesState {
  updating: number;
  purify: Recipe[];
  grind: Recipe[];
  refine: Recipe[];
  shape: Recipe[];
  block: Recipe[];
}

const initialState = () : RecipesState => {
  console.log('CRAFTING: generate initialRecipeState');
  return {
    updating: 0,
    purify: [],
    grind: [],
    refine: [],
    shape: [],
    block: [],
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

export const updatingRecipes = module.createAction({
  type: 'crafting/recipes/updating',
  action: () => {
    return { };
  },
  reducer: (s, a) => {
    console.log('CRAFTING: updating ' + Date.now());
    return Object.assign(s, { updating: Date.now() });
  },
});

export const updatedRecipes = module.createAction({
  type: 'crafting/recipes/updated',
  action: () => {
    return { };
  },
  reducer: (s, a) => {
    console.log('CRAFTING: finished updating');
    return Object.assign(s, { updating: 0 });
  },
});

export const gotRecipe = module.createAction({
  type: 'crafting/recipes/got-recipes',
  action: (recipeType: string, recipes: Recipe[]) => {
    return { recipeType, recipes };
  },
  reducer: (s, a) => {
    const type = a.recipeType;
    switch (type) {
      case 'purify':
      case 'refine':
      case 'grind':
      case 'shape':
      case 'block':
      console.log('CRAFTING: ' + type, a.recipes);
      return Object.assign(s, { [type]: [...a.recipes] });
    }
    console.error('CRAFTING: illegal recipe type ' + type);
    return s;
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
  const listener = listen((prefix: string, recipes: any[]) => {
    callback(what, recipes);
    listener.cancel();
  });
  slash('cr list ' + what + 'recipes');
}

export function getAllRecipes(callback: (type: string, recipes: Recipe[]) => void) {
  const done = (type: string, list: Recipe[]) => callback(type, list);
  recipeTypes.forEach((type: string) => getRecipeFor(type, done));
  return recipeTypes.length;
}

export default module.createReducer();
