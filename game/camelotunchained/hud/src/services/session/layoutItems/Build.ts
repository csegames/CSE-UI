/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { Build } from 'hud/Building';
import { LayoutMode } from 'utils/HUDDrag';
import HUDZOrder from '../HUDZOrder';

export default {
  position: {
    x: {
      anchor: 5,
      offset: -400,
    },
    y: {
      anchor: 5,
      offset: -400,
    },
    size: {
      width: 700,
      height: 400,
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: HUDZOrder.Build,
    layoutMode: LayoutMode.GRID,
  },
  dragOptions: {
    scale: false,
    lockHeight: false,
    lockWidth: false,
  },
  component: Build,
  props: {},
};
