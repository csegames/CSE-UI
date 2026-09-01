/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import { updateArmorCategories } from '../../redux/gameDefsSlice';
import { isDataArray } from './manifestDefService';

export const armorCategoryManifestID = 'armorcategories';

export interface ArmorCategoryDef {
  id: string;
  name: string;
}

export function processArmorCategories(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isArmorCategoryData)) {
    console.error('Invalid ArmorCategory manifest file');
    return;
  }

  var categories: Record<string, ArmorCategoryDef> = {};

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

  dispatch(updateArmorCategories(categories));
}

function isArmorCategoryData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType = Object.keys(obj).length === 2 && 'id' in obj && 'name' in obj;
      if (!isCorrectType) {
        console.error(`Found invalid ArmorCategory object`, obj);
      }
      return isCorrectType;
    default:
      console.error(`Found invalid ArmorCategory version ${version}`);
      return false;
  }
}
