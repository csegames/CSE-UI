/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-05-07 16:16:29
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-08-11 19:37:33
 */

import {Module} from 'redux-typed-modules';
import {Recipe} from '../types';
import {VoxRecipe} from '../game/crafting';

export interface RecipesState {
  updating: number;
  purify: Recipe[];
  grind: Recipe[];
  refine: Recipe[];
  shape: Recipe[];
  block: Recipe[];
}

export const initialState = (): RecipesState => {
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
  actionExtraData: () => ({when: new Date()}),
});

function mapVoxRecipesToRecipes(voxRecipes: VoxRecipe[]): Recipe[] {
  return voxRecipes.map((r: VoxRecipe) => {
    const item: any = r.outputItem || {name: r.id};
    return {
      id: r.id,
      name: item.name,
      icon: item.iconUrl,
      description: item.description,
    };
  });
}

export const gotVoxRecipes = module.createAction({
  type: 'crafting/recipes/got-recipes',
  action: (recipeType: string, recipes: VoxRecipe[]) => ({
    recipeType,
    recipes: mapVoxRecipesToRecipes(recipes),
  }),
  reducer: (s, a) => {
    const type = a.recipeType;
    switch (type) {
      case 'purify':
      case 'refine':
      case 'grind':
      case 'shape':
      case 'block':
      case 'make':
        return {[type]: a.recipes.sort((a, b) => a.name.localeCompare(b.name))};
    }
    console.error('CRAFTING: illegal recipe type ' + type);
    return {};
  },
});

export default module.createReducer();
