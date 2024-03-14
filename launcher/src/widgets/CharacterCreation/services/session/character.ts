/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Archetype, Gender, Race } from '../../../../api/helpers';
import { webapiConf } from '../../../../api/networkConfig';
import { Character, CharactersAPI, Faction } from '../../../../api/webapi';

export interface CharacterCreationModel {
  name: string;
  race: Race;
  gender: Gender;
  faction: Faction;
  archetype: Archetype;
  shardID: number;
  attributes: { [statId: string]: number }; // primary attributes
  traitIDs: string[];
}

const CREATE_CHARACTER = 'cu-character-creation/character/CREATE_CHARACTER';
const CREATE_CHARACTER_SUCCESS = 'cu-character-creation/character/CREATE_CHARACTER_SUCCESS';
const CREATE_CHARACTER_FAILED = 'cu-character-creation/character/CREATE_CHARACTER_FAILED';

const RESET = 'cu-character-creation/character/RESET';

export function resetCharacter() {
  return {
    type: RESET
  };
}

export function createCharacter(model: CharacterCreationModel, apiUrl: string, shard: number = 1) {
  return async (dispatch: (action: any) => any) => {
    await dispatch(createCharacterStarted());
    try {
      const res = await CharactersAPI.CreateCharacterV2(webapiConf(apiUrl), shard, model as Character);
      if (res.ok) {
        dispatch(createCharacterSuccess(model));
        return;
      }
      const errorData = JSON.parse(res.data);
      let error = 'There was an error with character creation!';
      if (errorData.FieldCodes && errorData.FieldCodes[0] && errorData.FieldCodes[0].Message) {
        const potentialError = JSON.parse(errorData.FieldCodes[0].Message);
        error = potentialError.Errors ? potentialError.Errors : error;
      }
      dispatch(createCharacterFailed(error));
    } catch (e) {
      dispatch(createCharacterFailed('There was an unexpected error!'));
    }
  };
}

export function createCharacterStarted() {
  return {
    type: CREATE_CHARACTER
  };
}

export function createCharacterSuccess(model: CharacterCreationModel) {
  return {
    type: CREATE_CHARACTER_SUCCESS,
    model
  };
}

export function createCharacterFailed(error: string | string[]) {
  return {
    type: CREATE_CHARACTER_FAILED,
    error
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
  created: null
};

declare const toastr: any;

export default function reducer(state: CharacterState = initialState, action: any = {}) {
  switch (action.type) {
    case CREATE_CHARACTER:
      return Object.assign({}, state, {
        isFetching: true
      });
    case CREATE_CHARACTER_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        success: true,
        created: action.model
      });
    case CREATE_CHARACTER_FAILED:
      const errors: any = action.error;
      if (!errors) {
        toastr.error('An unexpected error occured! Try restarting your patcher', 'Oh No!!', { timeout: 5000 });
      } else if (typeof errors == 'string') {
        toastr.error(errors, 'Oh No!!', { timeout: 5000 });
      } else {
        errors.forEach((e: string) => toastr.error(e, 'Oh No!!', { timeout: 5000 }));
      }
      return Object.assign({}, state, {
        isFetching: false,
        error: action.error
      });
    case RESET:
      return initialState;
    default:
      return state;
  }
}
