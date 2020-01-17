/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export function formatTime(totalSeconds: number) {
  if (typeof totalSeconds !== 'number') return;

  const date = new Date(null);
  date.setSeconds(totalSeconds);

  try {
    return date.toISOString().substr(14, 5);
  } catch (e) {
    console.error(e);
    return '00:00';
  }
}
