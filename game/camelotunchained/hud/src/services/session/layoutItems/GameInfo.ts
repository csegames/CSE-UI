/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { LayoutMode } from 'utils/HUDDrag';
import GameInfo, { GameInfoDimensions } from 'hud/GameInfo/';
import HUDZOrder from '../HUDZOrder';

export default {
  position: {
    x: {
      anchor: 5,
      offset: -(GameInfoDimensions.width / 2),
    },
    y: {
      anchor: 5,
      offset: -(GameInfoDimensions.height / 2),
    },
    size: {
      width: GameInfoDimensions.width,
      height: GameInfoDimensions.height,
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: HUDZOrder.GameInfo,
    layoutMode: LayoutMode.GRID,
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true,
  },
  component: GameInfo,
  props: {},
};
