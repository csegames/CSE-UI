/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

export function spacify(s: string) {
  return s
    .replace(/([^A-Z])([A-Z]+)+/g, '$1 $2')
    .replace(/([^0-9])([0-9]+)/g, '$1 $2')
    .replace(/([A-Z]+)([A-Z])/g, '$1 $2');
}
