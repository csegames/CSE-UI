/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary, Dispatch } from '@reduxjs/toolkit';
import { isDataArray } from './manifestDefService';
import { CostDefGQL, PerkRewardDefGQL, ProfileLockDefGQL } from '@csegames/library/dist/hordetest/graphql/schema';
import { updateProgressionNodes } from '../../redux/championInfoSlice';

export const progressionNodeManifestID = 'progressionnodes';

export interface ProgressionNodeDef {
  id: string;
  name: string;
  icon: string;
  championID: string;
  positionX: number;
  positionY: number;
  childrenIDs: string[];
  parentIDs: string[];
  locks: ProfileLockDefGQL[];
  costs: CostDefGQL[];
  rewards: PerkRewardDefGQL[];
}

export function processProgressionNodes(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isProgressionNodeData)) {
    console.error('Invalid ProgressionNode manifest file');
    return;
  }

  var progressionNodeDefsByID: Dictionary<ProgressionNodeDef> = {};
  var progressionNodeDefsByChampionID: Dictionary<ProgressionNodeDef[]> = {};

  for (const node of json.defs) {
    switch (version) {
      case 1:
        progressionNodeDefsByID[node.id] = {
          id: node.id,
          name: node.name,
          icon: node.iconClass,
          championID: node.championID,
          positionX: node.positionX,
          positionY: node.positionY,
          childrenIDs: node.positionY,
          parentIDs: node.parentIDs,
          locks: node.locks,
          costs: node.costs,
          rewards: node.rewards
        };

        if (!progressionNodeDefsByChampionID[node.championID]) {
          progressionNodeDefsByChampionID[node.championID] = [];
        }
        progressionNodeDefsByChampionID[node.championID].push(node);
        break;
    }
  }

  dispatch(
    updateProgressionNodes({
      progressionNodeDefsByID: progressionNodeDefsByID,
      progressionNodeDefsByChampionID: progressionNodeDefsByChampionID
    })
  );
}

function isProgressionNodeData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType =
        Object.keys(obj).length === 11 &&
        'id' in obj &&
        'icon' in obj &&
        'championID' in obj &&
        'positionX' in obj &&
        'positionY' in obj &&
        'childrenIDs' in obj &&
        'parentIDs' in obj &&
        'locks' in obj &&
        'costs' in obj &&
        'rewards' in obj;

      if (!isCorrectType) {
        console.error(`Found invalid ProgressionNode object`, obj);
        return false;
      } else if (!Array.isArray(obj.childrenIDs)) {
        console.error(`Found invalid childrenIDs array in ProgressionNode object`, obj);
        return false;
      } else if (!Array.isArray(obj.parentIDs)) {
        console.error(`Found invalid parentIDs array in ProgressionNode object`, obj);
        return false;
      } else if (!Array.isArray(obj.locks)) {
        console.error(`Found invalid locks array in ProgressionNode object`, obj);
        return false;
      } else if (!Array.isArray(obj.costs)) {
        console.error(`Found invalid costs array in ProgressionNode object`, obj);
        return false;
      } else if (!Array.isArray(obj.rewards)) {
        console.error(`Found invalid rewards array in ProgressionNode object`, obj);
        return false;
      }

      for (const reward of obj.rewards) {
        if (!isRewardData(reward, version)) {
          console.error(`Found invalid quest.link.rewards object`, reward);
          return false;
        }
      }

      for (const lock of obj.locks) {
        if (!isLockData(lock, version)) {
          console.error(`Found invalid quest.link.lock object`, lock);
          return false;
        }
      }

      for (const cost of obj.costs) {
        if (!isCostData(cost, version)) {
          console.error(`Found invalid quest.link.costs object`, cost);
          return false;
        }
      }

      return isCorrectType;
    default:
      console.error(`Found invalid ProgressionNode version ${version}`);
      return false;
  }
}

function isCostData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      return Object.keys(obj).length === 2 && 'perkID' in obj && 'qty' in obj;
    default:
      console.error(`Found invalid node cost version ${version}`);
      return false;
  }
}

function isLockData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType =
        Object.keys(obj).length === 7 &&
        'endTime' in obj &&
        'invertConditions' in obj &&
        'perkID' in obj &&
        'progressionNodeID' in obj &&
        'questID' in obj &&
        'questLevel' in obj &&
        'startTime' in obj;
      if (!isCorrectType) {
        console.error(`Found invalid node Lock object`, obj);
      }

      return isCorrectType;
    default:
      console.error(`Found invalid node Lock version ${version}`);
      return false;
  }
}

function isRewardData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      return Object.keys(obj).length === 2 && 'perkID' in obj && 'qty' in obj;
    default:
      console.error(`Found invalid node reward version ${version}`);
      return false;
  }
}
