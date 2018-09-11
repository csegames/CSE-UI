/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import 'isomorphic-fetch';
import { client, webAPI, RequestConfig } from '@csegames/camelot-unchained';
import { patcher } from '../../../../services/patcher';

declare const toastr: any;

export interface FactionInfo {
  id: number;
  name: string;
  description: string;
  shortName: string;
}

const FETCH_FACTIONS = 'cu-character-creation/factions/FETCH_FACTIONS';
const FETCH_FACTIONS_SUCCESS = 'cu-character-creation/factions/FETCH_FACTIONS_SUCCESS';
const FETCH_FACTIONS_FAILED = 'cu-character-creation/factions/FETCH_FACTIONS_FAILED';
const SELECT_FACTION = 'cu-character-creation/factions/SELECT_FACTION';
const RESET_FACTION = 'cu-character-creation/factions/RESET_FACTION';

export function resetFaction() {
  return {
    type: RESET_FACTION,
  };
}

export function requestFactions() {
  return {
    type: FETCH_FACTIONS,
  };
}

export function fetchFactionsSuccess(factions: FactionInfo[]) {
  return {
    type: FETCH_FACTIONS_SUCCESS,
    factions,
    receivedAt: Date.now(),
  };
}

export function fetchFactionsFailed(error: any) {
  return {
    type: FETCH_FACTIONS_FAILED,
    error: error.Message,
  };
}

export function selectFaction(selected: FactionInfo) {
  return {
    type: SELECT_FACTION,
    selected,
  };
}

async function getFactions(dispatch: (action: any) => any, apiHost: string) {
  try {
    const config: RequestConfig = () => ({
      url: apiHost,
      headers: {
        Authorization: `${client.ACCESS_TOKEN_PREFIX} ${patcher.getAccessToken()}`,
      },
    });
    const res = await webAPI.GameDataAPI.GetFactionInfoV1(config);
    const data = JSON.parse(res.data);
    dispatch(res.ok ? fetchFactionsSuccess(data) : fetchFactionsFailed(data));
    if (!res.ok) {
      toastr.error('We were not able to retrieve character creation for you. Try again later.', 'Oh No!');
    }
  } catch (err) {
    toastr.error('We were not able to retrieve character creation for you. Try again later.', 'Oh No!');
    fetchFactionsFailed(err);
  }
}

export function fetchFactions(shard: number = 1, apiHost: string) {
  return (dispatch: (action: any) => any) => {
    dispatch(requestFactions());
    return getFactions(dispatch, apiHost);
  };
}

export interface FactionsState {
  isFetching?: boolean;
  lastUpdated?: Date;
  factions?: FactionInfo[];
  selected?: FactionInfo;
  error?: string;
}

const initialState: FactionsState = {
  isFetching: false,
  lastUpdated: <Date> null,
  factions: [],
  selected: null,
  error: null,
};

export default function reducer(state: FactionsState = initialState, action: any = {}) {
  switch (action.type) {
    case RESET_FACTION: return initialState;
    case FETCH_FACTIONS:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_FACTIONS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        lastUpdated: action.receivedAt,
        factions: action.factions,
      });
    case FETCH_FACTIONS_FAILED:
      return Object.assign({}, state, {
        isFetching: false,
        error: action.error,
      });
    case SELECT_FACTION:
      return Object.assign({}, state, {
        selected: action.selected,
      });
    default: return state;
  }
}
