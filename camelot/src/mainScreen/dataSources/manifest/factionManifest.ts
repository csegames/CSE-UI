import { Dictionary } from "@csegames/library/dist/_baseGame/types/ObjectMap";
import { Faction } from "@csegames/library/dist/camelotunchained/graphql/schema";
import { Dispatch } from "@reduxjs/toolkit";
import { updateFactions } from "../../redux/gameDefsSlice";

export const factionManifestID = 'factions';

export interface FactionDef {
  id: Faction;
  description: string;
  name: string;
  hueRotation: string;
  nameplateIconFrameImage: string;
  abilityBarEmptySlotImage: string;
  abilityBarDockImages: string[];
  nameplateBackgroundImage: string;
  nameplateMainFrameImage: string;
  nameplateMiniFrameImage: string;
  nameplateProfileImage: string;
  paperdollBackgroundImage: string;
  paperdollBaseImage: string;
}

export function processFactions(dispatch: Dispatch, json: any, version: number): void {
  if (!isFactionsDataArray(json.defs)) {
    console.error('Invalid factions manifest file');
    return;
  }

  const factions: Dictionary<FactionDef> = {};
  for (const faction of json.defs) {
    factions[faction.id] = faction;
  }

  dispatch(updateFactions(factions));
}

function isFactionsData(obj: any): obj is FactionDef {
  const isCorrectType =
    Object.keys(obj).length === 13 &&
    'id' in obj &&
    'description' in obj &&
    'name' in obj &&
    'hueRotation' in obj &&
    'nameplateIconFrameImage' in obj &&
    'abilityBarEmptySlotImage' in obj &&
    'abilityBarDockImages' in obj &&
    'nameplateBackgroundImage' in obj &&
    'nameplateMainFrameImage' in obj &&
    'nameplateMiniFrameImage' in obj &&
    'nameplateProfileImage' in obj &&
    'paperdollBackgroundImage' in obj &&
    'paperdollBaseImage' in obj;
  if (!isCorrectType) {
    console.error(`Found invalid Factions object`, obj);
  }
  return isCorrectType;
}

function isFactionsDataArray(obj: any): obj is FactionDef[] {
  if (!Array.isArray(obj)) {
    return false;
  } else {
    // Are there any items in the array that aren't the correct type?
    return (
      obj.find((arrayEntry) => {
        return !isFactionsData(arrayEntry);
      }) === undefined
    );
  }
}
