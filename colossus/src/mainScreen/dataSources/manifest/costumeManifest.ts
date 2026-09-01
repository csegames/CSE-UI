/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary, Dispatch } from '@reduxjs/toolkit';
import { isDataArray } from './manifestDefService';
import { updateCostumes } from '../../redux/championInfoSlice';

export const costumeManifestID = 'costumes';

export interface CostumeDef {
  id: string;
  numericID: number;
  name: string;
  description: string;
  requiredChampionID: string;
  thumbnailURL: string;
  standingImageURL: string;
  championSelectImageURL: string;
  championSelectedFlareImageURL: string;
  cardImageURL: string;
  backgroundImageURL: string;
}

export function processCostumes(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isCostumeData)) {
    console.error('Invalid Costume manifest file');
    return;
  }

  var costumes: CostumeDef[] = [];
  var costumesByID: Dictionary<CostumeDef> = {};
  for (const costume of json.defs) {
    switch (version) {
      case 1:
        costumesByID[costume.id] = {
          id: costume.id,
          numericID: costume.numericID,
          name: costume.name,
          description: costume.description,
          requiredChampionID: costume.requiredChampionID,
          thumbnailURL: costume.thumbnailURL,
          standingImageURL: costume.standingImageURL,
          championSelectImageURL: costume.championSelectImageURL,
          championSelectedFlareImageURL: costume.championSelectedFlareImageURL,
          cardImageURL: costume.cardImageURL,
          backgroundImageURL: costume.backgroundImageURL
        };
        costumes.push(costumesByID[costume.id]);
        break;
    }
  }

  dispatch(updateCostumes({ costumes: costumes, costumesByID: costumesByID }));
}

function isCostumeData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
      const isCorrectType =
        Object.keys(obj).length === 11 &&
        'id' in obj &&
        'numericID' in obj &&
        'name' in obj &&
        'description' in obj &&
        'requiredChampionID' in obj &&
        'thumbnailURL' in obj &&
        'standingImageURL' in obj &&
        'championSelectImageURL' in obj &&
        'championSelectedFlareImageURL' in obj &&
        'cardImageURL' in obj &&
        'backgroundImageURL' in obj;
      if (!isCorrectType) {
        console.error(`Found invalid Costume object`, obj);
      }
      return isCorrectType;
    default:
      console.error(`Found invalid Costume version ${version}`);
      return false;
  }
}
