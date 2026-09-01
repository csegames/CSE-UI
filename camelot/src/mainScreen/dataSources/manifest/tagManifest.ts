/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import { updateTags } from '../../redux/gameDefsSlice';

export const tagsManifestID = 'tags';

export function processTags(dispatch: Dispatch, json: any, version: number): void {
  for (let affix in json.affixes) {
    if (!isAffixData(json.affixes[affix], version)) {
      console.error('Invalid Tags manifest file');
      return;
    }
  }

  var tagAffixByNumericID: Record<number, string> = {};
  var tagAffixIDByStringID: Record<string, number> = {};

  for (const affix in json.affixes) {
    switch (version) {
      case 1:
        let affixId = json.affixes[affix];
        tagAffixByNumericID[affixId] = affix;
        tagAffixIDByStringID[affix] = affixId;
        break;
    }
  }

  dispatch(updateTags([tagAffixByNumericID, tagAffixIDByStringID]));
}

function isAffixData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType = !isNaN(Number(obj));
      if (!isCorrectType) {
        console.error(`Found invalid Tag object`, obj);
      }
      return isCorrectType;
    default:
      console.error(`Found invalid Tags version ${version}`);
      return false;
  }
}
