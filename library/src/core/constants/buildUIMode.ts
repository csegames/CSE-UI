/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

enum buildUIMode {
  NOTBUILDING = 0,
  PLACINGPHANTOM = 1,
  PHANTOMPLACED = 2,
  SELECTINGBLOCK = 4,
  BLOCKSELECTED = 8,
}

export default buildUIMode;
