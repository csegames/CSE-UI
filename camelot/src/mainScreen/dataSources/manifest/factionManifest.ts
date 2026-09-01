/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Faction } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { Dispatch } from '@reduxjs/toolkit';
import { updateFactions } from '../../redux/gameDefsSlice';
import { isDataArray } from './manifestDefService';

export const factionManifestID = 'factions';

export interface FactionDef {
  id: Faction;
  description: string;
  name: string;
}

export function processFactions(dispatch: Dispatch, json: any, version: number): void {
  const factions: Record<string, FactionDef> = {};
  if (!isDataArray(json.defs, version, isFactionData)) {
    console.error('Invalid factions manifest file');
    return;
  }

  for (const faction of json.defs) {
    switch (version) {
      case 1:
        factions[faction.id] = {
          id: faction.id,
          description: faction.description,
          name: faction.name
        };
    }
  }

  dispatch(updateFactions(factions));
}

function isFactionData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType = Object.keys(obj).length === 3 && 'id' in obj && 'description' in obj && 'name' in obj;
      if (!isCorrectType) {
        console.error(`Found invalid Faction object`, obj);
      }
      return isCorrectType;
    default:
      console.error(`Found invalid Faction version ${version}`);
      return false;
  }
}
