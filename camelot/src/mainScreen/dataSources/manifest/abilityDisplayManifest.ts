/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import { isDataArray } from './manifestDefService';
import { updateAbilityDisplayDefs } from '../../redux/gameDefsSlice';

export const abilityDisplayManifestID = 'abilitydisplay';

export interface AbilityDisplayDef {
  id: string;
  numericID: number;
  name: string;
  iconURL: string;
  description: string;
  networkID: string;
  tags: string[];
}

export function processAbilityDisplays(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isAbilityDisplayData)) {
    console.error('Invalid AbilityDisplay manifest file');
    return;
  }

  var abilitiesByStringID: Record<string, AbilityDisplayDef> = {};
  var abilitiesByNumericID: Record<number, AbilityDisplayDef> = {};

  for (const ability of json.defs) {
    switch (version) {
      case 1:
        abilitiesByStringID[ability.id] = {
          id: ability.id,
          numericID: Number(ability.numericID),
          name: ability.name,
          description: ability.description,
          iconURL: ability.iconURL,
          networkID: ability.networkID,
          tags: []
        };
        abilitiesByNumericID[ability.numericID] = abilitiesByStringID[ability.id];
        break;
      case 2:
        abilitiesByStringID[ability.id] = {
          id: ability.id,
          numericID: Number(ability.numericID),
          name: ability.name,
          description: ability.description,
          iconURL: ability.iconURL,
          networkID: ability.networkID,
          tags: ability.tags as string[]
        };
        abilitiesByNumericID[ability.numericID] = abilitiesByStringID[ability.id];
        break;
    }
  }

  dispatch(
    updateAbilityDisplayDefs({
      abilityDisplayDefsByStringID: abilitiesByStringID,
      abilityDisplayDefsByNumericID: abilitiesByNumericID
    })
  );
}

function isAbilityDisplayData(obj: any, version: number): boolean {
  const numCommonFields = 6;
  const hasCommonFields =
    'id' in obj &&
    'numericID' in obj &&
    'name' in obj &&
    'description' in obj &&
    'iconURL' in obj &&
    'networkID' in obj;

  switch (version) {
    case 1:
      // V1-only fields.
      const numV1Fields = 0;
      const hasV1Fields = true;

      const hasAllV1Fields =
        Object.keys(obj).length === numCommonFields + numV1Fields && hasCommonFields && hasV1Fields;
      if (!hasAllV1Fields) {
        console.error(`Found invalid AbilityDisplay object`, obj);
      }
      return hasAllV1Fields;
    case 2:
      // V2-only fields
      const numV2Fields = 1;
      const hasV2Fields = Array.isArray(obj.tags) && obj.tags.every((t: any) => typeof t === 'string');

      const hasAllV2Fields =
        Object.keys(obj).length === numCommonFields + numV2Fields && hasCommonFields && hasV2Fields;
      if (!hasAllV2Fields) {
        console.error(`Found invalid AbilityDisplay object`, obj);
      }
      return hasAllV2Fields;
    default:
      console.error(`Found invalid AbilityDisplay version ${version}`);
      return false;
  }
}
