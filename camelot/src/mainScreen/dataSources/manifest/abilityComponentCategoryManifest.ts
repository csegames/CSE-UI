/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary, Dispatch } from '@reduxjs/toolkit';
import { updateAbilityComponentCategories } from '../../redux/gameDefsSlice';
import { isDataArray } from './manifestDefService';

export const abilityComponentCategoriesManifestID = 'abilitycomponentcategories';

// keep in sync with AbilityComponentCategoryDef.cs
export enum AbilityComponentCategoryDisplay {
  Invalid = 'Invalid',
  Standard = 'Standard',
  Option = 'Option'
}

export interface AbilityComponentCategoryDef {
  id: string;
  name: string;
  description: string;
  iconURL: string;
  isPrimary: boolean;
  isRequired: boolean;
  displayOption: AbilityComponentCategoryDisplay;
}

export function processAbilityComponentCategories(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isAbilityComponentCategoryData)) {
    console.error('Invalid AbilityComponentCategories manifest file');
    return;
  }

  var categories: Dictionary<AbilityComponentCategoryDef> = {};

  for (const category of json.defs) {
    switch (version) {
      case 1:
        categories[category.id] = {
          id: category.id,
          name: category.name,
          description: category.description,
          iconURL: category.iconURL,
          isPrimary: category.isPrimary,
          isRequired: category.isRequired,
          displayOption: category.displayOption
        };
        break;
    }
  }

  dispatch(updateAbilityComponentCategories(categories));
}

function isAbilityComponentCategoryData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType =
        Object.keys(obj).length === 7 &&
        'id' in obj &&
        'name' in obj &&
        'description' in obj &&
        'iconURL' in obj &&
        'isPrimary' in obj &&
        'isRequired' in obj &&
        'displayOption' in obj;
      if (!isCorrectType) {
        console.error(`Found invalid AbilityComponentCategory object`, obj);
      }
      return isCorrectType;
    default:
      console.error(`Found invalid AbilityComponentCategory version ${version}`);
      return false;
  }
}
