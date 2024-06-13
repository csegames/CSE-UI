/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
export function clone<T>(source: T): T {
  if (Array.isArray(source)) {
    return source.slice() as any;
  }

  if (source !== null && typeof source === 'object') {
    return Object.assign({}, source);
  }

  return source;
}

interface Slicable {
  length: number;
  slice(): any;
}

// attempt to detect coherent arrays which aren't instanceof Array
function isSlicable(value: any): value is Slicable {
  return typeof value.slice == 'function' && typeof value.length == 'number';
}

export function cloneDeep<T extends any>(source: T): T {
  if (source == null || typeof source !== 'object') {
    return source; // Not a reference
  }

  if (source instanceof Array || isSlicable(source)) {
    return source.slice().map((e: any) => cloneDeep(e)) as any;
  }

  if (source instanceof Date) {
    const date = new Date();
    date.setTime(source.getTime());
    return date as any;
  }

  if (source instanceof Function) {
    const fn = function () {
      return source.apply(this, arguments);
    };
    return fn as any;
  }

  if (source instanceof Object) {
    const copy = {} as T;

    for (let key in source) {
      copy[key] = cloneDeep(source[key]);
    }

    return copy;
  }

  throw new Error(`Unable to clone source. Unsupported type ${source}`);
}

export function merge<T extends {}>(source: T, ...args: any[]): T {
  return Object.assign(source, ...args);
}

export function tryParseJSON<T>(json: string, logError: boolean = false): T {
  try {
    return JSON.parse(json);
  } catch (e) {
    if (logError) console.error(`Failed to parse json. | ${json}`);
    return null;
  }
}

export type Pick2<T, K1 extends keyof T, K2 extends keyof T[K1]> = { [P1 in K1]: { [P2 in K2]: T[K1][P2] } };

export type Pick3<T, K1 extends keyof T, K2 extends keyof T[K1], K3 extends keyof T[K1][K2]> = {
  [P1 in K1]: { [P2 in K2]: { [P3 in K3]: T[K1][K2][P3] } };
};
