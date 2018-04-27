/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import Chat from '@csegames/cu-xmpp-chat';
import { client } from '@csegames/camelot-unchained';
import { LayoutMode, Edge } from '../../../components/HUDDrag';
import HUDZOrder from '../HUDZOrder';

export default {
  position: {
    x: {
      anchor: Edge.LEFT,
      offset: 0,
    },
    y: {
      anchor: Edge.BOTTOM,
      offset: 50,
    },
    size: {
      width: 480,
      height: 240,
    },
    scale: 1,
    opacity: 1,
    visibility: true,
    zOrder: HUDZOrder.Chat,
    layoutMode: LayoutMode.EDGESNAP,
  },
  dragOptions: {},
  component: Chat,
  props: {
    loginToken: client.loginToken,
  },
};
