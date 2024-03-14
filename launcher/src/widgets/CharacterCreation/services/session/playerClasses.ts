/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ResponseError from '../../lib/ResponseError';
import { ArchetypeInfo, GameDataAPI } from '../../../../api/webapi';
import { webapiConf } from '../../../../api/networkConfig';

const FETCH_PLAYER_CLASS = 'cu-character-creation/player-class/FETCH_PLAYER_CLASS';
const FETCH_PLAYER_CLASS_SUCCESS = 'cu-character-creation/player-class/FETCH_PLAYER_CLASS_SUCCESS';
const FETCH_PLAYER_CLASS_FAILED = 'cu-character-creation/player-class/FETCH_PLAYER_CLASS_FAILED';
const SELECT_CLASS = 'cu-character-creation/player-class/SELECT_CLASS';

const RESET_CLASS = 'cu-character-creation/player-class/RESET_CLASS';

export function requestPlayerClasses() {
  return {
    type: FETCH_PLAYER_CLASS
  };
}

export function fetchPlayerClassesSuccess(playerClasses: ArchetypeInfo[]) {
  return {
    type: FETCH_PLAYER_CLASS_SUCCESS,
    playerClasses,
    receivedAt: Date.now()
  };
}

export function fetchPlayerClassesFailed(error: ResponseError) {
  return {
    type: FETCH_PLAYER_CLASS_FAILED,
    error: error.message
  };
}

export function selectPlayerClass(selected: ArchetypeInfo) {
  return {
    type: SELECT_CLASS,
    selected
  };
}

export function resetClass() {
  return {
    type: RESET_CLASS
  };
}

async function getArchetypes(dispatch: (action: any) => any, apiHost: string) {
  const res = await GameDataAPI.GetArchetypesV1(webapiConf(apiHost));
  const data = JSON.parse(res.data);
  if (res.ok) {
    dispatch(fetchPlayerClassesSuccess(data));
  } else {
    dispatch(fetchPlayerClassesFailed(data));
  }
}

export function fetchPlayerClasses(apiUrl: string) {
  return (dispatch: (action: any) => any) => {
    dispatch(requestPlayerClasses());
    return getArchetypes(dispatch, apiUrl);
  };
}

export interface PlayerClassesState {
  isFetching?: boolean;
  lastUpdated?: Date;
  playerClasses?: ArchetypeInfo[];
  selected?: ArchetypeInfo;
  error?: string;
}

const initialState: PlayerClassesState = {
  isFetching: false,
  lastUpdated: <Date>null,
  playerClasses: [],
  selected: null,
  error: null
};

export default function reducer(state: PlayerClassesState = initialState, action: any = {}) {
  switch (action.type) {
    case RESET_CLASS:
      return initialState;
    case FETCH_PLAYER_CLASS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case FETCH_PLAYER_CLASS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        lastUpdated: action.receivedAt,
        playerClasses: action.playerClasses
      });
    case FETCH_PLAYER_CLASS_FAILED:
      return Object.assign({}, state, {
        isFetching: false,
        error: action.error
      });
    case SELECT_CLASS:
      return Object.assign({}, state, {
        selected: action.selected
      });
    default:
      return state;
  }
}
