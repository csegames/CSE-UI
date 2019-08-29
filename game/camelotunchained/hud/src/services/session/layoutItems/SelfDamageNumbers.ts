/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { LayoutMode } from 'utils/HUDDrag';
import { SelfDamageNumbers, SELF_DAMAGE_NUMBERS_WIDTH, SELF_DAMAGE_NUMBERS_HEIGHT } from 'hud/SelfDamageNumbers';
import HUDZOrder from 'services/session/HUDZOrder';
import { HD_SCALE } from 'fullscreen/lib/constants';

export default {
  position: {
    x: {
      anchor: 5,
      offset: -((SELF_DAMAGE_NUMBERS_WIDTH * HD_SCALE) / 2),
    },
    y: {
      anchor: 5,
      offset: (SELF_DAMAGE_NUMBERS_HEIGHT / 2) * HD_SCALE,
    },
    xUHD: {
      anchor: 5,
      offset: -(SELF_DAMAGE_NUMBERS_WIDTH / 2),
    },
    yUHD: {
      anchor: 5,
      offset: SELF_DAMAGE_NUMBERS_HEIGHT / 2,
    },
    size: {
      width: SELF_DAMAGE_NUMBERS_WIDTH * HD_SCALE,
      height: SELF_DAMAGE_NUMBERS_HEIGHT * HD_SCALE,
    },
    sizeUHD: {
      width: SELF_DAMAGE_NUMBERS_WIDTH,
      height: SELF_DAMAGE_NUMBERS_HEIGHT,
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: HUDZOrder.SelfDamageNumbers,
    layoutMode: LayoutMode.GRID,
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true,
  },
  component: SelfDamageNumbers,
  props: {},
};
