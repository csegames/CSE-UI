/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import { isDataArray } from './manifestDefService';
import { updateQuestDefs } from '../../redux/gameDefsSlice';

// On the server side, this matches with NeoQuestDefManifest.cs.

export const questDefManifestID = 'quests';

export interface AmountEntry {
  id: string;
  amount: number;
}

export interface QuestDef {
  id: string;
  name: string;
  description: string;
  tags: string[];
  targets: AmountEntry[];
  rewards: AmountEntry[];
}

export function processQuestDefs(dispatch: Dispatch, json: any, version: number): void {
  const questDefs: Record<string, QuestDef> = {};

  if (!isDataArray(json.defs, version, isQuestDefData)) {
    console.error('Invalid questDefs manifest file');
    return;
  }

  for (const quest of json.defs) {
    switch (version) {
      case 1:
        const def: QuestDef = {
          id: quest.id,
          description: quest.description,
          name: quest.name,
          rewards: quest.rewards,
          tags: quest.tags,
          targets: quest.targets
        };
        questDefs[quest.id] = def;
        break;
    }
  }

  dispatch(updateQuestDefs(questDefs));
}

function isQuestDefData(obj: any, version: number): obj is QuestDef {
  switch (version) {
    case 1:
      const isCorrectType =
        Object.keys(obj).length === 6 &&
        'id' in obj &&
        'description' in obj &&
        'name' in obj &&
        'rewards' in obj &&
        'tags' in obj &&
        'targets' in obj;

      if (!isCorrectType) {
        console.error(`Found invalid QuestDef object`, obj);
        return false;
      }
      return isCorrectType;
    default:
      console.error(`Found invalid QuestDef version ${version}`);
      return false;
  }
}
