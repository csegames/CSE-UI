/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { LayoutMode, Edge } from 'components/HUDDrag';
import { ScenarioButton } from 'widgets/ScenarioButton';
import HUDZOrder from '../HUDZOrder';

export default {
  position: {
    x: {
      anchor: Edge.RIGHT,
      offset: 0,
    },
    y: {
      anchor: Edge.TOP,
      offset: 230,
    },
    size: {
      width: 36,
      height: 36 * 5,         /* must be at least 36 * (max scenarios + 1) */
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
  component: ScenarioButton,
  props: {},
};
