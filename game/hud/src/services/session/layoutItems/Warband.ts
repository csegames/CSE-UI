/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import Warband from '../../../widgets/Warband';
import { LayoutMode, Edge } from '../../../components/HUDDrag';
import HUDZOrder from '../HUDZOrder';

export default {
  position: {
    x: {
      anchor: Edge.LEFT,
      offset: -40,
    },
    y: {
      anchor: Edge.TOP,
      offset: -150,
    },
    size: {
      width: 200,
      height: 700,
    },
    scale: 0.6,
    opacity: 1,
    visibility: false,
    zOrder: HUDZOrder.Warband,
    layoutMode: LayoutMode.EDGESNAP,
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true,
  },
  component: Warband,
  props: {},
};
