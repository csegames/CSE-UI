/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-03-29 15:38:08
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-07-26 12:11:49
 */

import {LayoutMode, Edge} from '../../../components/HUDDrag';
import PlotControl from '../../../components/PlotControl';
import HUDZOrder from '../HUDZOrder';

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
    zOrder: HUDZOrder.PlotControl,
    layoutMode: LayoutMode.GRID,
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true,
  },
  component: PlotControl,
  props: {},
};
