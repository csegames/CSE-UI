/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { isEqual } from 'lodash';
import { client, utils, signalr, events, webAPI } from '@csegames/camelot-unchained';
import { Module } from 'redux-typed-modules';
import { patcher, Channel, ChannelStatus, PatcherError } from '../../../../services/patcher';

declare const toastr: any;

const PATCHER_HUB_WINDOW_ID = 'patcherHubs';

export interface ControllerState {
  isInitializing: boolean;
  signalRInitialized: boolean;
  alerts: utils.Dictionary<webAPI.PatcherAlert>;
  errors: PatcherError[];
  characters: utils.Dictionary<webAPI.SimpleCharacter>;
  servers: utils.Dictionary<PatcherServer>;
  connectionSlow: boolean;
}

function initialState(): ControllerState {
  return {
    isInitializing: false,
    signalRInitialized: false,
    alerts: {},
    errors: [],
    characters: {},
    servers: {},
    connectionSlow: false,
  };
}

export interface ControllerAction extends utils.BaseAction {
  id?: string;
  alert?: webAPI.PatcherAlert;
  patcherError?: PatcherError;
  server?: webAPI.ServerModel;
  character?: webAPI.SimpleCharacter;
  channels?: Channel[];
}

export enum ServerType {
  CUGAME,
  CUBE,
  CHANNEL,
  UNKNOWN,
}

export function serverTypeToIcon(t: ServerType) {
  switch (t) {
    case ServerType.CUGAME: return 'images/controller/cu-logo.png';
    case ServerType.CUBE: return 'images/controller/cube-logo.png';
    case ServerType.CHANNEL: return 'images/controller/tools-logo.png';
    case ServerType.UNKNOWN: return 'ERROR';
  }
}

// Server interface which the Controller will use for rendering
export interface PatcherServer {
  name: string;
  type: ServerType;
  channelStatus: number;
  available: boolean;
  channelPatchPermissions?: number;
  accessLevel?: webAPI.AccessType;
  host?: string;
  playerMaximum?: number;
  channelID?: number;
  shardID?: number;
  arthurians?: number;
  tuathaDeDanann?: number;
  vikings?: number;
  max?: number;
  characterCount?: number;
  selectedCharacter?: webAPI.SimpleCharacter;
  characters?: webAPI.SimpleCharacter[];
  lastUpdated?: number;
  apiHost: string;
}

// HELPER METHODS
function registerPatcherHubEvents(dispatch: (action: ControllerAction) => any) {
  events.on(signalr.PATCHER_EVENTS_ALERT, (alertJSON: string) => {
    const alert = utils.tryParseJSON<webAPI.PatcherAlert>(alertJSON, client.debug);
    if (alert !== null) dispatch(alertReceived(alert));
  });

  events.on(signalr.PATCHER_EVENTS_SERVERUPDATED, (serverJSON: string) => {
    const server = utils.tryParseJSON<webAPI.ServerModel>(serverJSON, client.debug);
    if (server !== null) dispatch(serverUpdate(server));
  });

  events.on(signalr.PATCHER_EVENTS_SERVERUNAVAILABLE, (name: string) => dispatch(serverUnavailable(name)));
}

function registerOtherPatcherHubEvents(dispatch: (action: ControllerAction) => any,
                                        apiHost: string,
                                        controllerState?: ControllerState) {
  if (!window[PATCHER_HUB_WINDOW_ID] || !window[PATCHER_HUB_WINDOW_ID].hubs ||
      !window[PATCHER_HUB_WINDOW_ID].eventListeners) return;

  const characterUpdatedEvent = signalr.getPatcherEventName(apiHost, signalr.PATCHER_EVENTS_CHARACTERUPDATED);
  window[PATCHER_HUB_WINDOW_ID].eventListeners[characterUpdatedEvent] =
    events.on(characterUpdatedEvent, (characterJSON: string) => {
      const character = utils.tryParseJSON<webAPI.SimpleCharacter>(characterJSON, client.debug);
      if (character !== null) {
        if (controllerState && isEqual(controllerState.characters[character.id], character)) {
          // No need to update character if already equal to what we have in state.
          return;
        }

        // Update character
        dispatch(characterUpdate(character));
      }
    });

  const characterRemovedEvent = signalr.getPatcherEventName(apiHost, signalr.PATCHER_EVENTS_CHARACTERREMOVED);
  window[PATCHER_HUB_WINDOW_ID].eventListeners[characterRemovedEvent] =
    events.on(signalr.getPatcherEventName(apiHost, signalr.PATCHER_EVENTS_CHARACTERREMOVED), (id: string) => {
      dispatch(characterRemoved(id));
    });
}

function unregisterOtherPatcherHubEvents(apiHost: string) {
  if (
    !window[PATCHER_HUB_WINDOW_ID] ||
    !window[PATCHER_HUB_WINDOW_ID].hubs ||
    !window[PATCHER_HUB_WINDOW_ID].eventListeners
  ) {
    return;
  }

  const characterUpdatedEvent = signalr.getPatcherEventName(apiHost, signalr.PATCHER_EVENTS_CHARACTERUPDATED);
  events.off(window[PATCHER_HUB_WINDOW_ID].eventListeners[characterUpdatedEvent]);
  window[PATCHER_HUB_WINDOW_ID].hubs.eventListeners[characterUpdatedEvent] = null;

  const characterRemovedEvent = signalr.getPatcherEventName(apiHost, signalr.PATCHER_EVENTS_CHARACTERREMOVED);
  events.off(window[PATCHER_HUB_WINDOW_ID].eventListeners[characterRemovedEvent]);
  window[PATCHER_HUB_WINDOW_ID].hubs.eventListeners[characterRemovedEvent] = null;
}

function webAPIServerToPatcherServer(server: webAPI.ServerModel): PatcherServer {

  const channels = patcher.getAllChannels();
  const channelIndex = utils.findIndexWhere(channels, c => c.channelID === server.channelID);
  const channel = channels[channelIndex];

  return utils.merge({
    name: server.name,
    available: server.playerMaximum > 0,
    type: ServerType.CUGAME,
    channelStatus: channel ? channel.channelStatus : ChannelStatus.NotInstalled,
    apiHost: server.apiHost,
  }, server);
}

function getServerTypeFromChannel(channelID: number): ServerType {
  switch (channelID) {
    default: return ServerType.CHANNEL;
    case 4: case 10: case 11: case 30: case 31: return ServerType.CUGAME;
    case 27: return ServerType.CUBE;
  }
}

function channelToPatcherServer(channel: Channel): PatcherServer {
  const type = getServerTypeFromChannel(channel.channelID);
  return {
    name: channel.channelName,
    available: type !== ServerType.CUGAME,
    type,
    channelStatus: channel.channelStatus,
    channelID: channel.channelID,
    channelPatchPermissions: 4, // CSE only default
    apiHost: 'https://api.camelotunchained.com',
    lastUpdated: channel.lastUpdated || 0,
  };
}

function updateCharacterCounts(
  servers: utils.Dictionary<PatcherServer>,
  characters: utils.Dictionary<webAPI.SimpleCharacter>): utils.Dictionary<PatcherServer> {
  // get character count by shardID
  const characterCounts: utils.Dictionary<number> = {};
  for (const key in characters) {
    const shard = characters[key].shardID;
    if (characterCounts[shard]) {
      characterCounts[shard]++;
    } else {
      characterCounts[shard] = 1;
    }
  }

  for (const key in servers) {
    servers[key].characterCount = characterCounts[servers[key].shardID];
  }
  return servers;
}

// ACTIONS
let channelUpdateInterval: NodeJS.Timer = null;

const module = new Module({
  initialState: initialState(),
  actionExtraData: () => {
    return {
      when: new Date(),
    };
  },
});

function onStartPatcherSignalR(dispatch: (action: ControllerAction) => any) {
  registerPatcherHubEvents(dispatch);
  dispatch(initSignalRSuccess() as ControllerAction);
  dispatch(getChannels());

  // update channel info on a timer...
  if (channelUpdateInterval === null) {
    channelUpdateInterval = setInterval(() => dispatch(getChannels()), 500);
  }
}

async function startPatcherSignalR(dispatch: (action: ControllerAction) => any) {
  const res = await signalr.patcherHub.start();
  if (res !== null) {
    onStartPatcherSignalR(dispatch);
    return true;
  } else {
    // Failed to start signalr connection with patcher api (api.camelotunchained.com)
    toastr.error(
      'We are having techinal difficulties. Try opening the patcher again in a couple minutes.',
      'Oh no!',
      { timeout: 3000 },
    );
    return false;
  }
}

async function fetchServers(): Promise<PatcherServer[]> {
  const res = await webAPI.ServersAPI.GetServersV1(webAPI.defaultConfig);
  let servers = [];

  if (res.ok) {
    servers = JSON.parse(res.data);
  }

  return servers;
}

export function onStartOtherSignalR(dispatch: (action: ControllerAction) => any,
                                    apiHost: string,
                                    controllerState?: ControllerState) {
  registerOtherPatcherHubEvents(dispatch, apiHost, controllerState);
  dispatch(initSignalRSuccess() as ControllerAction);
}

export function onStopOtherSignalR(apiHost: string) {
  unregisterOtherPatcherHubEvents(apiHost);
}

async function startOtherSignalR(dispatch: (action: ControllerAction) => any) {
  const servers = await fetchServers();
  servers.forEach((server) => {
    establishSignalrConnection(dispatch, server.apiHost + '/signalr');

  });
}

function establishSignalrConnection(dispatch: (action: ControllerAction) => any, hostName: string) {
  const hub = signalr.createPatcherHub({ hostName });
  hub.start(false)
    .then((res) => {
      if (res === null) {
        setTimeout(() => establishSignalrConnection(dispatch, hostName), 15000);
      } else {
        onStartOtherSignalR(dispatch, hostName);
        hub.onDisconnected = () => {
          setTimeout(() => establishSignalrConnection(dispatch, hostName), 15000);
        };
      }
    })
    .catch((err) => {
      console.error('---- There was an error trying to establish signalr connection to an api server ----', err);
    });
  updatePatcherHubCache(hostName, hub);
}

function updatePatcherHubCache(apiHost: string, hub: signalr.SignalRHub) {
  if (window[PATCHER_HUB_WINDOW_ID] && window[PATCHER_HUB_WINDOW_ID]['hubs']) {
    window[PATCHER_HUB_WINDOW_ID]['hubs'][apiHost] = hub;
  } else {
    window[PATCHER_HUB_WINDOW_ID] = {
      hubs: {
        [apiHost]: hub,
      },
      eventListeners: {},
    };
  }
}

// Initialize patcher signalr connections
export const initialize = module.createAction({
  type: 'controller/initialize',
  action: () => {
    Object.defineProperty(client, 'accessToken', { get() { return patcher.getAccessToken(); } });
    return (dispatch: (action: ControllerAction) => any) => {
      dispatch(reset() as ControllerAction);
      dispatch(initSignalR() as ControllerAction);
      registerPatcherHubEvents(dispatch);
      dispatch(getChannels());
      // update channel info on a timer...
      if (channelUpdateInterval === null) {
        channelUpdateInterval = setInterval(() => dispatch(getChannels()), 500);
      }

      try {
        // Connect to patcher api server signalr patcher hub
        startPatcherSignalR(dispatch).then((ok) => {
          if (ok) {
            // Connect to other server's signalr pathcer hubs.
            startOtherSignalR(dispatch);
          }
        });
      } catch (e) {
        console.error(e);
        dispatch(initSignalRFailed() as ControllerAction);
      }
    };
  },
});

export const listenForErrors = module.createAction({
  type: 'controller/listen-for-errors',
  action: () => {
    return (dispatch: (action: ControllerAction) => void) => {
      // Listen for patcher errors
      patcher.onError((error: PatcherError) => {
        dispatch(gotPatcherError(error));
      });
    };
  },
});

export const clearError = module.createAction({
  type: 'controller/clear-error',
  action: () => {
    return {};
  },
  reducer: (s) => {
    return { errors: s.errors.slice(1) };
  },
});

export const reset = module.createAction({
  type: 'controller/reset',
  action: () => null,
  reducer: () => initialState(),
});

export const gotPatcherError = module.createAction({
  type: 'controllers/gotPatcherError',
  action: (patcherError: PatcherError) => {
    return { patcherError };
  },
  reducer: (s, a) => {
    return { errors: s.errors.concat(a.patcherError) };
  },
});

export const getChannels = module.createAction({
  type: 'controllers/getChannels',
  action: () => {
    const channels = patcher.getAllChannels() || [];
    return {
      channels,
    };
  },
  reducer: (s, a) => {
    const channelServers: utils.Dictionary<PatcherServer> = {};
    const channelDict: utils.Dictionary<Channel> = {};
    for (let i = 0; i < a.channels.length; ++i) {
      const c = a.channels[i];
      // check if we have a server with a matching name to a channel, if not the channel becomes it's own 'server'.
      if (!s.servers[c.channelName]) {
        // create a server for this channel
        channelServers[c.channelName] = channelToPatcherServer(c);
      } else {
        // if it's not it's own server add to a dictionary to update servers by channel id
        channelDict[c.channelID] = c;

        // while we're here lets see if we need to update the last updated time
        if (s.servers[c.channelName].channelStatus === ChannelStatus.Updating && c.channelStatus === ChannelStatus.Ready) {
          localStorage.setItem(`channel_updated_${c.channelName}`, a.when.toLocaleString());
        }
      }
    }

    const servers = utils.clone(s.servers);
    for (const key in servers) {
      const server = servers[key];
      const channel = channelDict[server.channelID];
      if (channel) {
        servers[key].channelStatus = channelDict[server.channelID].channelStatus;
        servers[key].lastUpdated = channelDict[server.channelID].lastUpdated;
      } else {
        servers[key].channelStatus = ChannelStatus.NotInstalled;
        servers[key].lastUpdated = 0;
      }
    }

    return {
      servers: utils.merge(servers, channelServers),
    };
  },
});

///////////////////////////////
// ALERTS
///////////////////////////////

export const alertReceived = module.createAction({
  type: 'controller/alertReceived',
  action: (alert: webAPI.PatcherAlert) => {
    return {
      alert,
    };
  },
  reducer: (s, a) => {
    const alerts = utils.clone(s.alerts);
    alerts[a.alert.id] = a.alert;
    return {
      alerts,
    };
  },
});

export const alertExpired = module.createAction({
  type: 'controller/alertExpired',
  action: (id: string) => {
    return {
      id,
    };
  },
  reducer: (s, a) => {
    const alerts = utils.clone(s.alerts);
    delete alerts[a.id];
    return {
      alerts,
    };
  },
});

///////////////////////////////
// SIGNALR
///////////////////////////////

export const initSignalR = module.createAction({
  type: 'controller/initSignalr',
  action: () => null,
  reducer: (s, a) => {
    return {
      isInitializing: true,
      signalRInitialized: false,
    };
  },
});

export const initSignalRSuccess = module.createAction({
  type: 'controller/initSignalrSuccess',
  action: () => null,
  reducer: (s, a) => {
    return {
      isInitializing: false,
      signalRInitialized: false,
    };
  },
});

export const initSignalRFailed = module.createAction({
  type: 'controller/initSignalrFailed',
  action: () => null,
  reducer: (s, a) => {
    return {
      isInitializing: false,
      signalRInitialized: false,
    };
  },
});

export const serverUpdate = module.createAction({
  type: 'controller/serverUpdate',
  action: (server: webAPI.ServerModel) => {
    return {
      server,
    };
  },
  reducer: (s, a) => {
    if (a.server.name === 'localhost') return {};
    const servers = utils.clone(s.servers);
    servers[a.server.name] = utils.merge(servers[a.server.name], webAPIServerToPatcherServer(a.server));
    return {
      servers,
    };
  },
});

export const serverUnavailable = module.createAction({
  type: 'controller/serverUnavailable',
  action: (id: string) => {
    return {
      id,
    };
  },
  reducer: (s, a) => {
    const servers = utils.clone(s.servers);
    servers[a.id].available = false;
    return {
      servers,
    };
  },
});

export const characterUpdate = module.createAction({
  type: 'controller/characterUpdate',
  action: (character: webAPI.SimpleCharacter) => {
    return {
      character,
    };
  },
  reducer: (s, a) => {
    if (s && isEqual(s.characters[a.character.id], a.character)) {
      return;
    }
    const characters = utils.clone(s.characters);
    characters[a.character.id] = a.character;
    const servers = updateCharacterCounts(utils.clone(s.servers), characters);
    return {
      characters,
      servers,
    };
  },
});

export const characterRemoved = module.createAction({
  type: 'controller/characterRemoved',
  action: (id: string) => {
    return {
      id,
    };
  },
  reducer: (s, a) => {
    const characters = utils.clone(s.characters);
    delete characters[a.id];
    const servers = updateCharacterCounts(utils.clone(s.servers), characters);
    return {
      characters,
      servers,
    };
  },
});


export const reducer = module.createReducer();
export default reducer;
