/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { LayoutMode } from 'utils/HUDDrag';
import { Respawn, RespawnDimensions } from 'hud/Respawn';
import HUDZOrder from 'services/session/HUDZOrder';

export default {
  position: {
    x: {
      anchor: 5,
      offset: -(RespawnDimensions.width / 2),
    },
    y: {
      anchor: 5,
      offset: -(RespawnDimensions.height / 2) - 100,
    },
    xUHD: {
      anchor: 5,
      offset: -(RespawnDimensions.widthUHD / 2),
    },
    yUHD: {
      anchor: 5,
      offset: -(RespawnDimensions.heightUHD / 2) - 100,
    },
    size: {
      width: RespawnDimensions.width,
      height: RespawnDimensions.height,
    },
    sizeUHD: {
      width: RespawnDimensions.widthUHD,
      height: RespawnDimensions.heightUHD,
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: HUDZOrder.Respawn,
    layoutMode: LayoutMode.GRID,
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true,
  },
  component: Respawn,
  props: {},
};
