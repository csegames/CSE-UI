/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-08-29 17:31:15
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-09-07 17:32:14
 */

export function clone<T>(obj: T): T {
  return Object.assign({}, obj);
}

export function cloneArray<T>(array: T[]): T[] {
  return array.slice();
}

export function merge<T>(obj: T, ...args: any[]): T {
  return Object.assign({}, obj, ...args);
}

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
  when: null
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


export interface Dictionary<value> {
  [id: string]: value
}

function defaultCompare<T>(a: T, b: T): boolean {
  return a === b;
}

export function findIndexWhere<T>(arr: T[], predicate: (a: T) => boolean): number {
  if (!arr) return -1;
  let i = arr.length;
  while(--i >= 0) {
    if (predicate(arr[i])) return i;
  }
  return -1;
}

export function findIndex<T>(arr: T[], obj: T, equals: (a: T, b: T) => boolean = defaultCompare): number {
  if (!arr) return -1;
  let i = arr.length;
  while(--i >= 0) {
    if (equals(obj, arr[i])) return i;
  }
  return -1;
}

export function addOrUpdate<T>(arr: T[], obj: T, equals: (a: T, b: T) => boolean = defaultCompare): T[] {
  const copy = !arr ? [] : arr.slice();
  let index = findIndex(copy, obj, equals);
  if (index >= 0) {
    copy[index] = obj;
  } else {
    copy.push(obj);
  }
  return copy;
}

export function remove<T>(arr: T[], obj: T, equals: (a: T, b: T) => boolean = defaultCompare): T[] {
  if (!(arr && arr.length)) return [];
  const copy = arr.slice();
  let index = findIndex(arr, obj, equals);
  if (index >= 0) {
    copy.slice(index, 1);
  }
  return copy;
}

export function removeWhere<T>(arr: T[], predicate: (o: T) => boolean): {result: T[], removed: T[]} {
  const result: T[] = [];
  const removed: T[] = [];

  if (!(arr && arr.length)) return {result, removed};
  
  let i = result.length;
  while(--i) {
    const o = Array.isArray(result[i]) ? cloneArray(result[i] as any) as any : clone(result[i]);
    if (predicate(o)) {
      removed.push(o)
    } else {
      result.unshift(o);
    }
  }
  
  return {result, removed};
}

// works with arrays of basic types, number, string, boolean
export function simpleMergeUnique<T>( ...arrays: T[] ) 
{
  return [ ...new Set( [].concat( ...arrays ) ) ];
}

export function hashMerge<T>(hashFn: (o: T) => string, ...arrays: T[][]) {
  const map: any = [];
  let i = arrays.length;
  while (--i >= 0) {
    if (!arrays[i]) continue;
    let j = arrays[i].length;
    while(--j >= 0) {
      const hash = hashFn(arrays[i][j]);
      if (!map[hash]) map[hash] = arrays[i][j];
    }
  }
  const result: T[] = [];
  for (var key in map) {
    result.push(map[key]);
  }
  return result;
}


// REDUX MIDDLEWARE

export function loggingMiddleware(store: any) {
  return (next: any) => (action:any) => {
    console.group(`ACTION | ${action.type}`);
    console.log('dispatching', action);
    const result = next(action);
    console.log('next state', store.getState());
    console.groupEnd();
    return result;
  }
}

export function crashReporterMiddleware(store: any) {
  return (next: (action: BaseAction) => BaseAction) => (action: BaseAction) => {
    try {
      return next(action)
    } catch (err) {
      console.error('Caught an exception!', err)
      throw err
    }
  }
}

export function thunkMiddleware(store: any) {
  return (next: any) => (action: any) => {
    return typeof action === 'function' ? action(store.dispatch, store.getState) : next(action);
  }
}
