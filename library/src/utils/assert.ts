/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {
  function DEBUG_ASSERT(test: any, reason: string): void;
  function ASSERT(test: any, reason: string): void;

  interface Window {
    DEBUG_ASSERT(test: any, reason: string): void;
    ASSERT(test: any, reason: string): void;
  }
}

// tslint:disable-next-line
function DEBUG_ASSERT(test: any, reason: string) {
  if (game.debug && !test) {
    throw new Error(`DEBUG_ASSERT: ${test} | ${reason}`);
  }
}
window.DEBUG_ASSERT = DEBUG_ASSERT;

// tslint:disable-next-line
function ASSERT(test: any, reason: string) {
  if (!test) {
    throw new Error(`ASSERT: ${test} | ${reason}`);
  }
}
window.ASSERT = ASSERT;
