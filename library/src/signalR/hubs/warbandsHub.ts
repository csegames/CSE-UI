/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import client from '../../core/client';
import events from '../../events';
import {WarbandMember} from '../../groups/warbands/WarbandMember';

// WARBAND HUB RPC FUNCTION NAMES
const WARBAND_HUB_JOINED = 'warbandJoined';
const WARBAND_HUB_UPDATE = 'warbandUpdate';
const WARBAND_HUB_QUIT = 'warbandQuit';
const WARBAND_HUB_ABANDONED = 'warbandAbandoned';
const WARBAND_HUB_MEMBERJOINED = 'warbandMemberJoined';
const WARBAND_HUB_MEMBERUPDATE = 'warbandMemberUpdate';
const WARBAND_HUB_MEMBERREMOVED = 'warbandMemberRemoved';
const WARBAND_HUB_INVITERECEIVED = 'warbandInviteReceived';

// UI EVENT NAMES
export const WARBAND_EVENTS_JOINED = 'warbands/joined';
export const WARBAND_EVENTS_UPDATE = 'warbands/update';
export const WARBAND_EVENTS_QUIT = 'warbands/quit';
export const WARBAND_EVENTS_ABANDONED = 'warbands/abandoned';
export const WARBAND_EVENTS_MEMBERJOINED = 'warbands/memberJoined';
export const WARBAND_EVENTS_MEMBERUPDATE = 'warbands/memberUpdate';
export const WARBAND_EVENTS_MEMBERREMOVED = 'warbands/memberRemoved';
export const WARBAND_EVENTS_INVITERECEIVED = 'warbands/inviteReceived';

/**
 * Regisers all events for this hub. RPC calls are converted into UI event calls
 * using the UI event emitter system.
 */
const registerEvents = () => {
  const hub = ($ as any).connection.warbandsHub;

  /**
   * use as a default parameter and it will throw an error if the parameter is not provided to a method
   */
  const mandatory = (): any => { throw new Error('Missing Parameter')}

  /**
   * wrapper for hub methods which adds logging of every call if client debug mode is enabled
   */
  const register = (RPCMETHOD: string, callback: any) => {
    hub.on(RPCMETHOD, (...params:any[]) => {
      if (client.debug) console.log(`warband hub called ${RPCMETHOD} with params:\n${JSON.stringify(params)}`);
      callback(...params);
    });
  }

  /**
   * Called when you join a warband.
   * -- Name can be an empty string.
   */
  register(WARBAND_HUB_JOINED, (warbandID: string = mandatory(), warbandName?: string) => {
    events.fire(WARBAND_EVENTS_JOINED, {id: warbandID, name: warbandName});
  });

  /**
   * Called when the warband name is changed or removed
   * -- No name = this thing is temporary, Has name = this thing is permanent
   */
  register(WARBAND_HUB_UPDATE, (warbandID: string, warbandName: string) => {
    events.fire(WARBAND_EVENTS_UPDATE, {id: warbandID, name: warbandName});
  });

  /**
   * Called when you quit a warband.
   */
  register(WARBAND_HUB_QUIT, () => {
    events.fire(WARBAND_EVENTS_QUIT, null);
  });

  /**
   * Called when you abandon a warband.
   */
  register(WARBAND_HUB_ABANDONED, () => {
    events.fire(WARBAND_EVENTS_ABANDONED, null);
  });

  /**
   * Called when a member joins a warband
   * -- could be your own character
   */
  register(WARBAND_HUB_MEMBERJOINED, (member: WarbandMember = mandatory()) => {
    events.fire(WARBAND_EVENTS_MEMBERJOINED, member);
  });

  /**
   * Called when a member is updated, like health changed for example.
   * -- could be your own character
   */
  register(WARBAND_HUB_MEMBERUPDATE, (member: WarbandMember = mandatory()) => {
    events.fire(WARBAND_EVENTS_MEMBERUPDATE, member);
  });

  /**
   * Called when a member is removed from your warband.
   * -- could be your own character
   */
  register(WARBAND_HUB_MEMBERREMOVED, (member: WarbandMember = mandatory()) => {
    events.fire(WARBAND_EVENTS_MEMBERREMOVED, member);
  });

  /**
   * Called when you receive an invite to join a warband
   */
  register(WARBAND_HUB_INVITERECEIVED, (invite: any = mandatory()) => {
    events.fire(WARBAND_EVENTS_INVITERECEIVED, invite);
  });
}

/**
 * Un register all events for this hub.
 * **Note** this will un-register all events, so if you've manually registered to an rpc call
 * from outside this module, that will also be unregistered. I recommended to just use
 * the events systen rather than signalR directly for handling real-time communication.
 */
const unregisterEvents = () => {
  const hub = ($ as any).connection.warbandsHub;
  hub.off(WARBAND_HUB_JOINED);
  hub.off(WARBAND_HUB_UPDATE);
  hub.off(WARBAND_HUB_QUIT);
  hub.off(WARBAND_HUB_ABANDONED);
  hub.off(WARBAND_HUB_MEMBERJOINED);
  hub.off(WARBAND_HUB_MEMBERUPDATE);
  hub.off(WARBAND_HUB_MEMBERREMOVED);
  hub.off(WARBAND_HUB_INVITERECEIVED);
}

/**
 * Used to ensure initializeHub is only called once.
 */
let didInitialize: boolean = false;

/**
 * Initialize the Warband Hub, called internally from the signalR hub registration method
 * -- handles client identification for the Warband Hub.  client information must exist
 *    on the cuAPI / client object (loginToken, shardID, characterID) before this method
 *    is called or identification will fail 
 */
const initializeHub = (callback: (succeeded: boolean) => any) => {
  if (didInitialize) return;

  const hub = ($ as any).connection.warbandsHub;
  registerEvents();
  ($ as any).connection.hub.start().done(() => {
    hub.server.identify(client.loginToken, client.shardID, client.characterID)
    .done((success: boolean) => {
      if (!success) {
        callback(false);
        return;
      }
      // invalidate to force a resend of all data to this client
      hub.server.invalidate();
      callback(true);
    });
  })
}

/**
 * Re-Initialize the Warband Hub, provide a callback which will indicate whether or not the
 * hub has been initialized.
 * 
 * @param {(succeeded: boolean) => any} callback
 */
const reinitializeHub = (callback: (succeeded: boolean) => any) => {
  didInitialize = false;
  unregisterEvents();
  initializeHub(callback);
}

export default {
  initializeHub,
  reinitializeHub,
  unregisterEvents
}
