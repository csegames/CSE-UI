/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import { updateItemTooltipCategories } from '../../redux/gameDefsSlice';
import { isDataArray } from './manifestDefService';

export const itemTooltipCategoriesManifestID = 'itemtooltipcategories';

export interface ItemTooltipCategoryDef {
  id: string;
  name: string;
  sortOrder: number;
}

export function processItemTooltipCategories(dispatch: Dispatch, json: any, version: number): void {
  const itemTooltipCategories: Record<string, ItemTooltipCategoryDef> = {};
  if (!isDataArray(json.defs, version, isItemTooltipCategoryData)) {
    console.error('Invalid itemTooltipCategories manifest file');
    return;
  }

  for (const category of json.defs) {
    switch (version) {
      case 1:
        itemTooltipCategories[category.id] = {
          id: category.id,
          sortOrder: category.sortOrder,
          name: category.name
        };
        break;
    }
  }

  dispatch(updateItemTooltipCategories(itemTooltipCategories));
}

function isItemTooltipCategoryData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType = Object.keys(obj).length === 3 && 'id' in obj && 'sortOrder' in obj && 'name' in obj;
      if (!isCorrectType) {
        console.error(`Found invalid ItemTooltipCategory object`, obj);
      }
      return isCorrectType;
    default:
      console.error(`Found invalid ItemTooltipCategory version ${version}`);
      return false;
  }
}
