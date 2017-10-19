/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { client, webAPI, events, signalr } from 'camelot-unchained';
import 'isomorphic-fetch';

import { checkStatus, parseJSON } from '../../lib/fetchHelpers';
import ResponseError from '../../lib/ResponseError';

import { Race, Faction, Gender, Archetype } from 'camelot-unchained';

declare const Materialize: any;

const defaultBanes = {
  '5429de13da9beb2c3c3dd450':3,
  '5429de13da9beb2c3c3dd451':1,
  '5429de13da9beb2c3c3dd452':1,
};

const defaultBoons = {'5429de0eda9beb2c3c3dd32b':1};

export interface CharacterCreationModel {
  name: string;
  race: Race;
  gender: Gender;
  faction: Faction;
  archetype: Archetype;
  shardID: number;
  attributes: {}; // primary attributes
  traitIDs: string[];
}

const CREATE_CHARACTER = 'cu-character-creation/character/CREATE_CHARACTER';
const CREATE_CHARACTER_SUCCESS = 'cu-character-creation/character/CREATE_CHARACTER_SUCCESS';
const CREATE_CHARACTER_FAILED = 'cu-character-creation/character/CREATE_CHARACTER_FAILED';

const RESET = 'cu-character-creation/character/RESET';

export function extractCharacterId(data: string) {
  const characterId = data.match(/characters.*/g)[0].replace(/characters\/.*?\//g, '');
  return characterId;
}

export function resetCharacter() {
  return {
    type: RESET,
  };
}

export function createCharacter(model: CharacterCreationModel,
                                apiKey: string,
                                apiUrl: string = client.apiHost,
                                shard: number = 1,
                                apiVersion: number = 1) {
  return async (dispatch: (action: any) => any) => {
    await dispatch(createCharacterStarted());
    const res = await webAPI.CharactersAPI.CreateCharacterV1(
      webAPI.defaultConfig,
      client.loginToken,
      client.shardID,
      model as any,
    );
    if (res.ok) {
      // We already have the character model, no need to get a push from signalr. Just fire off event.
      const characterId = extractCharacterId(res.data);
      events.fire(signalr.PATCHER_EVENTS_CHARACTERUPDATED, JSON.stringify({
        ...model,
        id: characterId,
        shardID: shard,
      }));
      dispatch(createCharacterSuccess(model));
      return;
    }
    dispatch(createCharacterFailed(res.data));
  };
}

export function createCharacterStarted() {
  return {
    type: CREATE_CHARACTER,
  };
}

export function createCharacterSuccess(model: CharacterCreationModel) {
  return {
    type: CREATE_CHARACTER_SUCCESS,
    model,
  };
}

export function createCharacterFailed(error: any) {
  return {
    type: CREATE_CHARACTER_FAILED,
    error: JSON.parse(error.Message),
  };
}

export interface CharacterState {
  isFetching?: boolean;
  success?: boolean;
  error?: string;
  created?: CharacterCreationModel;
}

const initialState: CharacterState = {
  isFetching: false,
  success: false,
  error: null,
  created: null,
};

declare const toastr: any;

export default function reducer(state: CharacterState = initialState, action: any = {}) {
  switch (action.type) {
    case CREATE_CHARACTER:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case CREATE_CHARACTER_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        success: true,
        created: action.model,
      });
    case CREATE_CHARACTER_FAILED:
      const errors: any =  action.error.Errors;
      errors.forEach((e: string) => toastr.error(e, 'Oh No!!', {timeOut: 5000}));
      return Object.assign({}, state, {
        isFetching: false,
        error: action.error,
      });
    case RESET: return initialState;
    default: return state;
  }
}
