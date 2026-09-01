/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary, Dispatch } from '@reduxjs/toolkit';
import { isDataArray } from './manifestDefService';
import { updateAbilityDisplayDefs } from '../../redux/gameSlice';

export const abilityDisplayManifestID = 'abilitydisplay';

export interface AbilityDisplayDef {
  id: string;
  numericID: number;
  name: string;
  iconClass: string;
  description: string;
  entityResourceID: number;
}

export function processAbilityDisplays(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isAbilityDisplayData)) {
    console.error('Invalid AbilityDisplay manifest file');
    return;
  }

  var abilitiesByID: Dictionary<AbilityDisplayDef> = {};
  var abilitiesByNumericID: Dictionary<AbilityDisplayDef> = {};

  for (const ability of json.defs) {
    switch (version) {
      case 1:
        abilitiesByID[ability.id] = {
          id: ability.id,
          numericID: Number(ability.numericID),
          name: ability.name,
          description: ability.description,
          iconClass: ability.iconClass,
          entityResourceID: ability.entityResourceID
        };
        abilitiesByNumericID[ability.numericID] = abilitiesByID[ability.id];
        break;
    }
  }

  dispatch(updateAbilityDisplayDefs(abilitiesByID, abilitiesByNumericID));
}

function isAbilityDisplayData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType =
        Object.keys(obj).length === 6 &&
        'id' in obj &&
        'numericID' in obj &&
        'name' in obj &&
        'description' in obj &&
        'iconClass' in obj &&
        'entityResourceID' in obj;
      if (!isCorrectType) {
        console.error(`Found invalid AbilityDisplay object`, obj);
      }
      return isCorrectType;
    default:
      console.error(`Found invalid AbilityDisplay version ${version}`);
      return false;
  }
}
