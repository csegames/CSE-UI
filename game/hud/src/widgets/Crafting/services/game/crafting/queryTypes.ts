/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

interface VoxStaticDefinition {
  id: string;
  name: string;
  iconUrl: string;
  description: string;
}

interface VoxStatsItem {
  quality: number;
  mass: number;
  unitCount: number;
}

interface VoxStatsDurability {
  maxRepairPoints: number;
  maxDurability: number;
  fractureThreshold: number;
  fractureChance: number;
  currentRepairPoints: number;
  currentDurability: number;
}

interface VoxItemStats {
  item: VoxStatsItem;
  durability: VoxStatsDurability;
}

interface VoxItem {
  id: string;
  shardID: number;
  stats: VoxItemStats;
  staticDefinition: VoxStaticDefinition;
}

interface VoxIngredient extends VoxItem {
  givenName: string;
}

interface VoxPossibleIngredient extends VoxIngredient {}

interface VoxSelectedRecipe {
  id: string;
}

interface VoxStatus {
  voxState: string;
  jobType: string;
  jobState: string;
  startTime: string;
  totalCraftingTime: number;
  timeRemaining: number;
  givenName: string;
  itemCount: number;
  recipeID: string;
  endQuality: number;
  usedRepairPoints: number;
  ingredients: VoxIngredient[];
  possibleIngredients: VoxPossibleIngredient[];
}

interface VoxRecipe {
  id: string;
  outputItem: {
    name: string;
    iconUrl: string;
    description: string;
  };
}

interface VoxOutputItem extends VoxItem { }

export {
  VoxItem,
  VoxOutputItem,
  VoxIngredient,
  VoxSelectedRecipe,
  VoxRecipe,
  VoxStatus,
  VoxPossibleIngredient,
};
