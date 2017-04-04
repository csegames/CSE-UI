/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-23 17:42:47
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-01-23 17:43:31
 */
import { LayoutMode, Edge } from '../../../components/HUDDrag';
import Compass from '../../../components/Compass';

export default {
  position: {
    x: {
      anchor: 5,
      offset: -200
    },
    y: {
      anchor: Edge.TOP,
      offset: 40
    },
    size: {
      width: 400,
      height: 45
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: 7,
    layoutMode: LayoutMode.GRID
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true
  },
  component: Compass,
  props: {}
};
