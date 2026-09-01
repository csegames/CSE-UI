/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import { updateWeaponClasses } from '../../redux/gameDefsSlice';
import { isDataArray } from './manifestDefService';

export const weaponClassManifestID = 'weaponclasses';

export interface WeaponClassDef {
  id: string;
  name: string;
}

export function processWeaponClasses(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isWeaponClassData)) {
    console.error('Invalid WeaponClass manifest file');
    return;
  }

  var classes: Record<string, WeaponClassDef> = {};

  for (const classJson of json.defs) {
    switch (version) {
      case 1:
        const classDef = {
          id: classJson.id,
          name: classJson.name
        };
        classes[classDef.id] = classDef;
        break;
    }
  }

  dispatch(updateWeaponClasses(classes));
}

function isWeaponClassData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType = Object.keys(obj).length === 2 && 'id' in obj && 'name' in obj;
      if (!isCorrectType) {
        console.error(`Found invalid WeaponClass object`, obj);
      }
      return isCorrectType;
    default:
      console.error(`Found invalid WeaponClass version ${version}`);
      return false;
  }
}
