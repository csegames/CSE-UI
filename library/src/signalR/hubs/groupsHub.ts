/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-09-16 15:29:13
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-09-16 16:21:45
 */

import client from '../../core/client';
import events from '../../events';

// GROUPS HUB RPC FUNCTION NAMES
const GROUPS_HUB_INVITE_RECEIVED = 'inviteReceived';

// UI EVENT NAMES
export const GROUP_EVENTS_INVITE_RECEIVED = 'groups/inviteReceived';


const registerEvents = (hub: any) => {

  /**
   * wrapper for hub methods which adds logging of every call if client debug mode is enabled
   */
  const register = (RPCMETHOD: string, callback: any) => {
    if (!hub) return;
    hub.on(RPCMETHOD, (...params:any[]) => {
      if (client.debug) {
        console.group(`SIGNALR | GroupsHub : ${RPCMETHOD}`)
        console.log('params', params);
        console.groupEnd();
      }
      callback(...params);
    });
  }

  /**
   * Called when you receive a new group invite
   */
  register(GROUPS_HUB_INVITE_RECEIVED, (invite: string) => {
    try {
      const i = JSON.parse(invite);
      events.fire(GROUP_EVENTS_INVITE_RECEIVED, i);
    } catch (e) {
      if (client.debug) console.error(`Failed to parse invite: ${invite}`)
    }
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
  hub.off(GROUPS_HUB_INVITE_RECEIVED);
}

/**
 * Initialize the Warband Hub, called internally from the signalR hub registration method
 * -- handles client identification for the Warband Hub.  client information must exist
 *    on the cuAPI / client object (loginToken, shardID, characterID) before this method
 *    is called or identification will fail 
 */
const initializeHub = (callback: (succeeded: boolean) => any) => {

  //const hub = ($ as any).connection.warbandsHub;
  const conn = ($ as any).hubConnection();
  conn.url = 'http://localhost:1337/signalr';
  const hub = conn.createHubProxy('groupsHub');

  registerEvents(hub);
  conn.start().done(() => {
    hub.invoke('identify', client.loginToken, client.shardID, client.characterID)
    //hub.server.identify(client.loginToken, client.shardID, client.characterID)
    .done((success: boolean) => {
      if (!success) {
        callback(false);
        return;
      }
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
  unregisterEvents();
  initializeHub(callback);
}

export default {
  initializeHub,
  reinitializeHub,
  unregisterEvents
}
