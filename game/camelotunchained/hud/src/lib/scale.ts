/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

export function getScaledValue(uiContext: UIContext, uhdValue: number) {
  const { resolution } = uiContext;
  const scaledValue = resolution.width > 2560 ? uhdValue :
    resolution.width > 1920 ? uhdValue * MID_SCALE :
    uhdValue * HD_SCALE;

  return scaledValue;
}
