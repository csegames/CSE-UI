/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import EnemyTargetHealth from 'hud/EnemyTargetHealth';
import { LayoutMode } from 'utils/HUDDrag';
import HUDZOrder from '../HUDZOrder';

export default {
  position: {
    x: {
      anchor: 5,
      offset: 100,
    },
    y: {
      anchor: 4,
      offset: -200,
    },
    size: {
      width: 310,
      height: 58.5,
    },
    sizeUHD: {
      width: 620,
      height: 117,
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: HUDZOrder.EnemyTarget,
    layoutMode: LayoutMode.GRID,
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true,
  },
  component: EnemyTargetHealth,
  props: {},
};
