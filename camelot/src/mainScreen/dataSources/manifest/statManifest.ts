/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { StatType } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { Dispatch } from '@reduxjs/toolkit';
import { updateStats } from '../../redux/gameDefsSlice';
import { isDataArray } from './manifestDefService';

export const statsManifestID = 'stats';

export interface StatDef {
  id: string;
  numericID: number;
  name: string;
  description: string;
  statType: StatType;
  showAtCharacterCreation: boolean;
  addPointsAtCharacterCreation: boolean;
  operation: string;
  itemRequirementStatID: string;
  tags: string[];
}

export function processStats(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isStatsData)) {
    console.error('Invalid Stats manifest file');
    return;
  }

  var statsByStringID: Record<string, StatDef> = {};
  var statsByNumericID: Record<number, StatDef> = {};

  for (const stat of json.defs) {
    switch (version) {
      case 2: {
        const def: StatDef = {
          id: stat.id,
          numericID: stat.numericID,
          name: stat.name,
          description: stat.description,
          statType: stat.statType,
          showAtCharacterCreation: stat.showAtCharacterCreation,
          addPointsAtCharacterCreation: stat.addPointsAtCharacterCreation,
          operation: stat.operation,
          itemRequirementStatID: stat.itemRequirementStatID,
          tags: stat.tags
        };
        statsByStringID[def.id] = def;
        statsByNumericID[def.numericID] = def;
        break;
      }
    }
  }

  dispatch(updateStats([statsByStringID, statsByNumericID]));
}

function isStatsData(obj: any, version: number): boolean {
  switch (version) {
    case 2:
      const isCorrectType =
        Object.keys(obj).length === 10 &&
        'id' in obj &&
        'numericID' in obj &&
        'name' in obj &&
        'description' in obj &&
        'statType' in obj &&
        'showAtCharacterCreation' in obj &&
        'addPointsAtCharacterCreation' in obj &&
        'operation' in obj &&
        'itemRequirementStatID' in obj &&
        'tags' in obj;
      if (!isCorrectType) {
        console.error(`Found invalid Stats object`, obj);
      }
      return isCorrectType;
    default:
      console.error(`Found invalid Stats version ${version}`);
      return false;
  }
}
