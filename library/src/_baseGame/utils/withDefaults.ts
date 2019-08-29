/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {
  function withDefaults<T extends ObjectMap<any>>(a: Partial<T> | null | undefined, defaults: T, createNew?: boolean): T;
  function toDefault<T extends ObjectMap<any>>(original: Partial<T>, defaults: T): T;
  interface Window {
    withDefaults<T extends ObjectMap<any>>(a: Partial<T> | null | undefined, defaults: T, createNew?: boolean): T;
    toDefault<T extends ObjectMap<any>>(original: Partial<T>, defaults: T): T;
  }
}

function withDefaults<T extends ObjectMap<any>>(a: Partial<T> | null | undefined,
  defaults: T, createNew: boolean = true): T {
  if (!a) return defaults;

  const result: T = createNew || a === null || typeof a === 'undefined' ? {} as any : a;
  if (createNew) {
    for (const key in a) {
      result[key] = a[key];
    }
  }

  for (const key in defaults) {
    if (typeof result[key] === 'undefined') {
      result[key] = defaults[key];
    }
  }
  return result;
}
window.withDefaults = withDefaults;


function toDefault<T extends ObjectMap<any>>(original: Partial<T>, defaults: T): T {
  for (const key in defaults) {
    original[key] = defaults[key];
  }
  return original as T;
}
window.toDefault = toDefault;
