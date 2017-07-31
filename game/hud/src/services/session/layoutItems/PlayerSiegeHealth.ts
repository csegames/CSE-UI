/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-23 17:43:58
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-07-31 16:10:43
 */
import { LayoutMode } from '../../../components/HUDDrag';
import SiegeHealth, { HealthFor } from '../../../components/SiegeHealth';

export default {
  position: {
    x: {
      anchor: 3,
      offset: 50,
    },
    y: {
      anchor: 7,
      offset: -75,
    },
    size: {
      width: 200,
      height: 50,
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: 3,
    layoutMode: LayoutMode.GRID,
  },
  dragOptions: {},
  component: SiegeHealth,
  props: {
    for: HealthFor.Self,
  },
};
