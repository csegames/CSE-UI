/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-06-04 19:20:27
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-06-08 21:11:00
 */

interface VoxItem {
  id: string;
  shardID: number;
  stats: {
    item: {
      quality: number;
      mass: number;
      unitCount: number;
    };
  };
  staticDefinition: {
    id: string;
    name: string;
    iconUrl: string;
    description: string;
  };
}

interface VoxIngredient extends VoxItem {
  givenName: string;
}

interface VoxSelectedRecipe {
  id: string;
}

interface VoxSelectedTemplate extends VoxSelectedRecipe {}

interface VoxStatus {
  voxState: string;
  jobType: string;
  jobState: string;
  startTime: string;
  totalCraftingTime: number;
  givenName: string;
  itemCount: number;
  recipeID: string;
  endQuality: number;
  usedRepairPoints: number;
  ingredients: VoxIngredient[];
  template: VoxSelectedTemplate;
  possibleIngredients: VoxIngredient[];
}

interface VoxPossibleIngredient {
  givenName: string;
  id: string;
}

interface VoxRecipe {
  id: string;
  outputItem: {
    name: string;
    iconUrl: string;
    description: string;
  };
}

interface VoxTemplate {
  id: string;
  name: string;
  iconUrl: string;
  description: string;
}

export {
  VoxItem,
  VoxIngredient,
  VoxSelectedRecipe,
  VoxSelectedTemplate,
  VoxTemplate,
  VoxRecipe,
  VoxStatus,
  VoxPossibleIngredient,
};
