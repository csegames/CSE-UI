/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import GameMenu from 'components/GameMenu';
import { GameMenuDimensions } from 'components/GameMenu/';
import { LayoutMode } from 'components/HUDDrag';
import HUDZOrder from '../HUDZOrder';

export default {
  position: {
    x: {
      anchor: 5,
      offset: -(GameMenuDimensions.width / 2),
    },
    y: {
      anchor: 5,
      offset: -(GameMenuDimensions.height / 2) - 100,
    },
    size: {
      width: GameMenuDimensions.width,
      height: GameMenuDimensions.height,
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: HUDZOrder.GameMenu,
    layoutMode: LayoutMode.GRID,
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true,
  },
  component: GameMenu,
  props: {},
};
