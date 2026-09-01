/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import { updateDamageTypes } from '../../redux/gameDefsSlice';
import { isDataArray } from './manifestDefService';

export const damageTypesManifestID = 'damagetypes';

export interface DamageTypeDef {
  id: string;
  numericID: number;
  name: string;
  iconClass: string;
}

export function processDamageTypes(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isDamageTypeData)) {
    console.error('Invalid DamageTypes manifest file');
    return;
  }

  var byStringID: Record<string, DamageTypeDef> = {};
  var byNumericID: Record<number, DamageTypeDef> = {};

  for (const damage of json.defs) {
    switch (version) {
      case 1:
        byStringID[damage.id] = {
          id: damage.id,
          numericID: damage.numericID,
          name: damage.name,
          iconClass: damage.iconClass
        };
        byNumericID[damage.numericID] = byStringID[damage.id];
        break;
    }
  }

  dispatch(updateDamageTypes([byStringID, byNumericID]));
}

function isDamageTypeData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType =
        Object.keys(obj).length === 4 && 'id' in obj && 'numericID' in obj && 'name' in obj && 'iconClass' in obj;
      if (!isCorrectType) {
        console.error(`Found invalid DamageType object`, obj);
      }
      return isCorrectType;
    default:
      console.error(`Found invalid DamageType version ${version}`);
      return false;
  }
}
