/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary, Dispatch } from '@reduxjs/toolkit';
import { isDataArray } from './manifestDefService';
import { updateStatDefs } from '../../redux/gameSlice';

export const statsManifestID = 'stats';

// Keep in sync with StatDisplayType.cs
export enum StatDisplayType {
  Value = 'Value',
  Percent = 'Percent',
  IconOnly = 'IconOnly'
}

export interface StatDef {
  id: string;
  numericID: number;
  name: string;
  description: string;
  displayType: StatDisplayType;
}

export function processStats(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isStatsData)) {
    console.error('Invalid Stats manifest file');
    return;
  }

  var stats: Dictionary<StatDef> = {};

  for (const stat of json.defs) {
    switch (version) {
      case 1:
        stats[stat.id] = {
          id: stat.id,
          numericID: stat.numericID,
          name: stat.name,
          description: stat.description,
          displayType: stat.displayType
        };
        break;
    }
  }

  dispatch(updateStatDefs(stats));
}

function isStatsData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType =
        Object.keys(obj).length === 5 &&
        'id' in obj &&
        'numericID' in obj &&
        'name' in obj &&
        'description' in obj &&
        'displayType' in obj;
      if (!isCorrectType) {
        console.error(`Found invalid Stats object`, obj);
      }
      return isCorrectType;
    default:
      console.error(`Found invalid Stats version ${version}`);
      return false;
  }
}
