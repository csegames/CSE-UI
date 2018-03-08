/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ObjectMap } from './ObjectMap';

export function withDefaults<T extends ObjectMap<any>>(a: Partial<T> | null | undefined, defaults: T) : T {
  if (!a) return defaults;
  const result: T = {} as any;
  for (const key in defaults) {
    (result as any)[key] = a[key] || defaults[key];
  }
  return result;
}
