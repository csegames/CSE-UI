/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary, Dispatch } from '@reduxjs/toolkit';
import { isDataArray } from './manifestDefService';
import { updateRequirements } from '../../redux/gameDefsSlice';

export const requirementManifestID = 'requirements';

export interface RequirementDef {
  id: string;
  iconURL: string;
  description: string;
}

export function processRequirements(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isRequirementData)) {
    console.error('Invalid Requirement manifest file');
    return;
  }

  var requirements: Dictionary<RequirementDef> = {};

  for (const tab of json.defs) {
    switch (version) {
      case 1:
        requirements[tab.id] = {
          id: tab.id,
          iconURL: tab.iconURL,
          description: tab.description
        };
        break;
    }
  }

  dispatch(updateRequirements(requirements));
}

function isRequirementData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType = Object.keys(obj).length === 3 && 'id' in obj && 'iconURL' in obj && 'description' in obj;
      if (!isCorrectType) {
        console.error(`Found invalid Requirement object`, obj);
      }
      return isCorrectType;
    default:
      console.error(`Found invalid Requirement version ${version}`);
      return false;
  }
}
