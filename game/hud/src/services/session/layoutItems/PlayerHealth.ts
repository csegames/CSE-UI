/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-23 17:37:57
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-01-23 17:38:49
 */
import PlayerHealth from '../../../widgets/PlayerHealth';
import { LayoutMode } from '../../../components/HUDDrag';

export default {
  position: {
    x: {
      anchor: 3,
      offset: 0,
    },
    y: {
      anchor: 7,
      offset: 0,
    },
    size: {
      width: 300,
      height: 180,
    },
    scale: 0.6,
    opacity: 1,
    visibility: true,
    zOrder: 2,
    layoutMode: LayoutMode.GRID,
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true,
  },
  component: PlayerHealth,
  props: {},
};
