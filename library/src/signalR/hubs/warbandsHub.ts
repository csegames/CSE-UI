/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-03-02 15:51:12
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-03-02 15:51:12
 */

import client from '../../core/client';
import {SignalRHub} from '../SignalRHub';

// UI EVENT NAMES
export const WARBAND_EVENTS_JOINED = 'warbands/joined';
export const WARBAND_EVENTS_UPDATE = 'warbands/update';
export const WARBAND_EVENTS_QUIT = 'warbands/quit';
export const WARBAND_EVENTS_ABANDONED = 'warbands/abandoned';
export const WARBAND_EVENTS_MEMBERJOINED = 'warbands/memberJoined';
export const WARBAND_EVENTS_MEMBERUPDATE = 'warbands/memberUpdate';
export const WARBAND_EVENTS_MEMBERREMOVED = 'warbands/memberRemoved';
export const WARBAND_EVENTS_INVITERECEIVED = 'warbands/inviteReceived';

const warbandEventsMap = [
  {
    receive: 'warbandJoined',
    send: WARBAND_EVENTS_JOINED,
  },
  {
    receive: 'warbandUpdate',
    send: WARBAND_EVENTS_UPDATE,
  },
  {
    receive: 'warbandQuit',
    send: WARBAND_EVENTS_QUIT,
  },
  {
    receive: 'warbandAbandoned',
    send: WARBAND_EVENTS_ABANDONED,
  },
  {
    receive: 'warbandMemberJoined',
    send: WARBAND_EVENTS_MEMBERJOINED,
  },
  {
    receive: 'warbandMemberUpdate',
    send: WARBAND_EVENTS_MEMBERUPDATE,
  },
  {
    receive: 'warbandMemberRemoved',
    send: WARBAND_EVENTS_MEMBERREMOVED,
  },
  {
    receive: 'warbandInviteReceived',
    send: WARBAND_EVENTS_INVITERECEIVED,
  }
];

export const warbandsHub = new SignalRHub('warbandsHub', warbandEventsMap, {debug: client.debug});

warbandsHub.onConnected = (hub: SignalRHub) => {
  hub.invoke('identify', client.loginToken, client.shardID, client.characterID)
    .done((success: boolean) => {
      if (!success) {
        if (client.debug) console.warn('WarbandsHub identify failed.');
        // Try again!
        setTimeout(() => hub.onConnected(hub), 5000);
        return;
      }
      // invalidate to force a resend of all data to this client
      hub.invoke('invalidate');
    });
}

export default warbandsHub;
