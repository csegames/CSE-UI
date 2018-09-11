/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import 'isomorphic-fetch';
import { RequestConfig, client, webAPI, events } from '@csegames/camelot-unchained';
import { patcher } from '../../../../services/patcher';

const totalPoints = 30;

export enum attributeType {
  NONE,
  PRIMARY,        // can adjust during character creation, and can be raised through progression
  SECONDARY,      // can set during character creation, locked after creation
  DERIVED,        // calculated from primary or secondary attributes, player can not directly change
}

export interface AttributeInfo {
  name: string;
  description: string;
  derivedFrom: string; // only on derived attributes
  baseValue: number;
  type: attributeType;
  maxOrMultipler: number;
  // Added by patcher -- not in the api response message
  allocatedPoints: number;
  minValue: number; // based on race & gender selections -- filled out when calling
  units: string;
}

const FETCH_ATTRIBUTES = 'cu-character-creation/attributes/FETCH_ATTRIBUTES';
const FETCH_ATTRIBUTES_SUCCESS = 'cu-character-creation/attributes/FETCH_ATTRIBUTES_SUCCESS';
const FETCH_ATTRIBUTES_FAILED = 'cu-character-creation/attributes/FETCH_ATTRIBUTES_FAILED';

const ALLOCATE_ATTRIBUTE_POINT = 'cu-character-creation/attributes/ALLOCATE_ATTRIBUTE_POINT';

const RESET = 'cu-character-creation/attributes/RESET';

export function resetAttributes() {
  return {
    type: RESET,
  };
}

export function allocateAttributePoint(name: string, value: number) {
  return {
    type: ALLOCATE_ATTRIBUTE_POINT,
    name,
    value,
  };
}

export function requestAttributes() {
  return {
    type: FETCH_ATTRIBUTES,
  };
}

export function fetchAttributesSuccess(attributes: AttributeInfo[]) {
  return {
    type: FETCH_ATTRIBUTES_SUCCESS,
    attributes,
    receivedAt: Date.now(),
  };
}

export function fetchAttributesFailed(error: any) {
  return {
    type: FETCH_ATTRIBUTES_FAILED,
    error: error.Message,
  };
}

export function fetchAttributes(shard: number = 1, apiHost: string) {
  return (dispatch: (action: any) => any) => {
    dispatch(requestAttributes());
    return getAttributeInfo(dispatch, shard, apiHost);
  };
}

async function getAttributeInfo(dispatch: (action: any) => any, shard: number, apiHost: string) {
  try {
    const config: RequestConfig = () => ({
      url: apiHost,
      headers: {
        Authorization: `${client.ACCESS_TOKEN_PREFIX} ${patcher.getAccessToken()}`,
      },
    });
    const res = await webAPI.GameDataAPI.GetAttributeInfoV1(config, shard);
    const data = JSON.parse(res.data);
    if (res.ok) {
      data.map((a: any) => {
        a.allocatedPoints = 0;
        a.minValue = a.baseValue;
      });
      dispatch(fetchAttributesSuccess(data));
    } else {
      dispatch(fetchAttributesFailed(data));
    }
  } catch (err) {
    dispatch(fetchAttributesFailed(err));
  }
}

export interface AttributesState {
  isFetching?: boolean;
  lastUpdated?: Date;
  attributes?: AttributeInfo[];
  error?: string;
  allocations?: {name: string, value: number}[];
  pointsAllocated?: number;
  maxPoints?: number;
}

const initialState: AttributesState  = {
  isFetching: false,
  lastUpdated: <Date> null,
  attributes: [],
  error: null,
  allocations: [],
  pointsAllocated: 0,
  maxPoints: totalPoints,
};

export default function reducer(state: AttributesState = initialState, action: any = {}) {
  switch (action.type) {
    case FETCH_ATTRIBUTES:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case FETCH_ATTRIBUTES_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        lastUpdated: action.receivedAt,
        attributes: action.attributes,
      });
    case FETCH_ATTRIBUTES_FAILED:
      return Object.assign({}, state, {
        isFetching: false,
        error: action.error,
      });
    case ALLOCATE_ATTRIBUTE_POINT:
      let allocated = 0;
      return Object.assign({}, state, {
        attributes: state.attributes.map((a: AttributeInfo) => {
          if (a.name === action.name && a.allocatedPoints + a.baseValue + action.value >= a.minValue &&
            state.pointsAllocated + action.value + allocated <= totalPoints) {
            a.allocatedPoints += action.value;
            allocated += action.value;
            events.fire('play-sound', 'select');
          }
          return a;
        }),
        pointsAllocated: state.pointsAllocated + allocated,
      });
    case RESET: return initialState;
    default: return state;
  }
}
