/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { LayoutMode, Edge } from 'components/HUDDrag';
import ScenarioJoin, { ScenarioJoinDimensions } from 'widgets/ScenarioJoin';
import HUDZOrder from '../HUDZOrder';

export default {
  position: {
    x: {
      anchor: Edge.LEFT,
      offset: 50,
    },
    y: {
      anchor: Edge.TOP,
      offset: 230,
    },
    size: {
      width: ScenarioJoinDimensions.width,
      height: ScenarioJoinDimensions.height,
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: HUDZOrder.ScenarioJoin,
    layoutMode: LayoutMode.EDGESNAP,
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true,
  },
  component: ScenarioJoin,
  props: {},
};
