/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { LayoutMode, Edge } from '../../../components/HUDDrag';
import Inventory from '../../../components/Inventory';
import HUDZOrder from '../HUDZOrder';

export default {
  position: {
    x: {
      anchor: 5,
      offset: 430,
    },
    y: {
      anchor: Edge.TOP,
      offset: 350,
    },
    size: {
      width: 277,
      height: 350,
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: HUDZOrder.Inventory,
    layoutMode: LayoutMode.GRID,
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true,
  },
  component: Inventory,
  props: {},
};
