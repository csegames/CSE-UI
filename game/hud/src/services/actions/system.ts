/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { events } from '@csegames/camelot-unchained';

const SYSTEM_MESSAGE_EVENT = 'system_message';

export function sendSystemMessage(message: string) {
  events.fire(SYSTEM_MESSAGE_EVENT, message);
}

export function onSystemMessage(callback: (message: string) => void) {
  return events.on(SYSTEM_MESSAGE_EVENT, callback);
}

export function offSystemMessage(handle: number) {
  events.off(handle);
}
