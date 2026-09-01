/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary, Dispatch } from '@reduxjs/toolkit';
import { isDataArray } from './manifestDefService';
import { updatePerformanceWarnings } from '../../redux/performanceWarningsSlice';

export const performanceWarningManifestID = 'performancewarnings';

export interface PerformanceWarningEntryDef {
  id: string;
  name: string;
  iconImage: string;
}

export function processPerformanceWarning(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isPerformanceWarningData)) {
    console.error('Invalid PerformanceWarning manifest file');
    return;
  }

  var entries: Dictionary<PerformanceWarningEntryDef> = {};

  for (const entry of json.defs) {
    switch (version) {
      case 1:
        entries[entry.id] = {
          id: entry.id,
          name: entry.name,
          iconImage: entry.iconImage
        };
        break;
    }
  }
  dispatch(updatePerformanceWarnings(entries));
}

function isPerformanceWarningData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType = Object.keys(obj).length === 3 && 'id' in obj && 'name' in obj && 'iconImage' in obj;
      if (!isCorrectType) {
        console.error(`Found invalid PerformanceWarning object`, obj);
      }
      return isCorrectType;
    default:
      console.error(`Found invalid PerformanceWarning version ${version}`);
      return false;
  }
}
