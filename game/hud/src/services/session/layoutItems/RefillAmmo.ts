/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Mehuge (mehuge@sorcerer.co.uk)
 * @Date: 2017-04-12 20:01:27
 * @Last Modified by: Mehuge (mehuge@sorcerer.co.uk)
 * @Last Modified time: 2017-04-12 23:06:44
 */


import { LayoutMode, Edge } from '../../../components/HUDDrag';
import RefillAmmo from '../../../widgets/RefillAmmo';

export default {
  position: {
    x: {
      anchor: Edge.LEFT,
      offset: 0,
    },
    y: {
      anchor: Edge.TOP,
      offset: 0,
    },
    size: {
      width: 120,
      height: 35,
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: 99,
    layoutMode: LayoutMode.GRID,
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true,
  },
  component: RefillAmmo,
  props: {},
};
