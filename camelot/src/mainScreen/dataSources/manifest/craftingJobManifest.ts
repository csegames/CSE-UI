/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Dispatch } from '@reduxjs/toolkit';
import { updateCraftingJobs } from '../../redux/gameDefsSlice';
import { isDataArray } from './manifestDefService';

export const craftingJobManifestID = 'craftingjobs';

export interface CraftingJobDef {
  id: string;
  skillStatID: string; // Stat ID of the primary player stat associated with this job, such as for min skill level requirements
}

export function processCraftingJobs(dispatch: Dispatch, json: any, version: number): void {
  const craftingJobs: Dictionary<CraftingJobDef> = {};
  if (!isDataArray(json.defs, version, isCraftingJobsData)) {
    console.error('Invalid craftingJobs manifest file');
    return;
  }

  for (const craftingJob of json.defs) {
    switch (version) {
      case 2:
        craftingJobs[craftingJob.id] = {
          id: craftingJob.id,
          skillStatID: craftingJob.skillStatID
        };
    }
  }

  dispatch(updateCraftingJobs(craftingJobs));
}

function isCraftingJobsData(obj: any, version: number): boolean {
  switch (version) {
    case 2:
      const isCorrectType = Object.keys(obj).length === 2 && 'id' in obj && 'skillStatID' in obj;
      if (!isCorrectType) {
        console.error(`Found invalid CraftingJob object`, obj);
      }
      return isCorrectType;
    default:
      console.error(`Found invalid CraftingJob version ${version}`);
      return false;
  }
}
