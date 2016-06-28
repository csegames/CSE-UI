/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Promise} from 'es6-promise';
import 'isomorphic-fetch';

import ResponseError from '../../../../../shared/lib/ResponseError';
import {fetchJSON} from '../../../../../shared/lib/fetchHelpers';

import {restAPI, archetype, faction} from 'camelot-unchained';
import {patcher} from '../../api/patcherAPI';

import * as moment from 'moment';

const charactersUrl = 'https://api.camelotunchained.com/characters';

// action types
const FETCH_CHARACTERS = 'cse-patcher/characters/FETCH_CHARACTERS';
const FETCH_CHARACTERS_SUCCESS = 'cse-patcher/characters/FETCH_CHARACTERS_SUCCESS';
const FETCH_CHARACTERS_FAILED = 'cse-patcher/characters/FETCH_CHARACTERS_FAILED';
const SELECT_CHARACTER = 'cse-patcher/characters/SELECT_CHARACTER';
const CHARACTER_CREATED = 'cse-patcher/characters/CHARACTER_CREATED';

// sync actions
export function requestCharacters() {
  return {
    type: FETCH_CHARACTERS
  };
}

export function fetchCharactersSuccess(characters: Array<restAPI.SimpleCharacter>, selectedCharacter?: restAPI.SimpleCharacter) {
  return {
    type: FETCH_CHARACTERS_SUCCESS,
    characters: characters,
    selectedCharacter: selectedCharacter,
    receivedAt: Date.now()
  };
}

export function fetchCharactersFailed(error: ResponseError) {
  return {
    type: FETCH_CHARACTERS_FAILED,
    error: error
  };
}

export function selectCharacter(character: restAPI.SimpleCharacter) {
  return {
    type: SELECT_CHARACTER,
    character: character
  };
}

export function characterCreated(character: restAPI.SimpleCharacter) {
  return {
    type: CHARACTER_CREATED,
    character: character
  }
}

// async actions
export function fetchCharacters(selectedCharacterID?: string) {
  return (dispatch: (action: any) => any) => {
    dispatch(requestCharacters());
    // not using the restAPI getcharacters because the internal loginToken
    // stuff does not work with the patcher
    return fetchJSON(`${charactersUrl}?loginToken=${patcher.getLoginToken()}`)
      .then((characters: Array<restAPI.SimpleCharacter>) => {
        let selectedCharacter: restAPI.SimpleCharacter = null;
        if (selectedCharacterID) {
          for (let i = 0; i < characters.length; i++) {
            if (characters[i].id === selectedCharacterID) {
              selectedCharacter = characters[i];
              break;
            }
          }
        }
        dispatch(fetchCharactersSuccess(characters, selectedCharacter))
      })
      .catch((error: ResponseError) => dispatch(fetchCharactersFailed(error)));
  };
}

// reducer
export interface CharactersState {
  isFetching?: boolean;
  lastUpdated?: Date;
  characters?: Array<restAPI.SimpleCharacter>;
  selectedCharacter?: restAPI.SimpleCharacter;
  newCharacterName?: string;
  error?: string;
}

const initialState = {
  isFetching: false,
  lastUpdated: <Date>null,
  characters: <Array<restAPI.SimpleCharacter>>[]
}

function compareCharacterLogin(a: restAPI.SimpleCharacter, b: restAPI.SimpleCharacter): number {
  if (a.lastLogin !== '0001-01-01T00:00:00Z') {
    if (b.lastLogin === '0001-01-01T00:00:00Z') return -1;
  } else {
    if (b.lastLogin !== '0001-01-01T00:00:00Z') return 1;
  }
  if (moment(a.lastLogin).isBefore(b.lastLogin)) return 1;
  if (moment(b.lastLogin).isBefore(a.lastLogin)) return -1;
  if (a.name.toUpperCase() > b.name.toUpperCase()) return 1;
  if (a.name.toUpperCase() < b.name.toUpperCase()) return -1;
  return 0;
}

export default function reducer(state: CharactersState = initialState, action: any = {}) {
  switch(action.type) {
    case FETCH_CHARACTERS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case FETCH_CHARACTERS_SUCCESS:
      let characters: Array<restAPI.SimpleCharacter> = action.characters.slice();
      characters.sort(compareCharacterLogin);
      let selected: restAPI.SimpleCharacter = action.selectedCharacter;
      if (state.newCharacterName) {
        const charIndex: number = characters.findIndex((char: restAPI.SimpleCharacter) => char.name == state.newCharacterName);
        if (charIndex && charIndex > -1) selected = characters[charIndex];
      }
      if (!selected) selected = state.selectedCharacter == null ? characters[0] : state.selectedCharacter;
      return Object.assign({}, state, {
        isFetching: false,
        lastUpdated: action.receivedAt,
        characters: characters,
        newCharacterName: null,
        selectedCharacter: selected
      });
    case FETCH_CHARACTERS_FAILED:
      return Object.assign({}, state, {
        isFetching: false,
        error: action.error
      });
    case SELECT_CHARACTER:
      return Object.assign({}, state, {
        selectedCharacter: action.character
      });
    case CHARACTER_CREATED:
      return Object.assign({}, state, {
        newCharacterName: action.character.name
      });

    default: return state;
  }
}
