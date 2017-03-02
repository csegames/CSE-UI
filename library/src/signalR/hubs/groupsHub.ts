/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-09-16 15:29:13
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-03-02 15:56:52
 */

import client from '../../core/client';
import events from '../../events';
import {SignalRHub} from '../SignalRHub';
import {eventMapper, EventMap} from '../../util/eventMapper';

// UI EVENT NAMES
export const GROUP_EVENTS_INVITE_RECEIVED = 'groups/inviteReceived';

const groupsHubEventsMap: EventMap[] = [
  {
    receive: 'inviteReceived',
    send: GROUP_EVENTS_INVITE_RECEIVED,
  }
];

export const groupsHub = new SignalRHub('groupsHub', groupsHubEventsMap, {debug: client.debug});

groupsHub.onConnected = function(hub: SignalRHub) {
  hub.invoke('identify', client.loginToken, client.shardID, client.characterID)
    //hub.server.identify(client.loginToken, client.shardID, client.characterID)
    .done((success: boolean) => {
      if (!success) {
        setTimeout(() => hub.onConnected(hub), 5000);
        return;
      }
    });
}

export default groupsHub;
