/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-03-28 17:04:17
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-04-04 18:55:34
 */

import { LayoutMode, Edge } from '../../../components/HUDDrag';
import ErrorMessages from '../../../components/ErrorMessages';

export default {
  position: {
    x: {
      anchor: Edge.LEFT,
      offset: 0
    },
    y: {
      anchor: Edge.TOP,
      offset: 20
    },
    size: {
      width: 350,
      height: 22
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: 16,
    layoutMode: LayoutMode.GRID
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true
  },
  component: ErrorMessages,
  props: {}
}
