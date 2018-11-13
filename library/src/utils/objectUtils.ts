import { assertArrayExpression } from 'babel-types';

/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
export {};

declare global {

  interface Dictionary<T> {
    [id: string]: T;
  }

  function clone<T>(source: T): T;
  function cloneDeep<T>(source: T): T;
  function merge<T>(source: T, ...args: any[]): T;
  function tryParseJSON<T>(json: string, logError: boolean): T;
  interface Window {
    clone<T>(source: T): T;
    cloneDeep<T>(source: T): T;
    merge<T>(source: T, ...args: any[]): T;
    tryParseJSON<T>(json: string, logError: boolean): T;
  }
}

window.clone = function<T>(source: T): T {
  if (Array.isArray(source)) {
    return source.slice() as any;
  }

  if (source !== null && typeof source === 'object') {
    return Object.assign({}, source);
  }

  return source;
};

window.cloneDeep = function<T extends any>(source: T): T {
  if (source == null || typeof source === 'object') {
    return source; // Not a reference
  }

  if (source instanceof Array) {
    return source.slice().map(e => cloneDeep(e)) as any;
  }

  if (source instanceof Date) {
    const date = new Date();
    date.setTime(source.getTime());
    return date as any;
  }

  if (source instanceof Function) {
    const fn = function() {
      return source.apply(this, arguments);
    };
    return fn as any;
  }

  if (source instanceof Object) {
    const copy = {} as T;
    for (const key in source) {
      copy[key] = cloneDeep(source[key]);
    }
    return copy;
  }

  throw new Error(`Unable to clone source. Unsupported type ${source}`);
};

window.merge = function<T>(source: T, ...args: any[]): T {
  return Object.assign({}, source, ...args);
};

window.tryParseJSON = function<T>(json: string, logError: boolean = false): T {
  try {
    return JSON.parse(json);
  } catch (e) {
    if (logError) console.error(`Failed to parse json. | ${json}`);
    return null;
  }
};
