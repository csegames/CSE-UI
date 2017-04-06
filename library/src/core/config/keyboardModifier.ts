/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

enum keyboardModifier {
  NONE = 0,
  CTRL = 1 << 0,
  ALT = 1 << 1,
  SHIFT = 1 << 2,
}

export default keyboardModifier;
