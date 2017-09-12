/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { SignalRHub } from '../SignalRHub';
import { EventMap } from '../../utils/eventMapper';

// UI EVENT NAMES
export const groupsHubEvents = {
  joined: 'warbands/joined',
  update: 'warbands/update',
  quit: 'warbands/quit',
  abandoned: 'warbands/abandoned',
  memberJoined: 'warbands/memberJoined',
  memberUpdate: 'warbands/memberUpdate',
  memberRemoved: 'warbands/memberRemoved',
  inviteReceived: 'warbands/inviteReceived',
};

export const GROUP_EVENTS_INVITE_RECEIVED = 'groups/inviteReceived';
export const WARBAND_MEMBER_JOINED = 'groups/warbandMemberJoined';
export const WARBAND_MEMBER_REMOVED = 'groups/warbandMemberRemoved';
export const WARBAND_MEMBER_UPDATED = 'groups/warbandMemberUpdated';
export const BATTLEGROUP_MEMBER_JOINED = 'groups/battlegroupMemberJoined';
export const BATTLEGROUP_MEMBER_REMOVED = 'groups/battlegroupMemberRemoved';
export const BATTLEGROUP_MEMBER_UPDATED = 'groups/battlegroupMemberUpdated';

const groupsHubEventsMap: EventMap[] = [
  {
    receive: 'warbandJoined',
    send: groupsHubEvents.joined,
  },
  {
    receive: 'warbandUpdate',
    send: groupsHubEvents.update,
  },
  {
    receive: 'warbandQuit',
    send: groupsHubEvents.quit,
  },
  {
    receive: 'warbandAbandoned',
    send: groupsHubEvents.abandoned,
  },
  {
    receive: 'warbandMemberJoined',
    send: groupsHubEvents.memberJoined,
  },
  {
    receive: 'warbandMemberUpdated',
    send: groupsHubEvents.memberUpdate,
  },
  {
    receive: 'warbandMemberRemoved',
    send: groupsHubEvents.memberRemoved,
  },
  {
    receive: 'warbandInviteReceived',
    send: groupsHubEvents.inviteReceived,
  },
  {
    receive: 'warbandMemberJoined',
    send: WARBAND_MEMBER_JOINED,
  },
  {
    receive: 'warbandMemberRemoved',
    send: WARBAND_MEMBER_REMOVED,
  },
  {
    receive: 'warbandMemberUpdated',
    send: WARBAND_MEMBER_UPDATED,
  },
  {
    receive: 'battlegroupMemberJoined',
    send: BATTLEGROUP_MEMBER_JOINED,
  },
  {
    receive: 'battlegroupMemberRemoved',
    send: BATTLEGROUP_MEMBER_REMOVED,
  },
  {
    receive: 'battlegroupMemberUpdated',
    send: BATTLEGROUP_MEMBER_UPDATED,
  },
];

function invokeIdentify(hub: SignalRHub) {
  hub.invoke('identify', game.accessToken, game.shardID, game.selfPlayerState.characterID)
  .done((success: boolean) => {
    if (!success) {
      if (game.debug) console.log(`groupsHub identify failed.`);
      setTimeout(() => invokeIdentify(hub), 5000);
      return;
    }
    if (game.debug) console.log(`groupsHub identify success!`);
    hub.invoke('invalidate');
  });
}

function onConnected(hub: SignalRHub) {
  if (game.debug) console.log('groupsHub onConnected');
  invokeIdentify(hub);
}

// initialize hub
export default function() {
  if (!game.signalRHost()) return;
  const groupsHub = new SignalRHub('groupsHub', groupsHubEventsMap, { debug: game.debug });
  groupsHub.addEventHandler('connected', onConnected);
  return groupsHub;
}
