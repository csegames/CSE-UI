/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import { updateClasses } from '../../redux/gameDefsSlice';
import { isDataArray } from './manifestDefService';
import { Faction } from '@csegames/library/dist/camelotunchained/graphql/schema';

export const classesManifestID = 'classes';

export interface PaperDollImageDef {
  raceID: string;
  bodyTypeID: string;
  image: string;
  characterSelectAnimation: string;
  armoryAnimation: string;
  defaultOutfit: string;
}

export interface ClassDef {
  id: string;
  numericID: number;
  name: string;
  description: string;
  playerCreatable: boolean;
  factionID: Faction;
  nameplateIconBackgroundImage: string;
  nameplateIconFrameImage: string;
  abilityBookIconImage: string;
  combatAbilitiesIconImage: string;
  unitFrameIconImage: string;
  paperDollImages: PaperDollImageDef[];
  statLoadoutIDs: string[];
  progressionTracks: string[];
}

export function processClasses(dispatch: Dispatch, json: any, version: number): void {
  if (!isDataArray(json.defs, version, isClassData)) {
    console.error(`Invalid Classes manifest file using schema version ${version}.`);
    return;
  }

  var classesByStringID: Record<string, ClassDef> = {};
  var classesByNumericID: Record<number, ClassDef> = {};

  for (const classJson of json.defs) {
    switch (version) {
      case 1:
        const classDefV1 = {
          id: classJson.id,
          numericID: classJson.numericID,
          name: classJson.name,
          description: classJson.description,
          playerCreatable: classJson.playerCreatable,
          factionID: classJson.factionID,
          nameplateIconBackgroundImage: classJson.nameplateIconBackgroundImage,
          nameplateIconFrameImage: classJson.nameplateIconFrameImage,
          abilityBookIconImage: classJson.abilityBookIconImage,
          combatAbilitiesIconImage: classJson.combatAbilitiesIconImage,
          unitFrameIconImage: classJson.unitFrameIconImage,
          paperDollImages: classJson.paperDollImages,
          statLoadoutIDs: classJson.statLoadoutIDs,
          progressionTracks: new Array<string>()
        };
        classesByStringID[classDefV1.id] = classDefV1;
        classesByNumericID[classDefV1.numericID] = classDefV1;
        break;
      case 2:
      case 3:
        const classDefV2 = {
          id: classJson.id,
          numericID: classJson.numericID,
          name: classJson.name,
          description: classJson.description,
          playerCreatable: classJson.playerCreatable,
          factionID: classJson.factionID,
          nameplateIconBackgroundImage: classJson.nameplateIconBackgroundImage,
          nameplateIconFrameImage: classJson.nameplateIconFrameImage,
          abilityBookIconImage: classJson.abilityBookIconImage,
          combatAbilitiesIconImage: classJson.combatAbilitiesIconImage,
          unitFrameIconImage: classJson.unitFrameIconImage,
          paperDollImages: classJson.paperDollImages,
          statLoadoutIDs: classJson.statLoadoutIDs,
          progressionTracks: classJson.progressionTracks
        };
        classesByStringID[classDefV2.id] = classDefV2;
        classesByNumericID[classDefV2.numericID] = classDefV2;
        break;
    }
  }

  dispatch(updateClasses([classesByStringID, classesByNumericID]));
}

function isClassData(obj: any, version: number): boolean {
  switch (version) {
    case 1:
    {
      const isCorrectV1Type =
        Object.keys(obj).length === 13 &&
        'id' in obj &&
        'numericID' in obj &&
        'name' in obj &&
        'description' in obj &&
        'playerCreatable' in obj &&
        'factionID' in obj &&
        'nameplateIconBackgroundImage' in obj &&
        'nameplateIconFrameImage' in obj &&
        'abilityBookIconImage' in obj &&
        'combatAbilitiesIconImage' in obj &&
        'unitFrameIconImage' in obj &&
        'paperDollImages' in obj &&
        'statLoadoutIDs' in obj;
      if (!isCorrectV1Type || !Array.isArray(obj.paperDollImages) || !Array.isArray(obj.statLoadoutIDs)) {
        console.error(`Found invalid Class object`, obj);
      } else {
        for (const image of obj.paperDollImages) {
          const imageCorrectType =
            Object.keys(image).length === 3 && 'raceID' in image && 'bodyTypeID' in image && 'image' in image;
          if (!imageCorrectType) {
            console.error(`Found invalid Class paperDollImages object`, image);
            return false;
          }
        }
      }
      return isCorrectV1Type;
    }
    case 2:
    {
      const isCorrectV2Type =
        Object.keys(obj).length === 14 &&
        'id' in obj &&
        'numericID' in obj &&
        'name' in obj &&
        'description' in obj &&
        'playerCreatable' in obj &&
        'factionID' in obj &&
        'nameplateIconBackgroundImage' in obj &&
        'nameplateIconFrameImage' in obj &&
        'abilityBookIconImage' in obj &&
        'combatAbilitiesIconImage' in obj &&
        'unitFrameIconImage' in obj &&
        'paperDollImages' in obj &&
        'statLoadoutIDs' in obj &&
        'progressionTracks' in obj;
      if (!isCorrectV2Type || !Array.isArray(obj.paperDollImages) || !Array.isArray(obj.statLoadoutIDs)) {
        console.error(`Found invalid Class object`, obj);
      } else {
        for (const image of obj.paperDollImages) {
          const imageCorrectType =
            Object.keys(image).length === 3 && 'raceID' in image && 'bodyTypeID' in image && 'image' in image;
          if (!imageCorrectType) {
            console.error(`Found invalid Class paperDollImages object`, image);
            return false;
          }
        }
      }
      return isCorrectV2Type;
    }
    case 3:
    {
      const isCorrectType =
        Object.keys(obj).length === 14 &&
        'id' in obj &&
        'numericID' in obj &&
        'name' in obj &&
        'description' in obj &&
        'playerCreatable' in obj &&
        'factionID' in obj &&
        'nameplateIconBackgroundImage' in obj &&
        'nameplateIconFrameImage' in obj &&
        'abilityBookIconImage' in obj &&
        'combatAbilitiesIconImage' in obj &&
        'unitFrameIconImage' in obj &&
        'paperDollImages' in obj &&
        'statLoadoutIDs' in obj && 
        'progressionTracks' in obj;
      if (!isCorrectType || !Array.isArray(obj.paperDollImages) || !Array.isArray(obj.statLoadoutIDs)) {
        console.error(`Found invalid Class object`, obj);
      } else {
        for (const image of obj.paperDollImages) {
          const imageCorrectType =
            Object.keys(image).length === 6 && 'raceID' in image && 'bodyTypeID' in image && 'image' in image && 'characterSelectAnimation' in image && 'armoryAnimation' in image && 'defaultOutfit' in image;
          if (!imageCorrectType) {
            console.error(`Found invalid Class paperDollImages object`, image);
            return false;
          }
        }
      }
      return isCorrectType;
    }
    default:
      console.error(`Found invalid Class version ${version}`);
      return false;
  }
}
