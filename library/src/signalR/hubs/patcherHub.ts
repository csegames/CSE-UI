/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { EventMap } from '../../utils/eventMapper';
import { SignalRHub, ConnectionState } from '../SignalRHub';

const PATCHER_EVENTS_SERVERUPDATED = 'patcher/serverUpdated';
const PATCHER_EVENTS_SERVERUNAVAILABLE = 'patcher/serverUnavailable';
const PATCHER_EVENTS_ALERT = 'patcher/alert';
const PATCHER_EVENTS_CHARACTERREMOVED = 'patcher/characterRemoved';
const PATCHER_EVENTS_CHARACTERUPDATED = 'patcher/characterUpdated';

const PATCHER_LIFETIME_EVENT_STARTING = 'patcher/starting';
const PATCHER_LIFETIME_EVENT_CONNECTIONSLOW = 'patcher/connectionslow';
const PATCHER_LIFETIME_EVENT_RECONNECTING = 'patcher/reconnecting';
const PATCHER_LIFETIME_EVENT_RECONNECTED = 'patcher/reconnected';
const PATCHER_LIFETIME_EVENT_CONNECTING = 'patcher/connecting';
const PATCHER_LIFETIME_EVENT_CONNECTED = 'patcher/connected';
const PATCHER_LIFETIME_EVENT_DISCONNECTED = 'patcher/disconnected';
const PATCHER_LIFETIME_EVENT_IDENTIFIED = 'patcher/identified';
const PATCHER_LIFETIME_EVENT_STATECHANGED = 'patcher/statechanged';

const genericPatcherEventsMap: EventMap[] = [
  {
    receive: 'characterUpdated',
    send: PATCHER_EVENTS_CHARACTERUPDATED,
  },
  {
    receive: 'characterRemoved',
    send: PATCHER_EVENTS_CHARACTERREMOVED,
  },
];

const patcherEventsMap: EventMap[] = [
  ...genericPatcherEventsMap,
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
];

export function getPatcherEventName(apiHostName: string, eventName: string) {
  if (apiHostName === game.signalRHost()) {
    return eventName;
  }

  return `${apiHostName}-${eventName}`;
}

export function createPatcherHub(opts?: { hostName?: string, isMainPatcherHub?: boolean }): SignalRHub {
  const hostName = opts.hostName || game.signalRHost();
  const eventsMap = (opts.isMainPatcherHub ? patcherEventsMap : genericPatcherEventsMap).map((evtMap) => {
    return {
      ...evtMap,
      send: getPatcherEventName(hostName, evtMap.send),
    };
  });
  const newPatcherHub = new SignalRHub(
    'patcherHub',
    eventsMap,
    { debug: game.debug },
    hostName,
  );

  let reconnectTries = 0;

  function invokeIdentify(hub: SignalRHub) {
    hub.invoke('identify', game.accessToken)
      .done((success: boolean) => {
        if (!success) {
          if (game.debug) console.log('PatcherHub identify failed.');
          // Try again!
          setTimeout(() => invokeIdentify(hub), 5000);
          return;
        }
        // invalidate to force a resend of all data to this game
        if (game.debug) console.log('PatcherHub identify success!');
        hub.invoke('invalidate');
        game.trigger(PATCHER_LIFETIME_EVENT_IDENTIFIED, hub);
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
    const evtName = getPatcherEventName(hostName, PATCHER_LIFETIME_EVENT_STARTING);
    game.trigger(evtName, hub);
  };

  newPatcherHub.onConnectionSlow = function(hub: SignalRHub) {
    const evtName = getPatcherEventName(hostName, PATCHER_LIFETIME_EVENT_CONNECTIONSLOW);
    game.trigger(evtName);
  };

  newPatcherHub.onConnected = function(hub: SignalRHub) {
    const evtName = getPatcherEventName(hostName, PATCHER_LIFETIME_EVENT_CONNECTED);
    game.trigger(evtName, hub);
    invokeIdentify(hub);
  };

  newPatcherHub.onReconnecting = function(hub: SignalRHub) {
    const evtName = getPatcherEventName(hostName, PATCHER_LIFETIME_EVENT_RECONNECTING);
    game.trigger(evtName, hub);
  };

  newPatcherHub.onReconnected = function(hub: SignalRHub) {
    const evtName = getPatcherEventName(hostName, PATCHER_LIFETIME_EVENT_RECONNECTED);
    game.trigger(evtName, hub);
  };

  newPatcherHub.onStateChanged = function(hub: SignalRHub, state: { oldState: ConnectionState, newState: ConnectionState }) {
    const evtName = getPatcherEventName(hostName, PATCHER_LIFETIME_EVENT_STATECHANGED);
    game.trigger(evtName, hub, state);
    switch (state.newState) {
      case ConnectionState.Connecting:
        game.trigger(getPatcherEventName(hostName, PATCHER_LIFETIME_EVENT_CONNECTING), hub);
        break;
    }
  };

  newPatcherHub.onDisconnected = function(hub: SignalRHub) {
    const evtName = getPatcherEventName(hostName, PATCHER_LIFETIME_EVENT_DISCONNECTED);
    game.trigger(evtName, hub);
  };

  return newPatcherHub;
}

// init
export default function() {
  if (!game.signalRHost()) return;
  return createPatcherHub({ isMainPatcherHub: true });
}
