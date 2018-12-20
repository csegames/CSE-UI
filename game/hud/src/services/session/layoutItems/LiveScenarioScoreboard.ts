/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { LayoutMode, Edge } from 'components/HUDDrag';
import LiveScenarioScoreboard from 'components/LiveScenarioScoreboard';
import HUDZOrder from 'services/session/HUDZOrder';

export default {
  position: {
    x: {
      anchor: 5,
      offset: -130,
    },
    y: {
      anchor: Edge.TOP,
      offset: 0,
    },
    size: {
      width: 260,
      height: 52,
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: HUDZOrder.LiveScenarioScoreboard,
    layoutMode: LayoutMode.GRID,
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true,
  },
  component: LiveScenarioScoreboard,
  props: {},
};
