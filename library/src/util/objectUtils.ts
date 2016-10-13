/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com) 
 * @Date: 2016-10-12 23:56:08 
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-10-12 23:57:04
 */

export function clone<T>(obj: T): T {
  return Object.assign({}, obj);
}

export function merge<T>(obj: T, ...args: any[]): T {
  return Object.assign({}, obj, ...args);
}

export interface Dictionary<value> {
  [id: string]: value
}

export function tryParseJSON<T>(json: string, logError: boolean = false): T {
  try {
    return JSON.parse(json);
  } catch(e) {
    if (logError) console.error(`Failed to parse json. | ${json}`);
    return null;
  }
}
