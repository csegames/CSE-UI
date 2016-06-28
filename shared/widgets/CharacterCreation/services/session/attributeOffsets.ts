/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Promise} from 'es6-promise';
import 'isomorphic-fetch';
import {race, gender} from 'camelot-unchained';

import {fetchJSON} from '../../../../lib/fetchHelpers';
import ResponseError from '../../../../lib/ResponseError';

export interface AttributeOffsetInfo {
  race: race;
  gender: gender;
  attributeOffsets: any;
}

const FETCH_ATTRIBUTE_OFFSETS = 'cu-character-creation/attribute-offsets/FETCH_ATTRIBUTE_OFFSETS';
const FETCH_ATTRIBUTE_OFFSETS_SUCCESS = 'cu-character-creation/attribute-offsets/FETCH_ATTRIBUTE_OFFSETS_SUCCESS';
const FETCH_ATTRIBUTE_OFFSETS_FAILED = 'cu-character-creation/attribute-offsets/FETCH_ATTRIBUTE_OFFSETS_FAILED';


export function requestAttributeOffsets() {
  return {
    type: FETCH_ATTRIBUTE_OFFSETS,
  }
}

export function fetchAttributeOffsetsSuccess(offsets: Array<AttributeOffsetInfo>) {
  return {
    type: FETCH_ATTRIBUTE_OFFSETS_SUCCESS,
    offsets: offsets,
    receivedAt: Date.now(),
  }
}

export function fetchAttributeOffsetsFailed(error: ResponseError) {
  return {
    type: FETCH_ATTRIBUTE_OFFSETS_FAILED,
    error: error.message,
  }
}

export function fetchAttributeOffsets(apiUrl: string = 'https://api.camelotunchained.com/', shard: number = 1, apiVersion: number = 1) {
  return (dispatch: (action: any) => any) => {
    dispatch(requestAttributeOffsets());
    return fetchJSON(`${apiUrl}gamedata/attributeoffsets/${shard}?api-version=${apiVersion}`)
      .then((offsets: Array<AttributeOffsetInfo>) => dispatch(fetchAttributeOffsetsSuccess(offsets)))
      .catch((error: ResponseError) => dispatch(fetchAttributeOffsetsFailed(error)));
  }
}

export interface AttributeOffsetsState {
  isFetching?: boolean;
  lastUpdated?: Date;
  offsets?: Array<AttributeOffsetInfo>;
  error?: string;
}

const initialState: AttributeOffsetsState = {
  isFetching: false,
  lastUpdated: <Date>null,
  offsets: <Array<AttributeOffsetInfo>>[],
  error: null,
}

export default function reducer(state: AttributeOffsetsState = initialState, action: any = {}) {
  switch(action.type) {
    case FETCH_ATTRIBUTE_OFFSETS:
      return Object.assign({}, state, {
        isFetching: true
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
