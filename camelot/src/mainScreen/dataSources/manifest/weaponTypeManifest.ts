/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import { updateWeaponTypes } from '../../redux/gameDefsSlice';
import { isDataArray } from './manifestDefService';

export const weaponTypeManifestID = 'weapontypes';

export interface WeaponTypeDef {
  id: string;
  name: string;
}

export function processWeaponTypes(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isWeaponTypeData)) {
    console.error('Invalid WeaponType manifest file');
    return;
  }

  var types: Record<string, WeaponTypeDef> = {};

  for (const typeJson of json.defs) {
    switch (version) {
      case 1:
        const typeDef = {
          id: typeJson.id,
          name: typeJson.name
        };
        types[typeDef.id] = typeDef;
        break;
    }
  }

  dispatch(updateWeaponTypes(types));
}

function isWeaponTypeData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType = Object.keys(obj).length === 2 && 'id' in obj && 'name' in obj;
      if (!isCorrectType) {
        console.error(`Found invalid WeaponType object`, obj);
      }
      return isCorrectType;
    default:
      console.error(`Found invalid WeaponType version ${version}`);
      return false;
  }
}
