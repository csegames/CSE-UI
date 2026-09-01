/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import { updateStatLoadouts } from '../../redux/gameDefsSlice';
import { isDataArray } from './manifestDefService';

export const statLoadoutManifestID = 'statloadouts';

export interface StatAllocationDef {
  statID: string;
  min: number;
  max: number;
}

export interface StatLoadoutDef {
  id: string;
  name: string;
  description: string;
  iconURL: string;
  freePoints: number;
  stats: StatAllocationDef[];
}

export function processStatLoadouts(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isStatLoadoutData)) {
    console.error('Invalid StatLoadout manifest file');
    return;
  }

  var statLoadouts: Record<string, StatLoadoutDef> = {};

  for (const statLoadoutJson of json.defs) {
    switch (version) {
      case 1:
        var stats: StatAllocationDef[] = [];
        for (const stat of statLoadoutJson.stats) {
          stats.push({
            statID: stat.statID,
            min: stat.Amount,
            max: stat.Amount
          });
        }
        const statLoadoutDefV1 = {
          id: statLoadoutJson.id,
          name: statLoadoutJson.name,
          description: statLoadoutJson.description,
          iconURL: statLoadoutJson.iconURL,
          freePoints: 0,
          stats: stats
        };
        statLoadouts[statLoadoutDefV1.id] = statLoadoutDefV1;
        break;
      case 2:
        const statLoadoutDefV2 = {
          id: statLoadoutJson.id,
          name: statLoadoutJson.name,
          description: statLoadoutJson.description,
          iconURL: statLoadoutJson.iconURL,
          freePoints: statLoadoutJson.freePoints,
          stats: statLoadoutJson.stats
        };
        statLoadouts[statLoadoutDefV2.id] = statLoadoutDefV2;
        break;
    }
  }

  dispatch(updateStatLoadouts(statLoadouts));
}

function isStatLoadoutData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectV1Type =
        Object.keys(obj).length === 5 &&
        'id' in obj &&
        'name' in obj &&
        'description' in obj &&
        'iconURL' in obj &&
        'stats' in obj;
      if (!isCorrectV1Type || !Array.isArray(obj.stats)) {
        console.error(`Found invalid StatLoadout object`, obj);
      } else {
        for (const stat of obj.stats) {
          const statCorrectType = Object.keys(stat).length === 2 && 'statID' in stat && 'amount' in stat;
          if (!statCorrectType) {
            console.error(`Found invalid StatLoadout stats object`, stat);
            return false;
          }
        }
      }
      return isCorrectV1Type;
    case 2:
      const isCorrectV2Type =
        Object.keys(obj).length === 6 &&
        'id' in obj &&
        'name' in obj &&
        'description' in obj &&
        'iconURL' in obj &&
        'freePoints' in obj &&
        'stats' in obj;
      if (!isCorrectV2Type || !Array.isArray(obj.stats)) {
        console.error(`Found invalid StatLoadout object`, obj);
      } else {
        for (const stat of obj.stats) {
          const statCorrectType = Object.keys(stat).length === 3 && 'statID' in stat && 'min' in stat && 'max' in stat;
          if (!statCorrectType) {
            console.error(`Found invalid StatLoadout stats object`, stat);
            return false;
          }
        }
      }
      return isCorrectV2Type;
    default:
      console.error(`Found invalid StatLoadout version ${version}`);
      return false;
  }
}
