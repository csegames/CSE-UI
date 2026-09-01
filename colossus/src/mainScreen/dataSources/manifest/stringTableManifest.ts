/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary, Dispatch } from '@reduxjs/toolkit';
import { isDataArray } from './manifestDefService';
import { updateStringTable } from '../../redux/stringTableSlice';

export const stringTableManifestID = 'stringtable';

export interface StringTableEntryDef {
  id: string;
  text: string;
}

export function processStringTable(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isStringTableData)) {
    console.error('Invalid StringTable manifest file');
    return;
  }

  var entries: Dictionary<StringTableEntryDef> = {};

  for (const entry of json.defs) {
    switch (version) {
      case 1:
        entries[entry.id] = {
          id: entry.id,
          text: entry.text
        };
        break;
    }
  }

  dispatch(updateStringTable(entries));
}

function isStringTableData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType = Object.keys(obj).length === 2 && 'id' in obj && 'text' in obj;
      if (!isCorrectType) {
        console.error(`Found invalid StringTable object`, obj);
      }
      return isCorrectType;
    default:
      console.error(`Found invalid StringTable version ${version}`);
      return false;
  }
}
