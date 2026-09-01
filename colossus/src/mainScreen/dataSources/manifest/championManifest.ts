/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary, Dispatch } from '@reduxjs/toolkit';
import { isDataArray } from './manifestDefService';
import { updateChampions } from '../../redux/championInfoSlice';

export const championManifestID = 'champions';

export interface ChampionAbility {
  name: string;
  description: string;
  iconClass: string;
}

export interface ChampionDef {
  id: string;
  name: string;
  description: string;
  uiColor: number;
  championSelectSound: number;
  questID: string;
  sortOrder: number;
  runeModUnlockCurrencyID: string;
  progressionCurrencyID: string;
  abilities: ChampionAbility[];
}

export function processChampions(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isChampionData)) {
    console.error('Invalid Champion manifest file');
    return;
  }

  var champions: ChampionDef[] = [];
  var championsByID: Dictionary<ChampionDef> = {};

  for (const champion of json.defs) {
    switch (version) {
      case 1:
        championsByID[champion.id] = {
          id: champion.id,
          name: champion.name,
          description: champion.description,
          uiColor: champion.uiColor,
          championSelectSound: Number(champion.championSelectSound),
          questID: champion.questID,
          sortOrder: champion.sortOrder,
          runeModUnlockCurrencyID: champion.runeModUnlockCurrencyID,
          progressionCurrencyID: champion.progressionCurrencyID,
          abilities: champion.abilities
        };
        champions.push(championsByID[champion.id]);
        break;
    }
  }

  dispatch(updateChampions({ champions: champions, championIDToChampion: championsByID }));
}

function isChampionData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType =
        Object.keys(obj).length === 10 &&
        'id' in obj &&
        'name' in obj &&
        'description' in obj &&
        'uiColor' in obj &&
        'championSelectSound' in obj &&
        'questID' in obj &&
        'sortOrder' in obj &&
        'runeModUnlockCurrencyID' in obj &&
        'progressionCurrencyID' in obj &&
        'abilities' in obj;
      if (!isCorrectType) {
        console.error(`Found invalid Champion object`, obj);
      } else if (!Array.isArray(obj.abilities)) {
        console.error(`Found invalid Abilities array in Champion object`, obj);
        return false;
      } else {
        for (const ability of obj.abilities) {
          const abilityCorrectType =
            Object.keys(ability).length === 3 &&
            'name' in ability &&
            'description' in ability &&
            'iconClass' in ability;
          if (!abilityCorrectType) {
            console.error(`Found invalid Champion ability object`, ability);
            return false;
          }
        }
      }
      return isCorrectType;
    default:
      console.error(`Found invalid Champion version ${version}`);
      return false;
  }
}
