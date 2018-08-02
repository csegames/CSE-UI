/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { LayoutMode } from 'components/HUDDrag';
import Crafting from 'widgets/Crafting';
import HUDZOrder from '../HUDZOrder';

export default {
  position: {
    x: {
      anchor: 0,
      offset: 20,
    },
    y: {
      anchor: 0,
      offset: 75,
    },
    size: {
      width: 700,
      height: 550,
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: HUDZOrder.Crafting,
    layoutMode: LayoutMode.GRID,
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true,
  },
  component: Crafting,
  props: {},
};
