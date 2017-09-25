/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: Andrew Jackson (jacksonal300@gmail.com)
 * @Date: 2017-08-25 10:42:55
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-08-25 10:46:20
 */

import {LayoutMode} from '../../../components/HUDDrag';
import Options, {OptionDimensions} from '../../../components/Options/OptionsMain';
import HUDZOrder from '../HUDZOrder';

export default {
  position: {
    x: {
      anchor: 5,
      offset: -(OptionDimensions.width / 2),
    },
    y: {
      anchor: 5,
      offset: -(OptionDimensions.height / 2),
    },
    size: {
      width: OptionDimensions.width,
      height: OptionDimensions.height,
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: HUDZOrder.Inventory,
    layoutMode: LayoutMode.GRID,
  },
  dragOptions: {
    lockHeight: true,
    lockWidth: true,
  },
  component: Options,
  props: {},
};
