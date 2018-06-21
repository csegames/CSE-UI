/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import 'isomorphic-fetch';
import { Race, Faction, webAPI } from '@csegames/camelot-unchained';

export interface RaceInfo {
  name: string;
  description: string;
  faction: Faction;
  id: Race;
}

const FETCH_RACES = 'cu-character-creation/races/FETCH_RACES';
const FETCH_RACES_SUCCESS = 'cu-character-creation/races/FETCH_RACES_SUCCESS';
const FETCH_RACES_FAILED = 'cu-character-creation/races/FETCH_RACES_FAILED';
const SELECT_RACE = 'cu-character-creation/races/SELECT_RACE';

const RESET_RACE = 'cu-character-creation/races/RESET_RACE';

export function requestRaces() {
  return {
    type: FETCH_RACES,
  };
}

export function fetchRacesSuccess(races: RaceInfo[]) {
  return {
    type: FETCH_RACES_SUCCESS,
    races,
    receivedAt: Date.now(),
  };
}

export function fetchRacesFailed(error: any) {
  return {
    type: FETCH_RACES_FAILED,
    error: error.Message,
  };
}

export function selectRace(selected: RaceInfo) {
  return {
    type: SELECT_RACE,
    selected,
  };
}

export function resetRace() {
  return {
    type: RESET_RACE,
  };
}

async function getRaces(dispatch: (action: any) => any, apiHost: string) {
  try {
    const res = await webAPI.GameDataAPI.GetRacesV1({ url: apiHost });
    const data = JSON.parse(res.data);
    dispatch(res.ok ? fetchRacesSuccess(data) : fetchRacesFailed(data));
  } catch (err) {
    dispatch(fetchRacesFailed(err));
  }
}

export function fetchRaces(shard: number = 1, apiHost: string) {
  return (dispatch: (action: any) => any) => getRaces(dispatch, apiHost);
}

export interface RacesState {
  isFetching?: boolean;
  lastUpdated?: Date;
  races?: RaceInfo[];
  selected?: RaceInfo;
  error?: string;
}

const initialState: RacesState  = {
  isFetching: false,
  lastUpdated: <Date>null,
  races: [],
  selected: null,
  error: null,
};

export default function reducer(state: RacesState = initialState, action: any = {}) {
  switch (action.type) {
    case RESET_RACE: return initialState;
    case FETCH_RACES:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_RACES_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        lastUpdated: action.receivedAt,
        races: action.races,
      });
    case FETCH_RACES_FAILED:
      return Object.assign({}, state, {
        isFetching: false,
        error: action.error,
      });
    case SELECT_RACE:
      return Object.assign({}, state, {
        selected: action.selected,
      });
    default: return state;
  }
}
