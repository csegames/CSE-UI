/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-03-30 12:05:40
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-03-30 16:09:09
 */

import { LayoutMode, Edge } from '../../../components/HUDDrag';
import Building from '../../../widgets/Building';

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
    zOrder: 0,
    layoutMode: LayoutMode.EDGESNAP,
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true,
  },
  component: Building,
  props: {},
};
