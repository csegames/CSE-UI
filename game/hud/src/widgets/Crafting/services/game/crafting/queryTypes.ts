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

interface VoxLocation {
  itemSlot: string;
  voxInstanceId: string;
}

interface VoxItemLocation {
  inVox: VoxLocation;
}

interface VoxItem {
  id: string;
  location: VoxItemLocation;
  shardID: number;
  stats: VoxItemStats;
  staticDefinition: VoxStaticDefinition;
}

interface VoxIngredient extends VoxItem {
  givenName: string;
}

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
}

interface VoxRecipe {
  id: string;
  ingredientItem: {
    description: string;
    iconUrl: string;
    id: string;
    isVox: boolean;
    itemType: string;
    name: string;
  };
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
};
