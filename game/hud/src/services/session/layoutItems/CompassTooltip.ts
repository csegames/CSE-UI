/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { LayoutMode, Edge } from 'components/HUDDrag';
import HUDZOrder from '../HUDZOrder';
import CompassTooltip from 'components/CompassTooltip';

export default {
  position: {
    x: {
      anchor: 5,
      offset: -200,
    },
    y: {
      anchor: Edge.TOP,
      offset: 90,
    },
    size: {
      width: 400,
      height: 160,
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: HUDZOrder.CompassTooltip,
    layoutMode: LayoutMode.GRID,
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: false,
  },
  component: CompassTooltip,
  props: {},
};
