/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { LayoutMode, Edge } from 'components/HUDDrag';
import Building from 'widgets/Building';
import HUDZOrder from '../HUDZOrder';

export default {
  position: {
    x: {
      anchor: Edge.LEFT,
      offset: 0,
    },
    y: {
      anchor: 5,
      offset: 0,
    },
    size: {
      width: window.innerWidth,
      height: window.innerHeight,
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: HUDZOrder.Building,
    layoutMode: LayoutMode.EDGESNAP,
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true,
  },
  component: Building,
  props: {},
};
