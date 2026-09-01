/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import { updateIngredientEffects } from '../../redux/gameDefsSlice';
import { isDataArray } from './manifestDefService';

export const ingredientEffectManifestID = 'ingredienteffects';

export interface IngredientEffectDef {
  id: string;
  numericID: number;

  name: string;
  grantedItemModDefIDs: string[];
  grantedIngredientEffectDefIDs: string[];
}

export function processIngredientEffects(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isIngredientEffectData)) {
    console.error('Invalid IngredientEffect manifest file');
    return;
  }

  var byStringID: Record<string, IngredientEffectDef> = {};
  var byNumericID: Record<number, IngredientEffectDef> = {};

  for (const ingredientEffectJson of json.defs) {
    switch (version) {
      case 1:
        byStringID[ingredientEffectJson.id] = {
          id: ingredientEffectJson.id,
          numericID: ingredientEffectJson.numericID,
          name: ingredientEffectJson.name,
          grantedItemModDefIDs: ingredientEffectJson.grantedItemModIDs,
          grantedIngredientEffectDefIDs: ingredientEffectJson.grantedIngredientEffectIDs
        };

        byNumericID[ingredientEffectJson.numericID] = byStringID[ingredientEffectJson.id];
        break;
    }
  }

  dispatch(
    updateIngredientEffects({ ingredientEffectsByNumericID: byNumericID, ingredientEffectsByStringID: byStringID })
  );
}

function isIngredientEffectData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType =
        Object.keys(obj).length === 5 &&
        'id' in obj &&
        'numericID' in obj &&
        'name' in obj &&
        'grantedItemModDefIDs' in obj &&
        'grantedIngredientEffectDefIDs' in obj;

      if (!isCorrectType) {
        console.error(`Found invalid IngredientEffect object definition`, JSON.stringify(obj));
      }
      return isCorrectType;
    default:
      console.error(`Found invalid ItemMod data version ${version}`);
      return false;
  }
}
