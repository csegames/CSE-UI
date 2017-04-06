/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-01-23 17:43:58
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-01-23 17:44:41
 */
import Chat from 'cu-xmpp-chat';
import { client } from 'camelot-unchained';
import { LayoutMode, Edge } from '../../../components/HUDDrag';

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
    zOrder: 1,
    layoutMode: LayoutMode.EDGESNAP,
  },
  dragOptions: {},
  component: Chat,
  props: {
    loginToken: client.loginToken,
  },
};
