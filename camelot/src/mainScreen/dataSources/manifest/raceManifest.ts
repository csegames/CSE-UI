/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Faction } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { Dispatch } from '@reduxjs/toolkit';
import { updateRaces } from '../../redux/gameDefsSlice';
import { isDataArray } from './manifestDefService';

export const racesManifestID = 'races';

export interface RaceDef {
  id: string;
  numericID: number;
  name: string;
  description: string;
  playerCreatable: boolean;
  factionID: Faction;
  tags: string[];
  baseStatOffsets: Record<string, number>;
}

export function processRaces(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isRaceData)) {
    console.error('Invalid Race manifest file');
    return;
  }

  var racesByStringID: Record<string, RaceDef> = {};
  var racesByNumericID: Record<number, RaceDef> = {};

  for (const resource of json.defs) {
    switch (version) {
      case 1:
        const raceDefV1 = {
          id: resource.id,
          numericID: resource.numericID,
          name: resource.name,
          description: resource.description,
          playerCreatable: resource.playerCreatable,
          factionID: resource.factionID,
          tags: resource.tags,
          baseStatOffsets: {}
        };
        racesByStringID[raceDefV1.id] = raceDefV1;
        racesByNumericID[raceDefV1.numericID] = raceDefV1;
        break;
      case 2:
        const raceDefV2 = {
          id: resource.id,
          numericID: resource.numericID,
          name: resource.name,
          description: resource.description,
          playerCreatable: resource.playerCreatable,
          factionID: resource.factionID,
          tags: resource.tags,
          baseStatOffsets: resource.baseStatOffsets
        };
        racesByStringID[raceDefV2.id] = raceDefV2;
        racesByNumericID[raceDefV2.numericID] = raceDefV2;
        break;
    }
  }

  dispatch(updateRaces([racesByStringID, racesByNumericID]));
}

function isRaceData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectV1Type =
        Object.keys(obj).length === 7 &&
        'id' in obj &&
        'numericID' in obj &&
        'name' in obj &&
        'description' in obj &&
        'playerCreatable' in obj &&
        'factionID' in obj &&
        'tags' in obj;
      if (!isCorrectV1Type) {
        console.error(`Found invalid Race object`, obj);
      }
      return isCorrectV1Type;
    case 2:
      const isCorrectV2Type =
        Object.keys(obj).length === 8 &&
        'id' in obj &&
        'numericID' in obj &&
        'name' in obj &&
        'description' in obj &&
        'playerCreatable' in obj &&
        'factionID' in obj &&
        'tags' in obj &&
        'baseStatOffsets' in obj;
      if (!isCorrectV2Type) {
        console.error(`Found invalid Race object`, obj);
      }
      return isCorrectV2Type;
    default:
      console.error(`Found invalid Race version ${version}`);
      return false;
  }
}
