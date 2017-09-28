/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export function clone<T>(obj: T): T {
  return Object.assign({}, obj);
}

export function merge<T>(obj: T, ...args: any[]): T {
  return Object.assign({}, obj, ...args);
}

export interface Dictionary<T> {
  [id: string]: T;
}

export function tryParseJSON<T>(json: string, logError: boolean = false): T {
  try {
    return JSON.parse(json);
  } catch (e) {
    if (logError) console.error(`Failed to parse json. | ${json}`);
    return null;
  }
}
