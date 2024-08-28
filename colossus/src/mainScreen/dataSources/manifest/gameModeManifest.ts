import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Dispatch } from '@reduxjs/toolkit';
import { updateGameModes } from '../../redux/matchSlice';

export const gameModeManifestID = 'gamemodes';

export interface GameModeDef {
  id: string;
  name: string;
  description: string;
  bannerImage: string;
  cardImage: string;
}

export function processGameModes(dispatch: Dispatch, json: any, version: number): void {
  if (!isGameModesDataArray(json.defs)) {
    console.error('Invalid gamemodes manifest file');
    return;
  }

  const factions: Dictionary<GameModeDef> = {};
  for (const faction of json.defs) {
    factions[faction.id] = faction;
  }

  dispatch(updateGameModes(factions));
}

function isGameModeData(obj: any): obj is GameModeDef {
  const isCorrectType =
    Object.keys(obj).length === 5 &&
    'id' in obj &&
    'name' in obj &&
    'description' in obj &&
    'bannerImage' in obj &&
    'cardImage' in obj;

  if (!isCorrectType) {
    console.error(`Found invalid GameMode object`, obj);
  }
  return isCorrectType;
}

function isGameModesDataArray(obj: any): obj is GameModeDef[] {
  if (!Array.isArray(obj)) {
    return false;
  } else {
    // Are there any items in the array that aren't the correct type?
    return (
      obj.find((arrayEntry) => {
        return !isGameModeData(arrayEntry);
      }) === undefined
    );
  }
}
