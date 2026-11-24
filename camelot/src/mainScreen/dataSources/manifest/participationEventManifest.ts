/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import { isDataArray } from './manifestDefService';
import { updateParticipationEvents } from '../../redux/gameDefsSlice';

// On the server side, this matches with ParticipationEventDefManifest.cs.

export const participationEventManifestID = 'participationevents';

export interface ParticipationEventDef {
  id: string;
  numericID: number,
  tags: string[];
  coefficient: number;
  descriptionStringKey: string;
}

export function processParticipationEvents(dispatch: Dispatch, json: any, version: number): void {
  const participationEventsByStringID: Record<string, ParticipationEventDef> = {};
  const participationEventsByNumericID: Record<number, ParticipationEventDef> = {};

  if (!isDataArray(json.defs, version, isParticipationEventDefData)) {
    console.error('Invalid participationEventDefs manifest file');
    return;
  }

  for (const participationEvent of json.defs) {
    switch (version) {
      case 1:
        const def: ParticipationEventDef = {
          id: participationEvent.id,
          numericID: participationEvent.numericID,
          tags: participationEvent.tags,
          coefficient: participationEvent.coefficient,
          descriptionStringKey: participationEvent.descriptionStringKey
        };
        participationEventsByStringID[def.id] = def;
        participationEventsByNumericID[def.numericID] = def;
        break;
    }
  }

  dispatch(updateParticipationEvents([participationEventsByStringID, participationEventsByNumericID]));
}

function isParticipationEventDefData(obj: any, version: number): obj is ParticipationEventDef {
  switch (version) {
    case 1:
      const isCorrectType =
        Object.keys(obj).length === 5 &&
        'id' in obj &&
        'numericID' in obj &&
        'tags' in obj &&
        'coefficient' in obj &&
        'descriptionStringKey' in obj;

      if (!isCorrectType) {
        console.error(`Found invalid ParticipationEventDef object`, obj);
        return false;
      }
      return isCorrectType;
    default:
      console.error(`Found invalid ParticipationEventDef version ${version}`);
      return false;
  }
}
