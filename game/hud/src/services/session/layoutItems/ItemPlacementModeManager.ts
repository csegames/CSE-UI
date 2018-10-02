/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import ItemPlacementModeManager from 'widgets/ItemPlacementModeManager';
import { LayoutMode } from 'components/HUDDrag';
import HUDZOrder from '../HUDZOrder';

export default {
  position: {
    x: {
      anchor: 2,
      offset: 0,
    },
    y: {
      anchor: 5,
      offset: -100,
    },
    size: {
      width: 300,
      height: 140,
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: HUDZOrder.PlacementMode,
    layoutMode: LayoutMode.GRID,
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true,
  },
  component: ItemPlacementModeManager,
  props: {},
};
