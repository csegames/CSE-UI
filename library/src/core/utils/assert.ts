/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import client from '../client';

declare const window: any;

let debug: boolean;
if (client) {
  debug = client.debug;
} else if (window.patcherAPI) {
  debug = window.patcherAPI.debug;
} else {
  debug = true;
}

// tslint:disable-next-line
export function DEBUG_ASSERT(test: any, reason: string) {
  if (!test && debug) {
    throw new Error('DEBUG_ASSERT: ' + reason);
  }
}

// tslint:disable-next-line
export function RUNTIME_ASSERT(test: any, reason: string) {
  if (!test) {
    throw new Error('RUNTIME_ASSERT: ' + reason);
  }
}
