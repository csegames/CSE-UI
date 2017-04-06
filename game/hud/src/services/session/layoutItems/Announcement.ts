/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Date: 2017-03-30 11:15:24
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-04-04 18:40:43
 */

import { LayoutMode, Edge } from '../../../components/HUDDrag';
import Announcement from '../../../components/Announcement';

export default {
  position: {
    x: {
      anchor: 5,
      offset: -293,
    },
    y: {
      anchor: 5,
      offset: -97,
    },
    size: {
      width: 293,
      height: 97,
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: 17,
    layoutMode: LayoutMode.GRID,
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true,
  },
  component: Announcement,
  props: {},
};
