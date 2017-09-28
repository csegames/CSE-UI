/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { clone, merge, Dictionary } from './objectUtils';

export interface AsyncAction<T> {
  (dispatch: (action: T | AsyncAction<T>) => any, getState?: () => any): void;
}

export interface BaseAction {
  type: string;
  when: Date;
  error?: string;
}

export const defaultAction: any = {
  type: null,
  when: null,
};

export interface FetchStatus {
  isFetching: boolean;
  lastFetchStart: Date;
  lastFetchSuccess: Date;
  lastFetchFailed: Date;
  lastError: string;
}

export const defaultFetchStatus: FetchStatus = {
  isFetching: false,
  lastFetchStart: null,
  lastFetchSuccess: null,
  lastFetchFailed: null,
  lastError: '',
};

export function loggingMiddleware(store: any) {
  return (next: any) => (action: any) => {
    console.group(`ACTION | ${action.type}`);
    console.log('dispatching', action);
    const result = next(action);
    console.log('next state', store.getState());
    console.groupEnd();
    return result;
  };
}

export function crashReporterMiddleware(store: any) {
  return (next: (action: BaseAction) => BaseAction) => (action: BaseAction) => {
    try {
      return next(action);
    } catch (err) {
      console.error('Caught an exception!', err);
      console.log('state', store.getState());
      throw err;
    }
  };
}

export function thunkMiddleware(store: any) {
  return (next: any) => (action: any) => {
    return typeof action === 'function' ? action(store.dispatch, store.getState) : next(action);
  };
}

export interface Action<STATETYPE> {
  (state: STATETYPE, action: any): STATETYPE;
}

export function createReducer<STATETYPE>(defaultState: STATETYPE,
                         actions: Dictionary<Action<STATETYPE>>): (state: STATETYPE, action: BaseAction) => STATETYPE {
  const actionDefs = clone(actions);
  return (state: STATETYPE = defaultState, action: BaseAction = defaultAction) => {
    const def = actionDefs[action.type];
    if (typeof def === 'undefined' || def === null) return state;
    return def(state, action);
  };
}

export type ActionDefinitions<STATETYPE> = Dictionary<Action<STATETYPE>>;
