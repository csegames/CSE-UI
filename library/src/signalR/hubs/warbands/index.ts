/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import client from '../../../core/client';
import events from '../../../events';
import {WarbandMember} from '../../../groups/warbands/WarbandMember';

let didInitialize: boolean = false;

const registerEvents = () => {
  const hub = ($ as any).connection.warbandsHub;
  hub.on('warband', (warbandID: string, warbandName: string) => {
    if (client.debug) {
      console.log(`recieved warband message: ${warbandID}, ${warbandName}`)
    }
    events.fire('warbands/warband', {id: warbandID, name: warbandName});
  });

  hub.on('warbandMember', (member: WarbandMember) => {
    if (client.debug) {
      console.log(`recieved warbandMember message: ${JSON.stringify(member)}`)
    }
    events.fire('warbands/member', member);
  });

  hub.on('warbandInviteReceived', (invite: any) => {
    if (client.debug) {
      console.log(`recieved warband invite message: ${JSON.stringify(invite)}`)
    }
    events.fire('warbands/inviteReceived', invite);
  });
}

/**
 * Un register all events for this hub.
 * **Note** this will un-register all events, so if you've manually registered to an rpc call
 * from outside this module, that will also be unregistered.  It's recommended to just use
 * the events systen rather than signalR directly for handling real-time communication.
 */
const unregisterEvents = () => {
  const hub = ($ as any).connection.warbandsHub;
  hub.off('warband');
  hub.off('warbandMember');
  hub.off('warbandInviteReceived');
}

export const initializeHub = () => {
  if (didInitialize) return;

  const hub = ($ as any).connection.warbandsHub;
  registerEvents();
  ($ as any).connection.hub.start().done(() => {
    hub.server.identify(client.loginToken, client.shardID, client.characterID)
    .done((success: boolean) => {
      if (!success) return;
      // invalidate to force a resend of all data to this client
      hub.server.invalidate();
    });
  })
}

export const reinitializeHub = () => {
  didInitialize = false;
  unregisterEvents();
  initializeHub();
}

export default {
  initializeHub,
  reinitializeHub,
  unregisterEvents
}
