/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Module } from 'redux-typed-modules';
import { Recipe } from '../types';
import { VoxRecipe } from '../game/crafting';

export interface RecipesState {
  updating: number;
  purify: Recipe[];
  grind: Recipe[];
  shape: Recipe[];
  block: Recipe[];
}

export const initialState = (): RecipesState => {
  return {
    updating: 0,
    purify: [],
    grind: [],
    shape: [],
    block: [],
  };
};

const module = new Module({
  initialState: initialState(),
  actionExtraData: () => ({ when: new Date() }),
});

function mapVoxRecipesToRecipes(voxRecipes: VoxRecipe[]): Recipe[] {
  return voxRecipes.map((r: VoxRecipe) => {
    const item: any = r.outputItem || { name: r.id };
    return {
      id: r.id,
      name: item.name,
      icon: item.iconUrl,
      description: item.description,
    };
  });
}

function mapPurifyRecipesToRecipes(voxRecipes: VoxRecipe[]): Recipe[] {
  return voxRecipes.map((r: VoxRecipe) => {
    const item: any = r.ingredientItem || { name: r.id };
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
    recipes,
  }),
  reducer: (s, a) => {
    const type = a.recipeType;
    switch (type) {
      case 'grind':
      case 'shape':
      case 'block':
      case 'make':
        const mappedVoxRecipes = mapVoxRecipesToRecipes(a.recipes);
        return { [type]: mappedVoxRecipes.sort((a, b) => a.name.localeCompare(b.name)) };
      case 'purify': {
        const mappedPurifyRecipes = mapPurifyRecipesToRecipes(a.recipes);
        return { [type]: mappedPurifyRecipes.sort((a, b) => a.name.localeCompare(b.name)) };
      }
    }
    console.error('CRAFTING: illegal recipe type ' + type);

    return {};
  },
});

export default module.createReducer();
