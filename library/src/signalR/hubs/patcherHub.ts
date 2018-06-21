/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { EventMap } from '../../utils/eventMapper';
import { SignalRHub, ConnectionState } from '../SignalRHub';
import { client, events } from '../..';

export const PATCHER_EVENTS_SERVERUPDATED = 'patcher/serverUpdated';
export const PATCHER_EVENTS_SERVERUNAVAILABLE = 'patcher/serverUnavailable';
export const PATCHER_EVENTS_ALERT = 'patcher/alert';
export const PATCHER_EVENTS_CHARACTERREMOVED = 'patcher/characterRemoved';
export const PATCHER_EVENTS_CHARACTERUPDATED = 'patcher/characterUpdated';

export const PATCHER_LIFETIME_EVENT_STARTING = 'patcher/starting';
export const PATCHER_LIFETIME_EVENT_CONNECTIONSLOW = 'patcher/connectionslow';
export const PATCHER_LIFETIME_EVENT_RECONNECTING = 'patcher/reconnecting';
export const PATCHER_LIFETIME_EVENT_RECONNECTED = 'patcher/reconnected';
export const PATCHER_LIFETIME_EVENT_CONNECTING = 'patcher/connecting';
export const PATCHER_LIFETIME_EVENT_CONNECTED = 'patcher/connected';
export const PATCHER_LIFETIME_EVENT_DISCONNECTED = 'patcher/disconnected';
export const PATCHER_LIFETIME_EVENT_IDENTIFIED = 'patcher/identified';
export const PATCHER_LIFETIME_EVENT_STATECHANGED = 'patcher/statechanged';

export const patcherEventsMap: EventMap[] = [
  {
    receive: 'serverUpdate',
    send: PATCHER_EVENTS_SERVERUPDATED,
  },
  {
    receive: 'serverUnavailable',
    send: PATCHER_EVENTS_SERVERUNAVAILABLE,
  },
  {
    receive: 'patcherAlert',
    send: PATCHER_EVENTS_ALERT,
  },
  {
    receive: 'characterUpdated',
    send: PATCHER_EVENTS_CHARACTERUPDATED,
  },
  {
    receive: 'characterRemoved',
    send: PATCHER_EVENTS_CHARACTERREMOVED,
  },
];




export function createPatcherHub(hostName?: string): SignalRHub {
  const newPatcherHub = new SignalRHub('patcherHub', patcherEventsMap, { debug: client.debug }, hostName);

  let reconnectTries = 0;

  function invokeIdentify(hub: SignalRHub) {
    hub.invoke('identify', client.loginToken)
      .done((success: boolean) => {
        if (!success) {
          if (client.debug) console.log('PatcherHub identify failed.');
          // Try again!
          setTimeout(() => invokeIdentify(hub), 5000);
          return;
        }
        // invalidate to force a resend of all data to this client
        if (client.debug) console.log('PatcherHub identify success!');
        hub.invoke('invalidate');
        events.fire(PATCHER_LIFETIME_EVENT_IDENTIFIED, hub);
      })
      .fail(() => {
        setTimeout(() => {
          if (reconnectTries === 5) {
            reconnectTries = 0;
            hub.onStarting(hub);
          }
          reconnectTries++;
          hub.onConnected(hub);
        }, 5000);
      });
  }

  ////////////////////////////////////
  // lifetime events
  ////////////////////////////////////

  newPatcherHub.onStarting = function(hub: SignalRHub) {
    events.fire(PATCHER_LIFETIME_EVENT_STARTING, hub);
  };

  newPatcherHub.onConnectionSlow = function(hub: SignalRHub) {
    events.fire(PATCHER_LIFETIME_EVENT_CONNECTIONSLOW);
  };

  newPatcherHub.onConnected = function(hub: SignalRHub) {
    events.fire(PATCHER_LIFETIME_EVENT_CONNECTED, hub);
    invokeIdentify(hub);
  };

  newPatcherHub.onReconnecting = function(hub: SignalRHub) {
    events.fire(PATCHER_LIFETIME_EVENT_RECONNECTING, hub);
  };

  newPatcherHub.onReconnected = function(hub: SignalRHub) {
    events.fire(PATCHER_LIFETIME_EVENT_RECONNECTED, hub);
  };

  newPatcherHub.onStateChanged = function(hub: SignalRHub, state: { oldState: ConnectionState, newState: ConnectionState }) {
    events.fire(PATCHER_LIFETIME_EVENT_STATECHANGED, hub, state);
    switch (state.newState) {
      case ConnectionState.Connecting:
        events.fire(PATCHER_LIFETIME_EVENT_CONNECTING, hub);
        break;
    }
  };

  newPatcherHub.onDisconnected = function(hub: SignalRHub) {
    events.fire(PATCHER_LIFETIME_EVENT_DISCONNECTED, hub);
  };

  return newPatcherHub;
}

export const patcherHub = createPatcherHub();

export default patcherHub;
