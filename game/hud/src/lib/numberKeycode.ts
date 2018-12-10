/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { KeyCodes } from '@csegames/camelot-unchained';

export function isNumberKeycode(keycode: number) {
  return keycode === KeyCodes.KEY_Zero ||
    keycode === KeyCodes.KEY_One ||
    keycode === KeyCodes.KEY_Two ||
    keycode === KeyCodes.KEY_Three ||
    keycode === KeyCodes.KEY_Four ||
    keycode === KeyCodes.KEY_Five ||
    keycode === KeyCodes.KEY_Six ||
    keycode === KeyCodes.KEY_Seven ||
    keycode === KeyCodes.KEY_Eight ||
    keycode === KeyCodes.KEY_Nine;
}

export function keycodeToNumber(keycode: number) {
  if (isNumberKeycode(keycode)) {
    switch (keycode) {
      case KeyCodes.KEY_Zero: {
        return 0;
      }
      case KeyCodes.KEY_One: {
        return 1;
      }
      case KeyCodes.KEY_Two: {
        return 2;
      }
      case KeyCodes.KEY_Three: {
        return 3;
      }
      case KeyCodes.KEY_Four: {
        return 4;
      }
      case KeyCodes.KEY_Five: {
        return 5;
      }
      case KeyCodes.KEY_Six: {
        return 6;
      }
      case KeyCodes.KEY_Seven: {
        return 7;
      }
      case KeyCodes.KEY_Eight: {
        return 8;
      }
      case KeyCodes.KEY_Nine: {
        return 9;
      }
    }
  }

  return -1;
}
