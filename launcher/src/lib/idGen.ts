/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

let last = 0;
export function genID(prefix: string = '') {
  const now = Date.now();
  last = now > last ? now : last + 1;
  return (prefix || '') + last.toString(36);
}
