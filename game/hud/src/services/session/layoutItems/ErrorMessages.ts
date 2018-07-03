/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { LayoutMode, Edge } from 'components/HUDDrag';
import ErrorMessages from 'components/ErrorMessages';
import HUDZOrder from '../HUDZOrder';

export default {
  position: {
    x: {
      anchor: Edge.LEFT,
      offset: 0,
    },
    y: {
      anchor: Edge.TOP,
      offset: 20,
    },
    size: {
      width: 350,
      height: 22,
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: HUDZOrder.ErrorMessages,
    layoutMode: LayoutMode.GRID,
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true,
  },
  component: ErrorMessages,
  props: {},
};
