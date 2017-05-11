/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-07 16:16:29
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-05-07 18:25:55
 */

import { Module } from 'redux-typed-modules';

import { Recipe } from '../types';

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

export default module.createReducer();
