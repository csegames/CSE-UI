/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import client from '../../core/client';
import * as events  from '../../events';
import { SignalRHub } from '../SignalRHub';
import { eventMapper, EventMap } from '../../utils/eventMapper';

// UI EVENT NAMES
export const GROUP_EVENTS_INVITE_RECEIVED = 'groups/inviteReceived';
export const WARBAND_EVENTS_JOINED = 'warbands/joined';
export const WARBAND_EVENTS_UPDATE = 'warbands/update';
export const WARBAND_EVENTS_QUIT = 'warbands/quit';
export const WARBAND_EVENTS_ABANDONED = 'warbands/abandoned';
export const WARBAND_EVENTS_MEMBERJOINED = 'warbands/memberJoined';
export const WARBAND_EVENTS_MEMBERUPDATE = 'warbands/memberUpdate';
export const WARBAND_EVENTS_MEMBERREMOVED = 'warbands/memberRemoved';
export const WARBAND_EVENTS_INVITERECEIVED = 'warbands/inviteReceived';


const groupsHubEventsMap: EventMap[] = [
  {
    receive: 'inviteReceived',
    send: GROUP_EVENTS_INVITE_RECEIVED,
  },
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
    receive: 'warbandMemberUpdated',
    send: WARBAND_EVENTS_MEMBERUPDATE,
  },
  {
    receive: 'warbandMemberRemoved',
    send: WARBAND_EVENTS_MEMBERREMOVED,
  },
  {
    receive: 'warbandInviteReceived',
    send: WARBAND_EVENTS_INVITERECEIVED,
  },
];

export const groupsHub = new SignalRHub('groupsHub', groupsHubEventsMap, { debug: client.debug });

function invokeIdentify(hub: SignalRHub) {
  hub.invoke('identify', client.loginToken, client.shardID, client.characterID)
  .done((success: boolean) => {
    if (!success) {
      if (client.debug) console.log(`groupsHub identify failed.`);
      setTimeout(() => invokeIdentify(hub), 5000);
      return;
    }
    if (client.debug) console.log(`groupsHub identify success!`);
    hub.invoke('invalidate');
  });
}

function onConnected(hub: SignalRHub) {
  if (client.debug) console.log('groupsHub onConnected');
  invokeIdentify(hub);
}

groupsHub.addEventHandler('connected', onConnected);

export default groupsHub;
