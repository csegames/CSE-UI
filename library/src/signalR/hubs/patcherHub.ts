/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-10-12 14:38:35
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-10-12 16:44:03
 */

import {EventMap} from '../../util/eventMapper';
import {SignalRHub} from '../SignalRHub';
import client from '../../core/client';

var warbandEventsMap: EventMap[] = [
  {
    recieve: 'warbandJoined',
    send: 'warbands/joined'
  },{
    recieve: 'warbandUpdate',
    send: 'warbands/update'
  }
];

const patcherHub = new SignalRHub('warbandsHub', warbandEventsMap, {debug: client.debug});

patcherHub.onConnected = function(patcherHub: SignalRHub) {
  patcherHub.invoke('identify', client.loginToken, client.shardID, client.characterID)
    .done((success: boolean) => {
      if (!success) {
        console.log('failed to identify');
        return;
      }
      // invalidate to force a resend of all data to this client
      //hub.server.invalidate();
      patcherHub.invoke('invalidate');
      console.log('identify success');
    });
}

export default patcherHub;
