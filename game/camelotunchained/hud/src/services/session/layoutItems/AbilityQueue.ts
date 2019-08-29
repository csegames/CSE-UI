/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { LayoutMode } from 'utils/HUDDrag';
import AbilityQueue from 'hud/AbilityQueue';
import HUDZOrder from 'services/session/HUDZOrder';

export default {
  position: {
    x: {
      anchor: 3,
      offset: 50,
    },
    y: {
      anchor: 7,
      offset: -20,
    },
    size: {
      width: 500,
      height: 50,
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: HUDZOrder.AbilityQueue,
    layoutMode: LayoutMode.GRID,
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true,
  },
  component: AbilityQueue,
  props: {},
};
