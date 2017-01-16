/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-23 17:31:27
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-01-23 17:32:22
 */
import Welcome from '../../../widgets/Welcome';
import { LayoutMode } from '../../../components/HUDDrag';

export default {
  position: {
    x: {
      anchor: 5,
      offset: -400
    },
    y: {
      anchor: 5,
      offset: -400
    },
    size: {
      width: 800,
      height: 600
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: 5,
    layoutMode: LayoutMode.GRID
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true,
  },
  component: Welcome,
  props: {}
};
