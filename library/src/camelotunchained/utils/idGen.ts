/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {
  function genID(prefix?: string): string;
  interface Window {
    genID(prefix?: string): string;
  }
}

let last = 0;
function genID(prefix: string = '') {
  const now = Date.now();
  last = now > last ? now : last + 1;
  return (prefix || '') + last.toString(36);
}
window.genID = genID;
