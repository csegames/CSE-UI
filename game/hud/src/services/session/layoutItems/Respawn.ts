/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import Respawn from 'components/Respawn';
import { LayoutMode } from 'components/HUDDrag';
import HUDZOrder from '../HUDZOrder';

export default {
  position: {
    x: {
      anchor: 5,
      offset: -100,
    },
    y: {
      anchor: 3,
      offset: 0,
    },
    size: {
      width: 200,
      height: 200,
    },
    scale: 1,
    opacity: 1,
    visibility: false,
    zOrder: HUDZOrder.Respawn,
    layoutMode: LayoutMode.GRID,
  },
  dragOptions: {},
  component: Respawn,
  props: {},
};
