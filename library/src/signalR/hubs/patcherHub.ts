/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-10-12 14:38:35
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-10-25 15:34:48
 */

import {EventMap} from '../../util/eventMapper';
import {SignalRHub} from '../SignalRHub';
import client from '../../core/client';

export const PATCHER_EVENTS_SERVERUPDATED = 'patcher/serverUpdated';
export const PATCHER_EVENTS_SERVERUNAVAILABLE = 'patcher/serverUnavailable';
export const PATCHER_EVENTS_ALERT = 'patcher/alert';
export const PATCHER_EVENTS_CHARACTERREMOVED = 'patcher/characterRemoved';
export const PATCHER_EVENTS_CHARACTERUPDATED = 'patcher/characterUpdated';

var patcherEventsMap: EventMap[] = [
  {
    recieve: 'serverUpdate',
    send: PATCHER_EVENTS_SERVERUPDATED
  },
  {
    recieve: 'serverUnavailable',
    send: PATCHER_EVENTS_SERVERUNAVAILABLE
  },
  {
    recieve: 'patcherAlert',
    send: PATCHER_EVENTS_ALERT
  },
  {
    recieve: 'characterUpdated',
    send: PATCHER_EVENTS_CHARACTERUPDATED
  },
  {
    recieve: 'characterRemoved',
    send: PATCHER_EVENTS_CHARACTERREMOVED
  }
];

const patcherHub = new SignalRHub('patcherHub', patcherEventsMap, {debug: client.debug});

patcherHub.onConnected = function(hub: SignalRHub) {
  hub.invoke('identify', client.loginToken)
    .done((success: boolean) => {
      if (!success) {
        if (client.debug) console.log('PatcherHub identify failed.');
        // Try again!
        setTimeout(() => hub.onConnected(hub), 5000);
        return;
      }
      // invalidate to force a resend of all data to this client
      hub.invoke('invalidate');
    });
}

export default patcherHub;
