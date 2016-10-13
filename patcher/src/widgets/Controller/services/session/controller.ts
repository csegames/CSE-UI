/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com) 
 * @Date: 2016-10-13 00:25:42 
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-11-01 18:13:45
 */

import { client, utils, signalr, events, webAPI } from 'camelot-unchained';
import {patcher, Channel, ChannelStatus} from '../../../../services/patcher';

const INITIALIZE_SIGNALR = 'controller/INITIALIZE_SIGNALR';
const INITIALIZE_SIGNALR_SUCCESS = 'controller/INITIALIZE_SIGNALR_SUCCESS';
const INITIALIZE_SIGNALR_FAILED = 'controller/INITIALIZE_SIGNALR_FAILED';

const ALERT_RECIEVED = 'controller/ALERT_RECIEVED';
const ALERT_EXPIRED = 'controller/ALERT_EXPIRED';

const SERVER_UPDATE = 'controller/SERVER_UPDATE';
const SERVER_UNAVAILABLE = 'controller/SERVER_UNAVAILABLE';

const CHARACTER_UPDATE = 'controller/CHARACTER_UPDATE';
const CHARACTER_REMOVED = 'controller/CHARACTER_REMOVED';

const GET_CHANNELS = 'controller/GET_CHANNELS';

const RESET = 'controller/RESET';

export interface ControllerState {
  isInitializing: boolean;
  signalRInitialized: boolean;
  alerts: utils.Dictionary<webAPI.content.PatcherAlert>;
  characters: utils.Dictionary<webAPI.characters.SimpleCharacter>;
  servers: utils.Dictionary<PatcherServer>;
}

function initialState(): ControllerState {
  return {
    isInitializing: false,
    signalRInitialized: false,
    alerts: {},
    characters: {},
    servers: {},
  };
}

export interface ControllerAction extends utils.BaseAction {
  id?: string;
  alert?: webAPI.content.PatcherAlert;
  server?: webAPI.servers.Server;
  character?: webAPI.characters.SimpleCharacter;
  channels?: Channel[];
}

export enum ServerType {
  CUGAME,
  CUBE,
  CHANNEL,
  UNKNOWN
}

export function serverTypeToString(t: ServerType) {
  switch(t) {
    case ServerType.CUGAME: return 'Camelot Unchained';
    case ServerType.CUBE: return 'C.U.B.E.';
    case ServerType.CHANNEL: return 'Tools';
    case ServerType.UNKNOWN: return 'ERROR';
  }
}

// Server interface which the Controller will use for rendering
export interface PatcherServer {
  name: string,
  type: ServerType;
  channelStatus: number;
  available: boolean;
  accessLevel?: webAPI.servers.ServerAccessLevel,
  host?: string,
  playerMaximum?: number,
  channelID?: number,
  shardID?: number,
  arthurians?: number,
  tuathaDeDanann?: number,
  vikings?: number,
  max?: number,
  characterCount?: number;
  selectedCharacter?: webAPI.characters.SimpleCharacter;
  characters?: webAPI.characters.SimpleCharacter[];
  lastUpdated?: string;
}

// HELPER METHODS
function registerPatcherHubEvents(dispatch: (action: ControllerAction) => any) {
  events.on(signalr.PATCHER_EVENTS_ALERT, (alertJSON: string) => {
    const alert = utils.tryParseJSON<webAPI.content.PatcherAlert>(alertJSON, client.debug);
    if (alert !== null) dispatch(alertRecieved(alert));
  });

  events.on(signalr.PATCHER_EVENTS_SERVERUPDATED, (serverJSON: string) => {
    const server = utils.tryParseJSON<webAPI.servers.Server>(serverJSON, client.debug);
    if (server !== null) dispatch(serverUpdate(server));
  });

  events.on(signalr.PATCHER_EVENTS_SERVERUNAVAILABLE, (name: string) => dispatch(serverUnavailable(name)));

  events.on(signalr.PATCHER_EVENTS_CHARACTERUPDATED, (characterJSON: string) => {
    console.log(characterJSON);
    const character = utils.tryParseJSON<webAPI.characters.SimpleCharacter>(characterJSON, client.debug);
    if (character !== null) dispatch(characterUpdate(character));
  });

  events.on(signalr.PATCHER_EVENTS_CHARACTERREMOVED, (id: string) => dispatch(characterRemoved(id)));
}

function webAPIServerToPatcherServer(server: webAPI.servers.Server): PatcherServer {

  const channels = patcher.getAllChannels();
  const channelIndex = utils.findIndexWhere(channels, c => c.channelID === server.channelID);
  const channel = channels[channelIndex];

  return utils.merge({
    name: server.name,
    available: server.playerMaximum > 0,
    type: ServerType.CUGAME,
    channelStatus: channel ? channel.channelStatus : ChannelStatus.NotInstalled,
  }, server);
}

function getServerTypeFromChannel(channelID: number): ServerType {
  switch(channelID) {
    default: return ServerType.CHANNEL;
    case 4: case 10: case 11: return ServerType.CUGAME;
    case 27: return ServerType.CUBE;
  }
}

function channelToPatcherServer(channel: Channel): PatcherServer {
  const type = getServerTypeFromChannel(channel.channelID);
  return {
    name: channel.channelName,
    available: type !== ServerType.CUGAME,
    type: type,
    channelStatus: channel.channelStatus,
    channelID: channel.channelID,
  };
}

function updateCharacterCounts(servers: utils.Dictionary<PatcherServer>, characters: utils.Dictionary<webAPI.characters.SimpleCharacter>): utils.Dictionary<PatcherServer> {
  // get character count by shardID
  let characterCounts: utils.Dictionary<number> = {};
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
export function initialize(): utils.AsyncAction<ControllerAction> {
  client.loginToken = patcher.getLoginToken();
  return (dispatch: (action: ControllerAction) => any) => {
    dispatch(reset());
    dispatch(initializeSignalR());


    try {
      signalr.patcherHub.start(() => {
        dispatch(initializeSignalRSuccess());
        registerPatcherHubEvents(dispatch);
        dispatch(getChannels())
        // update channel info on a timer...
        if (channelUpdateInterval === null) {
          channelUpdateInterval = setInterval(() => dispatch(getChannels()), 500);
        }
      });
    } catch (e) {
      console.error(e);
      dispatch(initializeSignalRFailed());
    }
  };
}

export function reset(): ControllerAction {
  return {
    type: RESET,
    when: new Date()
  };
}

function initializeSignalR(): ControllerAction {
  return {
    type: INITIALIZE_SIGNALR,
    when: new Date()
  };
}

function initializeSignalRSuccess(): ControllerAction {
  return {
    type: INITIALIZE_SIGNALR_SUCCESS,
    when: new Date()
  };
}

function initializeSignalRFailed(): ControllerAction {
  return {
    type: INITIALIZE_SIGNALR_FAILED,
    when: new Date()
  };
}


const alertTimeouts: utils.Dictionary<NodeJS.Timer> = {};
function alertRecievedDispatcher(alert: webAPI.content.PatcherAlert): utils.AsyncAction<ControllerAction> {
  return (dispatch: (action: ControllerAction) => any) => {
    dispatch(alertRecieved(alert));

    // timeout handles removal of the alert when it expires.
    if (alertTimeouts[alert.id]) {
      // already exists, cancel it
      clearTimeout(alertTimeouts[alert.id]);
    }

    const expiresIn = Date.now() - Date.parse(alert.utcDateEnd);
    alertTimeouts[alert.id] = setTimeout(() => dispatch(alertExpired(alert.id)), expiresIn);
  };
}

function alertRecieved(alert: webAPI.content.PatcherAlert): ControllerAction {
  return {
    type: ALERT_RECIEVED,
    when: new Date(),
    alert: alert
  };
}

function alertExpired(id: string): ControllerAction {
  return {
    type: ALERT_EXPIRED,
    when: new Date(),
    id: id
  };
}

function serverUpdate(server: webAPI.servers.Server): ControllerAction {
  return {
    type: SERVER_UPDATE,
    when: new Date(),
    server: server
  };
}

function serverUnavailable(name: string): ControllerAction {
  return {
    type: SERVER_UNAVAILABLE,
    when: new Date(),
    id: name
  };
}


function characterUpdate(character: webAPI.characters.SimpleCharacter): ControllerAction {
  return {
    type: CHARACTER_UPDATE,
    when: new Date(),
    character: character
  };
}

function characterRemoved(id: string): ControllerAction {
  return {
    type: CHARACTER_REMOVED,
    when: new Date(),
    id: id
  };
}

function getChannels(): ControllerAction {
  const channels = patcher.getAllChannels() || [];
  return {
    type: GET_CHANNELS,
    when: new Date(),
    channels: channels,
  };
}


// REDUCER

const actionDefs: utils.ActionDefinitions<ControllerState> = {};

actionDefs[RESET] = (s, a) => initialState();

actionDefs[INITIALIZE_SIGNALR] = (s, a) => utils.merge(s, { isInitializing: false });
actionDefs[INITIALIZE_SIGNALR_SUCCESS] = (s, a) => utils.merge(s, { isInitializing: false, signalRInitialized: true });
actionDefs[INITIALIZE_SIGNALR_FAILED] = (s, a) => utils.merge(s, { isInitializing: false, signalRInitialized: false });

actionDefs[ALERT_RECIEVED] = function alertRecievedReducer(state: ControllerState, action: ControllerAction): ControllerState {
  const alerts = utils.clone(state.alerts);
  alerts[action.alert.id] = action.alert;
  return utils.merge(state, {
    alerts: alerts
  });
};

actionDefs[ALERT_EXPIRED] = function alertExpiredReducer(state: ControllerState, action: ControllerAction): ControllerState {
  const alerts = utils.clone(state.alerts);
  delete alerts[action.id];
  return utils.merge(state, {
    alerts: alerts
  });
}

actionDefs[SERVER_UPDATE] = function serverUpdateReducer(state: ControllerState, action: ControllerAction): ControllerState {
  if (action.server.name === 'localhost') return state;
  const servers = utils.clone(state.servers);
  servers[action.server.name] = utils.merge(servers[action.server.name], webAPIServerToPatcherServer(action.server));
  return utils.merge(state, {
    servers: servers
  });
}

actionDefs[SERVER_UNAVAILABLE] = function serverUnavailableReducer(state: ControllerState, action: ControllerAction): ControllerState {
  const servers = utils.clone(state.servers);
  servers[action.id].available = false;
  return utils.merge(state, {
    servers: servers
  });
}

actionDefs[CHARACTER_UPDATE] = function characterUpdateReducer(state: ControllerState, action: ControllerAction): ControllerState {
  const characters = utils.clone(state.characters);
  characters[action.character.id] = action.character;
  const servers = updateCharacterCounts(utils.clone(state.servers), characters);
  return utils.merge(state, {
    characters: characters,
    servers: servers
  });
}

actionDefs[CHARACTER_REMOVED] = function characterRemovedReducer(state: ControllerState, action: ControllerAction): ControllerState {
  const characters = utils.clone(state.characters);
  delete characters[action.id];
  const servers = updateCharacterCounts(utils.clone(state.servers), characters);
  return utils.merge(state, {
    characters: characters,
    servers: servers
  });
}

actionDefs[GET_CHANNELS] = function getChannelsReducer(state: ControllerState, action: ControllerAction): ControllerState {

  const channelServers: utils.Dictionary<PatcherServer> = {};
  const channelDict: utils.Dictionary<Channel> = {};
  for (let i = 0; i < action.channels.length; ++i) {
    const c = action.channels[i];
    // check if we have a server with a matching name to a channel, if not the channel becomes it's own 'server'.
    if (!state.servers[c.channelName]) {
      // create a server for this channel
      channelServers[c.channelName] = channelToPatcherServer(c);
      let lastUpdated = localStorage.getItem(`channel_updated_${c.channelName}`);
      if (lastUpdated) {
        channelServers[c.channelName].lastUpdated = lastUpdated;
      }
    } else {
      // if it's not it's own server add to a dictionary to update servers by channel id
      channelDict[c.channelID] = c;

      // while we're here lets see if we need to update the last updated time
      if (state.servers[c.channelName].channelStatus === ChannelStatus.Updating && c.channelStatus === ChannelStatus.Ready) {
        localStorage.setItem(`channel_updated_${c.channelName}`, action.when.toLocaleString());
      }
    }
  }

  const servers = utils.clone(state.servers);
  for (const server in servers) {
    var s = servers[server];
    servers[server].channelStatus = channelDict[s.channelID] ? channelDict[s.channelID].channelStatus : ChannelStatus.Ready;
    servers[server].lastUpdated = channelDict[s.channelID] ? localStorage.getItem(`channel_updated_${channelDict[s.channelID].channelName}`) : undefined;
  }
  
  return utils.merge(state, {
    servers: utils.merge(servers, channelServers)
  });
}

export default utils.createReducer<ControllerState>(initialState(), actionDefs);
