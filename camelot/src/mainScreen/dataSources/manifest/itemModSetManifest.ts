/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import { updateItemModSets } from '../../redux/gameDefsSlice';
import { isDataArray } from './manifestDefService';

export const itemModSetManifestID = 'itemmodsets';

export interface ItemModSetDef {
  id: string;
  numericID: number;

  name: string;
  effectDescriptions: string[];
}

export function processItemModSets(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isItemModData)) {
    console.error('Invalid ItemModSet manifest file');
    return;
  }

  var byStringID: Record<string, ItemModSetDef> = {};
  var byNumericID: Record<number, ItemModSetDef> = {};

  for (const modSetJson of json.defs) {
    switch (version) {
      case 1:
        byStringID[modSetJson.id] = {
          id: modSetJson.id,
          numericID: modSetJson.numericID,
          name: modSetJson.name,
          effectDescriptions: modSetJson.effectDescriptions
        };

        byNumericID[modSetJson.numericID] = byStringID[modSetJson.id];
        break;
    }
  }

  dispatch(updateItemModSets({ itemModSetsByNumericID: byNumericID, itemModSetsByStringID: byStringID }));
}

function isItemModData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType =
        Object.keys(obj).length === 4 &&
        'id' in obj &&
        'numericID' in obj &&
        'name' in obj &&
        'effectDescriptions' in obj;

      if (!isCorrectType) {
        console.error(`Found invalid ItemMod object definition`, JSON.stringify(obj));
      }
      return isCorrectType;
    default:
      console.error(`Found invalid ItemMod data version ${version}`);
      return false;
  }
}
