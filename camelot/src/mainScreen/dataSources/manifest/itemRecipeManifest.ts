/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Dispatch } from '@reduxjs/toolkit';
import { updateItemRecipes } from '../../redux/gameDefsSlice';
import { isDataArray } from './manifestDefService';

export const itemRecipeManifestID = 'itemrecipes';

// Matches to `RequirementKind` enum in `RequirementDef.cs`.
export enum RequirementKind {
  Invalid = 'Invalid',
  ItemID = 'ItemID',
  ItemStat = 'ItemStat',
  Stat = 'Stat',
  Tags = 'Tags'
}

export enum RequirementTagsMode {
  All = 'All',
  Any = 'Any',
  None = 'None'
}

export interface RequirementDataBase {
  Kind: RequirementKind;
}

export interface RequirementDataInvalid extends RequirementDataBase {
  Kind: RequirementKind.Invalid;
}

export interface RequirementDataItemID extends RequirementDataBase {
  Kind: RequirementKind.ItemID;
  // The ID of the itemdef in question.
  ItemDef: string;
}

export interface RequirementDataItemStat extends RequirementDataBase {
  Kind: RequirementKind.ItemStat;
  /** The ID of the stat in question. */
  Stat: string;
  MinVal: number;
}

export interface RequirementDataStat extends RequirementDataBase {
  Kind: RequirementKind.Stat;
  /** The ID of the stat in question. */
  Stat: string;
  MinVal: number;
}

export interface RequirementDataTags extends RequirementDataBase {
  Kind: RequirementKind.Tags;
  Tags: string[];
  Mode: RequirementTagsMode;
}

export type AnyRequirementData =
  | RequirementDataInvalid
  | RequirementDataItemID
  | RequirementDataItemStat
  | RequirementDataStat
  | RequirementDataTags;

// See ItemRecipeDefManifest.cs ItemRecipe
export interface ItemRecipeDef {
  id: string;
  name: string;
  tags: string[];
  outputItemDefID: string;
  ingredients: RecipeIngredient[];
  jobID: string;
  requirements: AnyRequirementData[];
}

// See ItemRecipeDefManifest.cs Ingredient
export interface RecipeIngredient {
  itemDefID: string;
  requirements: AnyRequirementData[];
  slot: number;
  quantity: number;
  minQuality: number;
  maxQuality: number;
  isOptional: boolean;
}

export function processItemRecipes(dispatch: Dispatch, json: any, version: number): void {
  const itemRecipes: Record<string, ItemRecipeDef> = {};

  if (!isDataArray(json.defs, version, isItemRecipesData)) {
    console.error('Invalid itemRecipes manifest file');
    return;
  }

  for (const itemRecipe of json.defs) {
    switch (version) {
      case 2:
        itemRecipes[itemRecipe.id] = {
          id: itemRecipe.id,
          tags: [],
          name: itemRecipe.name,
          outputItemDefID: itemRecipe.outputItemDefID,
          ingredients: itemRecipe.ingredients,
          jobID: itemRecipe.jobID,
          requirements: itemRecipe.requirements // Recipe-level requirements such as faction or min skill level will be included here
        };
      case 3:
        itemRecipes[itemRecipe.id] = {
          id: itemRecipe.id,
          name: itemRecipe.name,
          tags: itemRecipe.tags,
          outputItemDefID: itemRecipe.outputItemDefID,
          ingredients: itemRecipe.ingredients.map((raw: any) => {
            return { ...raw, requirements: raw.requirements.map((json: string) => JSON.parse(json)) };
          }),
          jobID: itemRecipe.jobID,
          requirements: itemRecipe.requirements.map((json: string) => JSON.parse(json)) // Recipe-level requirements such as faction or min skill level will be included here
        };
    }
  }

  dispatch(updateItemRecipes(itemRecipes));
}

function isItemRecipesData(obj: any, version: number): boolean {
  switch (version) {
    case 2:
      const isCorrectType2 =
        Object.keys(obj).length === 6 &&
        'id' in obj &&
        'name' in obj &&
        'outputItemDefID' in obj &&
        'ingredients' in obj &&
        'jobID' in obj &&
        'requirements' in obj;

      if (!isCorrectType2) {
        console.error(`Found invalid ItemRecipe object for v2`, obj);
      }
      return isCorrectType2;
    case 3:
      const isCorrectType3 =
        Object.keys(obj).length === 7 &&
        'id' in obj &&
        'name' in obj &&
        'tags' in obj &&
        'outputItemDefID' in obj &&
        'ingredients' in obj &&
        'jobID' in obj &&
        'requirements' in obj;

      if (!isCorrectType3) {
        console.error(`Found invalid ItemRecipe object for v3`, obj);
      }
      return isCorrectType3;
    default:
      console.error(`Found invalid ItemRecipe version ${version}`);
      return false;
  }
}
