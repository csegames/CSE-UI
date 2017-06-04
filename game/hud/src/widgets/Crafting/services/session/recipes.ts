/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-07 16:16:29
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-04 22:54:58
 */

import { Module } from 'redux-typed-modules';
import { Recipe, Template } from '../types';
import { slash, isClient } from '../game/slash';
import { VoxRecipe } from '../game/crafting';

export interface RecipesState {
  updating: number;
  purify: Recipe[];
  grind: Recipe[];
  refine: Recipe[];
  shape: Recipe[];
  block: Recipe[];
}

export const initialState = () : RecipesState => {
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

function mapVoxRecipesToRecipes(voxRecipes: VoxRecipe[]): Recipe[] {
  return voxRecipes.map((r: VoxRecipe) => {
    return {
      id: r.id,
      name: r.outputItem.name,
      icon: r.outputItem.iconUrl,
      description: r.outputItem.description,
    };
  });
}

export const gotVoxRecipes = module.createAction({
  type: 'crafting/recipes/got-recipes',
  action: (recipeType: string, recipes: VoxRecipe[]) => {
    return { recipeType, recipes: mapVoxRecipesToRecipes(recipes) };
  },
  reducer: (s, a) => {
    const type = a.recipeType;
    switch (type) {
      case 'purify':
      case 'refine':
      case 'grind':
      case 'shape':
      case 'block':
      return { [type]: a.recipes };
    }
    console.error('CRAFTING: illegal recipe type ' + type);
    return {};
  },
});

// {depricated}
/*
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
      return { [type]: a.recipes };
    }
    console.error('CRAFTING: illegal recipe type ' + type);
    return {};
  },
});
*/

// Recipes

// {depricated}
export const recipeTypes = [
  'purify', 'refine', 'grind', 'shape', 'block',
];

// TESTING: Dummy Recipies

// {depricated}
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
  block: [
    { id: 1, name: 'Stone Block' },
    { id: 2, name: 'Wood Block' },
    { id: 3, name: 'Granite Block' },
    { id: 4, name: 'Hardwood Block' },
  ],
};

// {depricated}
/*
export function getRecipeFor(what: string, callback: (type: string, list: Recipe[]) => void) {
  if (!isClient()) {
    callback(what, dummyRecipies[what] || []);    // no cuAPI, simulation
  } else {
    slash('cr list ' + what + 'recipes', (response: any) => {
      switch (response.type) {
        case what:
          callback(what, response.list);
          break;
      }
    });
  }
}
*/

export default module.createReducer();
