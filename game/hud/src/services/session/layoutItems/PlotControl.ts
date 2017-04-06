/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-03-29 15:38:08
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-03-29 15:40:22
 */

import { LayoutMode, Edge } from '../../../components/HUDDrag';
import PlotControl from '../../../components/PlotControl';

export default {
  position: {
    x: {
      anchor: Edge.LEFT,
      offset: 100,
    },
    y: {
      anchor: Edge.TOP,
      offset: 100,
    },
    size: {
      width: 250,
      height: 250,
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: 14,
    layoutMode: LayoutMode.GRID,
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true,
  },
  component: PlotControl,
  props: {},
};
