/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

export {};

declare global {
  enum SoundEvents {
    PLAY_SCENARIO_END = 777532938,
    PLAY_SCENARIO_RESET = 3722376796,
  }
  interface Window {
    SoundEvents: typeof SoundEvents;
  }
}
enum SoundEvents {
  PLAY_SCENARIO_END = 777532938,
  PLAY_SCENARIO_RESET = 3722376796,
}
window.SoundEvents = SoundEvents;

