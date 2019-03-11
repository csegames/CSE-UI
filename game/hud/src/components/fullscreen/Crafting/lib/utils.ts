/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import moment from 'moment';
import { find, sortBy } from 'lodash';
import { getItemUnitCount, getItemDurability } from 'fullscreen/lib/utils';
import { RecipeType, InputItem, RecipeData, AlloyType } from '../CraftingBase';
import { JobContextMap, ContextState } from '../components/JobPanel/JobPanelContext';
import {
  VoxJobType,
  InventoryItem,
  MakeRecipeDefRef,
  VoxItem,
  VoxJob,
  VoxJobState,
  VoxJobGroupLog,
  CraftingBaseQuery,
  SubItemSlot,
  ItemType,
  ItemDefRef,
} from 'gql/interfaces';

export function getJobContext(jobNumber: number): React.Context<ContextState> {
  return JobContextMap[jobNumber];
}

export function getVoxJob(voxItem: VoxItem.Fragment, jobNumber: number): VoxItem.Jobs {
  if (!voxItem) return null;

  return voxItem.voxStatus.jobs[jobNumber];
}

export function getVoxJobState(voxJob: VoxJob.Fragment): VoxJobState {
  if (!voxJob) return null;

  return voxJob.jobState;
}

export function getNearestVoxEntityID(crafting: CraftingBaseQuery.Crafting) {
  if (!crafting) return '';

  return crafting.nearestVoxEntityID;
}

export function getUppercaseRecipeType(recipeType: RecipeType) {
  return recipeType.charAt(0).toUpperCase() + recipeType.substr(1, recipeType.length);
}

export function getRecipeType(type: string): RecipeType {
  switch (type) {
    case 'makeRecipes': {
      return RecipeType.Make;
    }
    case 'blockRecipes': {
      return RecipeType.Block;
    }
    case 'purifyRecipes': {
      return RecipeType.Purify;
    }
    case 'grindRecipes': {
      return RecipeType.Grind;
    }
    case 'shapeRecipes': {
      return RecipeType.Shape;
    }
    default: {
      return RecipeType.None;
    }
  }
}

export function voxJobToRecipeType(jobType: VoxJobType): RecipeType {
  switch (jobType) {
    case VoxJobType.Make: {
      return RecipeType.Make;
    }
    case VoxJobType.Block: {
      return RecipeType.Block;
    }
    case VoxJobType.Grind: {
      return RecipeType.Grind;
    }
    case VoxJobType.Purify: {
      return RecipeType.Purify;
    }
    case VoxJobType.Shape: {
      return RecipeType.Shape;
    }
    case VoxJobType.Salvage: {
      return RecipeType.Salvage;
    }
    case VoxJobType.Repair: {
      return RecipeType.Repair;
    }
    default: {
      return RecipeType.None;
    }
  }
}

export function recipeTypeToVoxJob(recipeType: RecipeType): VoxJobType {
  switch (recipeType) {
    case RecipeType.Make: {
      return VoxJobType.Make;
    }
    case RecipeType.Block: {
      return VoxJobType.Block;
    }
    case RecipeType.Grind: {
      return VoxJobType.Grind;
    }
    case RecipeType.Purify: {
      return VoxJobType.Purify;
    }
    case RecipeType.Shape: {
      return VoxJobType.Shape;
    }
    case RecipeType.Salvage: {
      return VoxJobType.Salvage;
    }
    case RecipeType.Repair: {
      return VoxJobType.Repair;
    }
    default: {
      return VoxJobType.Invalid;
    }
  }
}

export function getMinAndMaxItemCount(recipe: RecipeData, inputItems: InputItem[]) {
  let minItemCount = 0;
  let maxItemCount = 0;
  if (!recipe || !inputItems) {
    return {
      minItemCount,
      maxItemCount,
    };
  }

  if (recipe.type === RecipeType.Make) {
    const recipeDef: MakeRecipeDefRef = recipe.def as MakeRecipeDefRef;

    // ingredientIdToRequiredUnitCount is responsible for
    // how much of each ingredient is needed to create the selected recipe
    const ingredientIdToRequiredUnitCount: {[id: string]: number} = {};

    // ingredientIdToMinUnitCount is responsible for how many recipe items the player is able to
    // create based off of the items they have put into the vox,
    const ingredientIdToAvailableUnitCount: {[id: string]: number} = {};

    recipeDef.ingredients.forEach((ingredient) => {
      ingredientIdToRequiredUnitCount[ingredient.ingredient.id] = ingredient.unitCount;
    });

    inputItems.forEach((item) => {
      const requiredUnitCount = ingredientIdToRequiredUnitCount[item.item.staticDefinition.id];
      if (requiredUnitCount) {
        ingredientIdToAvailableUnitCount[item.item.staticDefinition.id] =
          Math.floor(getItemUnitCount(item.item) / requiredUnitCount);
      }
    });

    Object.keys(ingredientIdToRequiredUnitCount).forEach((ingredientId) => {
      if (!ingredientIdToAvailableUnitCount[ingredientId]) {
        // If not already in ingredientIdToAvailableUnitCount, that means there is no available inputItems.
        // This means we probably dont have enough input items for the recipe
        ingredientIdToAvailableUnitCount[ingredientId] = 0;
      }
    });

    Object.keys(ingredientIdToAvailableUnitCount).forEach((ingredientId) => {
      const availableUnitCount = ingredientIdToAvailableUnitCount[ingredientId];
      if (minItemCount === 0 && availableUnitCount > minItemCount) {
        // If we can create any item, then the min will be 1.
        minItemCount = 1;
      }

      if (maxItemCount === 0 || (maxItemCount !== 0 && availableUnitCount < maxItemCount)) {
        // Choose the lowest available unit count based off ingredient.
        maxItemCount = availableUnitCount;
      }
    });

    if (maxItemCount < minItemCount) {
      maxItemCount = minItemCount;
    }
  }

  return {
    minItemCount,
    maxItemCount,
  };
}

export function getMinAndMaxQuality(recipe: RecipeData, inputItems: InputItem[]) {
  let minQuality = 0;
  let maxQuality = 100;

  if (!recipe || !recipe.def || !recipe.def.outputItem || !recipe.def.outputItem.substanceDefinition) {
    return {
      minQuality,
      maxQuality,
    };
  }

  if (recipe.type === RecipeType.Purify || recipe.type === RecipeType.Shape) {
    let isAlreadyMaxQuality = false;
    inputItems.forEach((inputItem) => {
      if (inputItem.item.stats.item.quality === 1) {
        isAlreadyMaxQuality = true;
      } else {
        isAlreadyMaxQuality = false;
      }
    });

    if (isAlreadyMaxQuality) {
      return {
        minQuality: 1,
        maxQuality: 1,
      };
    }
  }

  const sortedInputItems = sortBy(inputItems, inputItem => inputItem.item.stats.item.quality);
  minQuality = (sortedInputItems[0] && sortedInputItems[0].item.stats.item.quality) ||
    recipe.def.outputItem.substanceDefinition.minQuality;
  maxQuality = recipe.def.outputItem.substanceDefinition.maxQuality;

  return {
    minQuality,
    maxQuality,
  };
}

export function getJobInstance(voxItem: VoxItem.Fragment, jobNumber: number) {
  return voxItem.voxStatus.jobs[jobNumber];
}

export function shouldShowItemCount(selectedRecipe: RecipeData) {
  return selectedRecipe && selectedRecipe.type === RecipeType.Make;
}

export function shouldShowShapeRunCount(selectedRecipe: RecipeData) {
  return selectedRecipe && selectedRecipe.type === RecipeType.Shape;
}

export function shouldShowQualityEdit(voxJob: VoxJob.Fragment) {
  return voxJob && voxJob.jobType === VoxJobType.Purify;
}

export function canStartJob(voxJob: VoxJob.Fragment) {
  return voxJob && voxJob.jobState === VoxJobState.Configuring && voxJob.outputItems.length > 0;
}

export function shouldShowClearButton(voxJob: VoxJob.Fragment) {
  return voxJob && voxJob.jobState === VoxJobState.Configuring;
}

export function shouldShowCollectButton(voxJob: VoxJob.Fragment) {
  return voxJob && voxJob.jobState === VoxJobState.Finished;
}

export function shouldShowCustomNameInput(voxJob: VoxJob.Fragment) {
  return voxJob && voxJob.jobType === VoxJobType.Make;
}

export function shouldShowAvailablePatterns(voxJob: VoxJob.Fragment) {
  return !voxJob || (voxJob.jobState === VoxJobState.Configuring || voxJob.jobState === VoxJobState.None);
}

export function jobIsConfigurable(voxJob: VoxJob.Fragment) {
  return !voxJob || (voxJob && (voxJob.jobState === VoxJobState.Configuring || voxJob.jobState === VoxJobState.None));
}

export function getRecipeDefId(selectedRecipe: RecipeData) {
  if (selectedRecipe.def) {
    return selectedRecipe.def.id;
  }

  return null;
}

export function getJobTypeIcon(jobType: VoxJobType) {
  switch (jobType) {
    case VoxJobType.Purify: {
      return 'icon-purify';
    }
    case VoxJobType.Repair: {
      return 'icon-repair';
    }
    case VoxJobType.Block: {
      return 'icon-make';
    }
    case VoxJobType.Make: {
      return 'icon-make';
    }
    case VoxJobType.Salvage: {
      return 'icon-salvage';
    }
    case VoxJobType.Shape: {
      return 'icon-shape';
    }
  }
}

export function getGroupLogDescription(groupLog: VoxJobGroupLog.Fragment) {
  return `I've run this ${groupLog.jobType.toLowerCase()} job ${getDescriptionTimesCrafted(groupLog)}. ` +
    (groupLog.timesCrafted > 0 ? `The last time I ran this job was ${getDescriptionGroupLastCrafted(groupLog)}.` : '');
}

export function getDescriptionTimesCrafted(groupLog: VoxJobGroupLog.Fragment) {
  return groupLog.timesCrafted === 1 ? `${groupLog.timesCrafted} time` : `${groupLog.timesCrafted} times`;
}

export function getDescriptionGroupLastCrafted(groupLog: VoxJobGroupLog.Fragment) {
  return moment(groupLog.lastCrafted).fromNow();
}

export function itemCanBeRepaired(item: InventoryItem.Fragment) {
  const durability = getItemDurability(item);
  if (durability == null) {
    return false;
  }

  const remainingRepairs = durability.maxRepairPoints - durability.currentRepairPoints;
  if (remainingRepairs <= 0) {
    return false;
  }

  if (durability.currentHealth >= durability.maxHealth) {
    return false;
  }

  return true;
}

export function itemCanBeSalvaged(item: InventoryItem.Fragment) {
  if (!item.hasSubItems && !item.stats.block) {
    return false;
  }

  if (item.staticDefinition.itemType === 'Ammo') {
    return false;
  }

  return true;
}

export function getFavoriteIcon(groupLog: VoxJobGroupLog.Fragment, use4k?: boolean) {
  const resPrefix = use4k ? '4k' : '1080';
  return groupLog.favorite ?
    `../images/crafting/${resPrefix}/paper-favorite-on.png` :
    `../images/crafting/${resPrefix}/paper-favorite-off.png`;
}

export function getItemSlotForRecipe(item: ItemDefRef.Fragment,
                                      recipe: RecipeData | null,
                                      slotNumber?: number) {
  if (!recipe) return SubItemSlot.NonRecipe;
  switch (recipe.type) {
    case RecipeType.Make: {
      const matchingIngredient = find((recipe.def as MakeRecipeDefRef).ingredients, ingredient =>
        ingredient.ingredient.id === item.id);
      if (matchingIngredient) {
        return matchingIngredient.slot;
      }

      return SubItemSlot.Invalid;
    }
    case RecipeType.Shape:
    case RecipeType.Block: {
      if (slotNumber === 0) {
        return SubItemSlot.PrimaryIngredient;
      } else {
        return SubItemSlot[`SecondaryIngredient${slotNumber}`];
      }
    }
    default: {
      return SubItemSlot.NonRecipe;
    }
  }
}

export function toDisplayQuality(quality: number) {
  return (quality * 100).toFixed(0);
}

export function getDefaultGroupLog(recipeType: RecipeType, jobIdentifier: string): VoxJobGroupLog.Fragment {
  const defaultGroupLog: VoxJobGroupLog.Fragment = {
    lastCrafted: '0000-00-00T00:00:00',
    favorite: false,
    timesCrafted: 0,
    jobType: recipeTypeToVoxJob(recipeType),
    jobIdentifier,
    notes: '',
  };
  return defaultGroupLog;
}

export function getItemTypeIcon(itemType: ItemType) {
  switch (itemType) {
    case ItemType.Ammo: {
      return 'icon-category-arrow';
    }
    case ItemType.Armor: {
      return 'icon-category-armor';
    }
    case ItemType.Weapon: {
      return 'icon-category-weapons';
    }
    case ItemType.Block: {
      return 'icon-category-blocks';
    }
    case ItemType.Alloy: {
      return 'icon-category-alloys';
    }
    case ItemType.Substance: {
      return 'icon-category-substances';
    }
    case ItemType.SiegeEngine: {
      return 'icon-category-siege';
    }
    default: {
      return '';
    }
  }
}

export function getAlloyTypeIcon(alloyType: AlloyType) {
  switch (alloyType) {
    case AlloyType.Cloth: {
      return 'icon-category-cloths';
    }
    case AlloyType.Leather: {
      return 'icon-category-leathers';
    }
    case AlloyType.Metal: {
      return 'icon-category-metals';
    }
    case AlloyType.Stone: {
      return 'icon-category-stones';
    }
    case AlloyType.Wood: {
      return 'icon-category-woods';
    }
    default: return '';
  }
}

export function isValidVoxEntityID(voxEntityID: string) {
  if (!voxEntityID) return false;
  if (voxEntityID === '0000000000000000') return false;

  return true;
}

export function isNearbyVox(voxEntityID: string) {
  if (voxEntityID !== '0000000000000000') {
    return true;
  }

  return false;
}

export function getIngredientInfo(recipeData: RecipeData, ingredientDefId: string) {
  if (recipeData && recipeData.def && recipeData.def['ingredients']) {
    return (recipeData.def as MakeRecipeDefRef).ingredients.find(ingredient =>
      ingredient.ingredient.id === ingredientDefId);
  } else {
    return null;
  }
}
