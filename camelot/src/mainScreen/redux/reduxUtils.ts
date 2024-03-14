/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';

/**
 * If any item in `thingsA` and `thingsB` is unequal (compared in order), `toAdd` will be added to the `delta` object.
 * @param aDelta
 * @param toAdd
 * @param thingsA
 * @param thingsB
 */
export function addIfChanged<T>(
  delta: Partial<T>,
  toAdd: Partial<T>,
  // Long-form types so the intellisense is comprehensible.
  thingsA: (string | number | boolean)[],
  thingsB: (string | number | boolean)[]
) {
  for (let i = 0; i < thingsA.length; ++i) {
    if (thingsA[i] !== thingsB[i]) {
      Object.assign(delta, toAdd);
      break;
    }
  }
}

export function isDictionaryChanged<T>(
  oldDict: Dictionary<T>,
  newDict: Dictionary<T>,
  isDifferent: (a: T, b: T) => boolean = (a: T, b: T) => {
    // Default comparison only really works for basic types.
    return a !== b;
  }
): boolean {
  // If only one is null, there was a change.
  if ((oldDict && !newDict) || (newDict && !oldDict)) {
    return true;
  }

  // Cheapest and most common comparison is to see if the number of entries has changed.
  const oldKeys = Object.keys(oldDict);
  const newKeys = Object.keys(newDict);
  if (oldKeys.length !== newKeys.length) {
    return true;
  }

  // Next we check if any individual values have changed.
  // Using "find" because it automatically ends once the first change is detected.
  const changeDetected =
    oldKeys.find((key) => {
      // If the oldKey is not found in the new keys, something changed.
      // Have to search in the keys in order to handle the case where the key exists but the matching value is 'undefined'.
      if (
        newKeys.find((newKey) => {
          return newKey === key;
        }) === undefined
      ) {
        return true;
      }

      return isDifferent(oldDict[key], newDict[key]);
    }) !== undefined;

  return changeDetected;
}
