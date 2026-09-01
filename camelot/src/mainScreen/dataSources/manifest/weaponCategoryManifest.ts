/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import { updateWeaponCategories } from '../../redux/gameDefsSlice';
import { isDataArray } from './manifestDefService';

export const weaponCategoryManifestID = 'weaponcategories';

export interface WeaponCategoryDef {
  id: string;
  name: string;
}

export function processWeaponCategories(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isWeaponCategoryData)) {
    console.error('Invalid WeaponCategory manifest file');
    return;
  }

  var categories: Record<string, WeaponCategoryDef> = {};

  for (const categoryJson of json.defs) {
    switch (version) {
      case 1:
        const categoryDef = {
          id: categoryJson.id,
          name: categoryJson.name
        };
        categories[categoryDef.id] = categoryDef;
        break;
    }
  }

  dispatch(updateWeaponCategories(categories));
}

function isWeaponCategoryData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType = Object.keys(obj).length === 2 && 'id' in obj && 'name' in obj;
      if (!isCorrectType) {
        console.error(`Found invalid WeaponCategory object`, obj);
      }
      return isCorrectType;
    default:
      console.error(`Found invalid WeaponCategory version ${version}`);
      return false;
  }
}
