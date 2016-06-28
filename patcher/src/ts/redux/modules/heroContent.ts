/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Promise} from 'es6-promise';
import 'isomorphic-fetch';

import ResponseError from '../../../../../shared/lib/ResponseError';
import {fetchJSON} from '../../../../../shared/lib/fetchHelpers';

const HeroContentUrl = 'http://api.camelotunchained.com/patcherherocontent';

export interface HeroContentItem {
  id: string,
  priority: number,
  content: string,
  utcDateStart: string,
  utcDateEnd: string
}

// action types
const FETCH_HERO_ITEMS = 'cse-patcher/herocontent/FETCH_HERO_ITEMS';
const FETCH_HERO_ITEMS_SUCCESS = 'cse-patcher/herocontent/FETCH_HERO_ITEMS_SUCCESS';
const FETCH_HERO_ITEMS_FAILED = 'cse-patcher/herocontent/FETCH_HERO_ITEMS_FAILED';
const VALIDATE_HERO_ITEMS = 'cse-patcher/herocontent/VALIDATE_HERO_ITEMS';

// sync actions
export function requestHeroContent() {
  return {
    type: FETCH_HERO_ITEMS
  };
}

export function fetchHeroContentSuccess(items: Array<HeroContentItem>) {
  return {
    type: FETCH_HERO_ITEMS_SUCCESS,
    items: items,
    receivedAt: Date.now()
  };
}

export function fetchHeroContentFailed(error: ResponseError) {
  return {
    type: FETCH_HERO_ITEMS_FAILED,
    error: error
  };
}

export function validateHeroContent() {
  return {
    type: VALIDATE_HERO_ITEMS,
    now: Date.now()
  };
}

// async actions
export function fetchHeroContent() {
  return (dispatch: (action: any) => any) => {
    dispatch(requestHeroContent());
    return fetchJSON(HeroContentUrl)
      .then((items: Array<HeroContentItem>) => dispatch(fetchHeroContentSuccess(items)))
      .catch((error: ResponseError) => dispatch(fetchHeroContentFailed(error)));
  }
}

// reducer
const initialState = {
  isFetching: false,
  lastUpdated: <Date>null,
  items: <Array<HeroContentItem>>[]
}

function mergeHeroContent(actionItems: Array<HeroContentItem>, stateItems: Array<HeroContentItem>) {
  return actionItems.filter((i) => stateItems.findIndex((si) => i.id == si.id) == -1).concat(stateItems);
}

function isCurrent(alert: HeroContentItem) {
  return Date.parse(alert.utcDateEnd) < Date.now();
}

export default function reducer(state: any = initialState, action: any = {}) {
  switch(action.type) {
    case FETCH_HERO_ITEMS:
      return Object.assign({}, state, {
        isFetching: true
      });
    case FETCH_HERO_ITEMS_SUCCESS:
      return Object.assign({}, state, {
        isFetching: false,
        lastUpdated: action.receivedAt,
        items: mergeHeroContent(action.items, state.items)
      });
    case FETCH_HERO_ITEMS_FAILED:
      return Object.assign({}, state, {
        isFetching: false,
        error: action.error
      });
    case VALIDATE_HERO_ITEMS:
      return Object.assign({}, state, {
        items: state.items.filter((a: HeroContentItem) => Date.parse(a.utcDateEnd) > action.now)
      });
    default: return state;
  }
}

