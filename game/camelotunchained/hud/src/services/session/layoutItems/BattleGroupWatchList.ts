/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { LayoutMode, Edge } from 'utils/HUDDrag';
import BattleGroupWatchList from 'hud/BattleGroupWatchList';
import HUDZOrder from '../HUDZOrder';

export default {
  position: {
    x: {
      anchor: 0,
      offset: 230,
    },
    y: {
      anchor: Edge.TOP,
      offset: 80,
    },
    size: {
      width: 250,
      height: 250,
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: HUDZOrder.BattleGroups,
    layoutMode: LayoutMode.GRID,
  },
  dragOptions: {
    lockHeight: false,
    lockWidth: false,
  },
  component: BattleGroupWatchList,
  props: {},
};
