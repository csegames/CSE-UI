/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { WarbandDisplay } from 'hud/WarbandDisplay';
import { LayoutMode, Edge } from 'utils/HUDDrag';
import HUDZOrder from '../HUDZOrder';

export default {
  position: {
    x: {
      anchor: Edge.LEFT,
      offset: 0,
    },
    y: {
      anchor: Edge.TOP,
      offset: 125,
    },
    size: {
      width: 350,
      height: 425,
    },
    sizeUHD: {
      width: 700,
      height: 850,
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: HUDZOrder.Warband,
    layoutMode: LayoutMode.EDGESNAP,
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true,
  },
  component: WarbandDisplay,
  props: {},
};
