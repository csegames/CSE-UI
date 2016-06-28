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

const totalPoints = 30;

export enum attributeType {
  NONE,
  PRIMARY,        // can adjust during character creation, and can be raised through progression
  SECONDARY,      // can set during character creation, locked after creation
  DERIVED         // calculated from primary or secondary attributes, player can not directly change
}

export interface AttributeInfo {
  name: string,
  description: string,
  derivedFrom: string, // only on derived attributes
  baseValue: number,
  type: attributeType,
  maxOrMultipler: number,
  // Added by patcher -- not in the api response message
  allocatedPoints: number,
  minValue: number, // based on race & gender selections -- filled out when calling
  units: string,
}

const FETCH_ATTRIBUTES = 'cu-character-creation/attributes/FETCH_ATTRIBUTES';
const FETCH_ATTRIBUTES_SUCCESS = 'cu-character-creation/attributes/FETCH_ATTRIBUTES_SUCCESS';
const FETCH_ATTRIBUTES_FAILED = 'cu-character-creation/attributes/FETCH_ATTRIBUTES_FAILED';

const ALLOCATE_ATTRIBUTE_POINT = 'cu-character-creation/attributes/ALLOCATE_ATTRIBUTE_POINT';
const UPDATE_WITH_OFFSETS = 'cu-character-creation/attributes/UPDATE_WITH_OFFSETS';

const FETCH_OFFSETS = 'cu-character-creation/attributes/FETCH_OFFSETS';
const FETCH_OFFSETS_SUCCESS = 'cu-character-creation/attributes/FETCH_OFFSETS_SUCCESS';

const RESET = 'cu-character-creation/attributes/RESET';

export function resetAttributes() {
  return {
    type: RESET,
    state: initialState,
  }
}

export function allocateAttributePoint(name: string, value: number) {
  return {
    type: ALLOCATE_ATTRIBUTE_POINT,
    name: name,
    value: value,
  }
}

export function requestAttributes() {
  return {
    type: FETCH_ATTRIBUTES,
  }
}

export function fetchAttributesSuccess(attributes: Array<AttributeInfo>) {
  return {
    type: FETCH_ATTRIBUTES_SUCCESS,
    attributes: attributes,
    receivedAt: Date.now(),
  }
}

export function fetchAttributesFailed(error: ResponseError) {
  return {
    type: FETCH_ATTRIBUTES_FAILED,
    error: error.message,
  }
}

export function fetchAttributes(apiUrl: string = 'https://api.camelotunchained.com/', shard: number = 1, apiVersion: number = 1) {
  return (dispatch: (action: any) => any) => {
    dispatch(requestAttributes());
    return fetchJSON(`${apiUrl}gamedata/attributes/${shard}?api-version=${apiVersion}`)
      .then((attributes: Array<AttributeInfo>) => attributes.map((a: AttributeInfo) => {
          a.allocatedPoints = 0;
          a.minValue = a.baseValue;
          return a;
      }))
      .then((attributes: Array<AttributeInfo>) => dispatch(fetchAttributesSuccess(attributes)))
      .catch((error: ResponseError) => dispatch(fetchAttributesFailed(error)));
  }
}

export interface AttributesState {
  isFetching?: boolean;
  lastUpdated?: Date;
  attributes?: Array<AttributeInfo>;
  error?: string;
  allocations?: Array<{name: string, value: number}>;
  pointsAllocated?: number;
  maxPoints?: number;
}

const initialState: AttributesState  = {
  isFetching: false,
  lastUpdated: <Date>null,
  attributes: <Array<AttributeInfo>>[],
  error: null,
  allocations: [],
  pointsAllocated: 0,
  maxPoints: totalPoints,
}

export default function reducer(state: AttributesState = initialState, action: any = {}) {
  switch(action.type) {
    case FETCH_ATTRIBUTES:
      return Object.assign({}, state, {
        isFetching: true
      });
    case FETCH_ATTRIBUTES_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        lastUpdated: action.receivedAt,
        attributes: action.attributes
      });
    case FETCH_ATTRIBUTES_FAILED:
      return Object.assign({}, state, {
        isFetching: false,
        error: action.error
      });
    case ALLOCATE_ATTRIBUTE_POINT:
      let allocated = 0;
      return Object.assign({}, state, {
        attributes: state.attributes.map((a: AttributeInfo) => {
          if (a.name == action.name && a.allocatedPoints + a.baseValue + action.value >= a.minValue && state.pointsAllocated + action.value + allocated <= totalPoints) {
            a.allocatedPoints += action.value;
            allocated += action.value;
          }
          return a;
        }),
        pointsAllocated: state.pointsAllocated + allocated,
      });
    case RESET:
      return action.state;
    default: return state;
  }
}
