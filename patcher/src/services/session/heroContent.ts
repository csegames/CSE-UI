/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {Promise} from 'es6-promise';
import 'isomorphic-fetch';

import {BaseAction, defaultAction, FetchStatus, defaultFetchStatus, merge, hashMerge} from '../../lib/reduxUtils';

import ResponseError from '../../lib/ResponseError';
import {fetchJSON} from '../../lib/fetchHelpers';

import {patcher} from '../patcher';

const HeroContentUrl = `${patcher.apiHost()}/patcherherocontent`;

export interface HeroContentItem {
  id: string,
  priority: number,
  content: string,
  utcDateStart: string,
  utcDateEnd: string
}

export interface HeroContentAction extends BaseAction {
  items?: HeroContentItem[];
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

export function fetchHeroContentSuccess(items: HeroContentItem[]): HeroContentAction {
  return {
    type: FETCH_HERO_ITEMS_SUCCESS,
    when: new Date(),
    items: items,
  };
}

export function fetchHeroContentFailed(error: ResponseError): HeroContentAction {
  return {
    type: FETCH_HERO_ITEMS_FAILED,
    when: new Date(),
    error: error.message
  };
}

export function validateHeroContent(): HeroContentAction {
  return {
    type: VALIDATE_HERO_ITEMS,
    when: new Date()
  };
}

// async actions
export function fetchHeroContent() {
  return (dispatch: (action: any) => any) => {
    dispatch(requestHeroContent());
    return fetchJSON(HeroContentUrl)
      .then((items: HeroContentItem[]) => {
        dispatch(fetchHeroContentSuccess(items))
      })
      .catch((error: ResponseError) => dispatch(fetchHeroContentFailed(error)));
  }
}

export interface HeroContentState extends FetchStatus {
  items?: HeroContentItem[];
}

function getInitialState(): HeroContentState {
  return merge(defaultFetchStatus, {
    items: []
  });
}

export default function reducer(state: HeroContentState = getInitialState(), action: HeroContentAction = defaultAction) {
  switch(action.type) {
    default: return state;

    case FETCH_HERO_ITEMS:
      return merge(state, {
        isFetching: true,
        lastFetchStart: action.when,
      });

    case FETCH_HERO_ITEMS_SUCCESS:
    {
      return merge(state, {
        isFetching: false,
        lastFetchSuccess: action.when,
        items: hashMerge((o: HeroContentItem) => o.id, action.items, state.items).sort(function(a, b) {
          const aDate = new Date(a.utcDateStart);
          const bDate = new Date(b.utcDateStart);
          return aDate > bDate ? -1 : aDate < bDate ? 1 : 0;
        }),
      });
    }

    case FETCH_HERO_ITEMS_FAILED:
      return merge(state, {
        isFetching: false,
        lastFetchFailed: action.when,
        lastError: action.error,
      });

    case VALIDATE_HERO_ITEMS:
      return merge(state, {
        items: state.items.filter((a: HeroContentItem) => Date.parse(a.utcDateEnd) > action.when.getDate()),
      });
  }
}

