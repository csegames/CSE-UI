/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */


import { LayoutMode } from 'utils/HUDDrag';
import RefillAmmo from 'hud/RefillAmmo';
import HUDZOrder from '../HUDZOrder';

export default {
  position: {
    x: {
      anchor: 9,
      offset: 10,
    },
    y: {
      anchor: 9,
      offset: 40,
    },
    size: {
      width: 120,
      height: 35,
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: HUDZOrder.RefillAmmo,
    layoutMode: LayoutMode.GRID,
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true,
  },
  component: RefillAmmo,
  props: {},
};
