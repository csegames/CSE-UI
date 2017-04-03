/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-03-27 15:59:35
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-03-30 11:35:49
 */

import { LayoutMode, Edge } from '../../../components/HUDDrag';
import EquippedGear from '../../../widgets/EquippedGear';

export default {
  position: {
    x: {
      anchor: 5,
      offset: 127
    },
    y: {
      anchor: Edge.TOP,
      offset: 350
    },
    size: {
      width: 277,
      height: 350
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: 11,
    layoutMode: LayoutMode.GRID
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true
  },
  component: EquippedGear,
  props: {}
}
