/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { LayoutMode } from '../../../components/HUDDrag';
import SkillBar from '../../../components/SkillBar';
import HUDZOrder from '../HUDZOrder';

export default {
  position: {
    x: {
      anchor: 3,
      offset: 50,
    },
    y: {
      anchor: 9,
      offset: 25,
    },
    size: {
      width: window.innerWidth,
      height: 100,
    },
    opacity: 1,
    visibility: true,
    zOrder: HUDZOrder.SkillBar,
    layoutMode: LayoutMode.GRID,
    scale: 1,
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true,
  },
  component: SkillBar,
  props: {},
};

