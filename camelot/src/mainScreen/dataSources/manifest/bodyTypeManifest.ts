/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import { updateBodyTypes } from '../../redux/gameDefsSlice';
import { isDataArray } from './manifestDefService';

export const bodyTypesManifestID = 'bodytypes';

export interface BodyTypeDef {
  id: string;
  numericID: number;
  name: string;
}

export function processBodyTypes(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isBodyTypeData)) {
    console.error('Invalid BodyTypes manifest file');
    return;
  }

  var bodyTypesByStringID: Record<string, BodyTypeDef> = {};
  var bodyTypesByNumericID: Record<number, BodyTypeDef> = {};

  for (const resource of json.defs) {
    switch (version) {
      case 1:
        const bodyTypeDef = {
          id: resource.id,
          numericID: resource.numericID,
          name: resource.name
        };
        bodyTypesByStringID[bodyTypeDef.id] = bodyTypeDef;
        bodyTypesByNumericID[bodyTypeDef.numericID] = bodyTypeDef;
        break;
    }
  }

  dispatch(updateBodyTypes([bodyTypesByStringID, bodyTypesByNumericID]));
}

function isBodyTypeData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType = Object.keys(obj).length === 3 && 'id' in obj && 'numericID' in obj && 'name' in obj;
      if (!isCorrectType) {
        console.error(`Found invalid BodyType object`, obj);
      }
      return isCorrectType;
    default:
      console.error(`Found invalid BodyType version ${version}`);
      return false;
  }
}
