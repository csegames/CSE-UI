/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Dispatch } from '@reduxjs/toolkit';
import { updateGameModes } from '../../redux/matchSlice';
import { isDataArray } from './manifestDefService';

export const gameModeManifestID = 'gamemodes';

export interface GameModeDef {
  id: string;
  name: string;
  description: string;
  bannerImage: string;
  cardImage: string;
}

export function processGameModes(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isGameModeData)) {
    console.error('Invalid gamemodes manifest file');
    return;
  }

  const factions: Dictionary<GameModeDef> = {};
  for (const faction of json.defs) {
    factions[faction.id] = faction;
  }

  dispatch(updateGameModes(factions));
}

function isGameModeData(obj: any, version: number): obj is GameModeDef {
  switch (version) {
    case 1:
      const isCorrectType =
        Object.keys(obj).length === 5 &&
        'id' in obj &&
        'name' in obj &&
        'description' in obj &&
        'bannerImage' in obj &&
        'cardImage' in obj;

      if (!isCorrectType) {
        console.error(`Found invalid GameMode object`, obj);
      }
      return isCorrectType;
    default:
      console.error(`Found invalid GameMode version ${version}`);
      return;
  }
}
