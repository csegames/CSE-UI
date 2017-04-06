/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/**
 * These are needed by the C++ Layer to know which build variables
 * to send to the window.
 */
enum configCategory {
  KEYBIND_MOVEMENT = 0,
  KEYBIND_COMBAT = 1,
  KEYBIND_BUILDING = 3,
  KEYBIND_INTERFACE = 4,
  KEYBIND_UTILITY = 5,
  AUDIO_PRIMARY = 6,
  VIDEO_PRIMARY = 7,
  GAME_PRIMARY = 8,
}

export default configCategory;
