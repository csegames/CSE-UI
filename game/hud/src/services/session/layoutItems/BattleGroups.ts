/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { LayoutMode, Edge } from '../../../components/HUDDrag';
import BattleGroups from '../../../components/BattleGroups';
import HUDZOrder from '../HUDZOrder';

export default {
  position: {
    x: {
      anchor: 0,
      offset: 10,
    },
    y: {
      anchor: Edge.TOP,
      offset: 80,
    },
    size: {
      width: 200,
      height: 300,
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: HUDZOrder.BattleGroupWatchList,
    layoutMode: LayoutMode.GRID,
  },
  dragOptions: {
    lockHeight: false,
    lockWidth: false,
  },
  component: BattleGroups,
  props: {},
};
