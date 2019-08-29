/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Returns the name of the calling function that called the method where you call
// this method.  (yea, that's not confusing)
export function caller() {
  const regex = new RegExp(/(.+\n.+\n\ +at\ )([a-zA-Z]+)/g);
  return regex.exec(new Error().stack)[2];
}
