/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-23 17:35:03
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-01-25 16:46:50
 */
import Warband from '../../../widgets/Warband';
import { LayoutMode, Edge } from '../../../components/HUDDrag';


export default {
  position: {
    x: {
      anchor: Edge.LEFT,
      offset: -40
    },
    y: {
      anchor: Edge.TOP,
      offset: -150
    },
    size: {
      width: 200,
      height: 700
    },
    scale: 0.6,
    opacity: 1,
    visibility: true,
    zOrder: 4,
    layoutMode: LayoutMode.EDGESNAP
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true,
  },
  component: Warband,
  props: {}
};
