/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import 'isomorphic-fetch';
import { client, Race, Gender, webAPI, RequestConfig } from '@csegames/camelot-unchained';
import { patcher } from '../../../../services/patcher';

export interface AttributeOffsetInfo {
  race: Race;
  gender: Gender;
  attributeOffsets: any;
}

const FETCH_ATTRIBUTE_OFFSETS = 'cu-character-creation/attribute-offsets/FETCH_ATTRIBUTE_OFFSETS';
const FETCH_ATTRIBUTE_OFFSETS_SUCCESS = 'cu-character-creation/attribute-offsets/FETCH_ATTRIBUTE_OFFSETS_SUCCESS';
const FETCH_ATTRIBUTE_OFFSETS_FAILED = 'cu-character-creation/attribute-offsets/FETCH_ATTRIBUTE_OFFSETS_FAILED';

const RESET = 'cu-character-creation/attribute-offsets/RESET';

export function resetAttributeOffsets() {
  return {
    type: RESET,
  };
}

export function requestAttributeOffsets() {
  return {
    type: FETCH_ATTRIBUTE_OFFSETS,
  };
}

export function fetchAttributeOffsetsSuccess(offsets: AttributeOffsetInfo[]) {
  return {
    type: FETCH_ATTRIBUTE_OFFSETS_SUCCESS,
    offsets,
    receivedAt: Date.now(),
  };
}

export function fetchAttributeOffsetsFailed(error: any) {
  return {
    type: FETCH_ATTRIBUTE_OFFSETS_FAILED,
    error: error.Message,
  };
}

export function fetchAttributeOffsets(shard: number = 1, apiHost: string) {
  return (dispatch: (action: any) => any) => {
    dispatch(requestAttributeOffsets());
    return getAttributeOffsets(dispatch, client.shardID, apiHost);
  };
}

async function getAttributeOffsets(dispatch: (action: any) => any, shard: number, apiHost: string) {
  try {
    const config: RequestConfig = () => ({
      url: apiHost,
      headers: {
        Authorization: `${client.ACCESS_TOKEN_PREFIX} ${patcher.getAccessToken()}`,
      },
    });
    const res = await webAPI.GameDataAPI.GetAttributeOffsetsV1(config, shard);
    const data = JSON.parse(res.data);
    dispatch(res.ok ? fetchAttributeOffsetsSuccess(data) : fetchAttributeOffsetsFailed(data));
  } catch (err) {
    fetchAttributeOffsetsFailed(err);
  }
}

export interface AttributeOffsetsState {
  isFetching?: boolean;
  lastUpdated?: Date;
  offsets?: AttributeOffsetInfo[];
  error?: string;
}

const initialState: AttributeOffsetsState = {
  isFetching: false,
  lastUpdated: <Date> null,
  offsets: [],
  error: null,
};

export default function reducer(state: AttributeOffsetsState = initialState, action: any = {}) {
  switch (action.type) {
    case RESET: return initialState;
    case FETCH_ATTRIBUTE_OFFSETS:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_ATTRIBUTE_OFFSETS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        lastUpdated: action.receivedAt,
        offsets: action.offsets,
      });
    case FETCH_ATTRIBUTE_OFFSETS_FAILED:
      return Object.assign({}, state, {
        isFetching: false,
        error: action.error,
      });
    default: return state;
  }
}
