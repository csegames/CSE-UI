/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-09-06 18:32:30
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-09-23 17:05:31
 */

import {faction, archetype, gender, race} from 'camelot-unchained';
import {BaseAction, defaultAction, AsyncAction, merge, hashMerge, FetchStatus, defaultFetchStatus, clone, findIndex, findIndexWhere, addOrUpdate} from '../../../../lib/reduxUtils';
import {patcher, Channel, ChannelStatus} from '../../../../services/patcher';

import api from '../api';
import {axiosResponse} from 'apisauce';

export enum ServerType {
  CUGAME,
  CUBE,
  CHANNEL,
  UNKNOWN
}

export enum AccessType {
  Offline = -1,
  Public = 0,
  Beta3 = 1,
  Beta2 = 2,
  Beta1 = 3,
  Alpha = 4,
  IT = 5,
  CSE = 6,
}

function getServerTypeFromChannel(channelID: number): ServerType {
  switch(channelID) {
    default: return ServerType.CHANNEL;
    case 4: case 10: case 11: return ServerType.CUGAME;
    case 27: return ServerType.CUBE;
  }
}

function getDefaultShardIDForServerName(name: string): number {
  switch(name.toLowerCase()) {
    default: return -1;
    case 'hatchery': return 1;
    case 'wyrmling': return 2;
    case 'wyrmlingprep': return 3;
  }
}

// Server interface which the sidebar will use for rendering
export interface PatcherServer {
  id: number;         // type_channelID_name
  type: ServerType;
  name: string;
  channelID: number;
  channelStatus: number;
  host?: string;
  accessLevel?: AccessType;
  shardID?: number;
  maxPlayers?: number;
  //onlinePlayers?: number[]; // indexed by faction enum -- disabled for now
  selectedCharacter?: SimpleCharacter;
  characters?: SimpleCharacter[];
}

// data structure for characters retrieved from the CU API
export interface SimpleCharacter {
  archetype: archetype;
  faction: faction;
  gender: gender;
  id: string;
  lastLogin: string;
  name: string;
  race: race;
  shardID: number;
}

// data structure for online server retrieved from the CU API
export interface Server {
  accessLevel: AccessType,
  host: string,
  name: string,
  playerMaximum: number,
  channelID: number,
  shardID: number,
  arthurians?: number,
  tuathaDeDanann?: number,
  vikings?: number,
  max?: number,
}

const SELECT_SERVER = 'sidebar/servers/SELECT_SERVER';
const SELECT_CHARACTER = 'sidebar/servers/SELECT_CHARACTER';
const INIT_SERVERS = 'sidebar/servers/FETCH_SERVERS';
const SERVERS_READY = 'sidebar/servers/SERVERS_READY';

const GET_CHANNELS = 'sidebar/servers/GET_CHANNELS';

const FETCH_ONLINE_SERVERS = 'sidebar/servers/FETCH_ONLINE_SERVERS';
const FETCH_ONLINE_SERVERS_SUCCESS = 'sidebar/servers/FETCH_ONLINE_SERVERS_SUCCESS';
const FETCH_ONLINE_SERVERS_FAILED = 'sidebar/servers/FETCH_ONLINE_SERVERS_FAILED';

const FETCH_CHARACTERS = 'sidebar/servers/FETCH_CHARACTERS';
const FETCH_CHARACTERS_SUCCESS = 'sidebar/servers/FETCH_CHARACTERS_SUCCESS';
const FETCH_CHARACTERS_FAILED = 'sidebar/servers/FETCH_CHARACTERS_FAILED';

const CHARACTER_CREATED = 'sidebar/servers/CHARACTER_CREATED';

export interface ServersAction extends BaseAction {
  characters?: SimpleCharacter[];
  servers?: Server[];
  channels?: Channel[];
  server?: PatcherServer;
  character?: SimpleCharacter;
}

export function selectServer(server: PatcherServer): ServersAction {
  return {
    type: SELECT_SERVER,
    when: new Date(),
    server: server,
  };
}

export function selectCharacter(character: SimpleCharacter): ServersAction {
  return {
    type: SELECT_CHARACTER,
    when: new Date(),
    character: character,
  };
}

export function characterCreated(character: SimpleCharacter): ServersAction {
  return {
    type: CHARACTER_CREATED,
    when: new Date(),
    character: character,
  };
}

function updateChannelsAndServers(dispatch: (action: ServersAction | AsyncAction<ServersAction>) => any) {
  dispatch(getChannels());
  dispatch(fetchServers(updateChannelsAndServers));
}

let intervalID: any = null;
export function initServers(interval: number): AsyncAction<ServersAction> {
  return (dispatch: (action: ServersAction | AsyncAction<ServersAction>) => any) => {
    dispatch(initializeServers());
    updateChannelsAndServers(dispatch);
  };
}



export function stopServersInterval() {
  if (intervalID) clearInterval(intervalID);
  intervalID = null;
}

// INTERNALS

function initializeServers(): ServersAction {
  return {
    type: INIT_SERVERS,
    when: new Date(),
  };
}

function serversReady(): ServersAction {
  return {
    type: SERVERS_READY,
    when: new Date(),
  };
}

// get channels from patch client
function getChannels(): ServersAction {
  const channels = patcher.getAllChannels() || [];
  return {
    type: GET_CHANNELS,
    when: new Date(),
    channels: channels,
  };
}


// get online servers from cu web API
function fetchServers(onSuccess: any): AsyncAction<ServersAction> {
  return (dispatch: (action: ServersAction | AsyncAction<ServersAction>) => any) => {
    dispatch(beginFetchServers());
    api.fetchServers()
      .then((response: axiosResponse) => {
        dispatch(fetchServersSuccess(response.data));
        dispatch(fetchCharacters());
        dispatch(serversReady());
        setTimeout(() => onSuccess(dispatch), 5000);
      })
      .catch((error: any) => dispatch(fetchServersFailed(error.problem)))
  }
}

function beginFetchServers(): ServersAction {
  return {
    type: FETCH_ONLINE_SERVERS,
    when: new Date(),
  };
}

function fetchServersSuccess(servers: Server[]): ServersAction {
  return {
    type: FETCH_ONLINE_SERVERS_SUCCESS,
    when: new Date(),
    servers: servers,
  };
}

function fetchServersFailed(error: string): ServersAction {
  return {
    type: FETCH_ONLINE_SERVERS_FAILED,
    when: new Date(),
    error: error,
  };
}

// get all characters from cu web API
function fetchCharacters(): AsyncAction<ServersAction> {
  return (dispatch: (action: ServersAction) => any) => {
    dispatch(beginfetchCharacters());
    api.fetchCharacters()
      .then((response: axiosResponse) => dispatch(fetchCharactersSuccess(response.data)))
      .catch((error: any) => dispatch(fetchCharactersFailed(error.problem)))
  }
}

function beginfetchCharacters(): ServersAction {
  return {
    type: FETCH_CHARACTERS,
    when: new Date(),
  };
}

function fetchCharactersSuccess(characters: SimpleCharacter[]): ServersAction {
  return {
    type: FETCH_CHARACTERS_SUCCESS,
    when: new Date(),
    characters: characters,
  };
}

function fetchCharactersFailed(error: string): ServersAction {
  return {
    type: FETCH_CHARACTERS_FAILED,
    when: new Date(),
    error: error,
  };
}

// Helper functions
let idGen: number = 0;

const CUBE_CHANNEL = 27;
const HATCHERY_CHANNEL = 4;
const WYRMLING_CHANNEL = 10;
const WYRMLINGPREP_CHANNEL = 11;

function defaultChannelAccess(channelID: number): AccessType {
  switch(channelID) {
    // Hatchery
    case 4: return AccessType.IT;
    // CUBE
    case 27: return AccessType.Beta1;
    default: return AccessType.CSE;
  }
}

function apiServersToPatcherServers(patcherServers: PatcherServer[], servers: Server[]): PatcherServer[] {
  const result = [...patcherServers];

  let i = servers.length;
  while (--i >= 0) {
    const s = servers[i];
    let found = false;
    let j = result.length;
    while (!found && --j >= 0) {
      const ps = result[j];
      if (!ps) continue;
      if (ps.name === s.name  && ps.channelID == s.channelID) {
        found = true;
        result[j] = merge(ps, {
          type: ServerType.CUGAME,
          name: s.name,
          channelID: s.channelID,
          host: s.host,
          accessLevel: s.accessLevel,
          shardID: s.shardID,
          maxPlayers: s.playerMaximum,
        });
      }
    }

    if (!found && s.name !== 'localhost') {
      result.push({
        id: ++idGen,
        type: ServerType.CUGAME,
        name: s.name,
        channelID: s.channelID,
        channelStatus: ChannelStatus.NotInstalled,
        host: s.host,
        accessLevel: s.accessLevel,
        shardID: s.shardID,
        maxPlayers: s.playerMaximum,
        selectedCharacter: null,
        characters: []
      });
    }
  }

  return result;
}

function channelsToPatcherServers(patcherServers: PatcherServer[], channels: Channel[]): PatcherServer[] {
  const result = [...patcherServers];
  let i = channels.length;
  while (--i >= 0) {
    const c = channels[i];
    let found = false;
    let j = result.length;
    while (--j >= 0) {
      const ps = result[j];
      if (!ps) continue;
      if (ps.name === c.channelName && c.channelID) {
        found = true;
        result[j] = merge(ps, {
          type: getServerTypeFromChannel(c.channelID),
          name: c.channelName,
          channelID: c.channelID,
          channelStatus: c.channelStatus,
          shardID: ps.shardID || getDefaultShardIDForServerName(c.channelName),
        });
      } else if (ps.channelID === c.channelID) {
        result[j].channelStatus = c.channelStatus;
      }
    }

    if (!found) {
      result.push({
        id: ++idGen,
        type: getServerTypeFromChannel(c.channelID),
        name: c.channelName,
        channelID: c.channelID,
        channelStatus: c.channelStatus,
        accessLevel: defaultChannelAccess(c.channelID),
        shardID: getDefaultShardIDForServerName(c.channelName),
      });
    }
  }

  return result;
}

function characterEquals(a: SimpleCharacter, b: SimpleCharacter): boolean {
  return a.id === b.id;
}

function updateCharactersWithServers(patcherServers: PatcherServer[], characters: SimpleCharacter[]): PatcherServer[] {
  const result = [...patcherServers];

  let i = characters.length;
  while(--i >= 0) {
    const character = clone(characters[i]);

    let serverIndex = result.length;
    while(--serverIndex >= 0) {
      let s = result[serverIndex];
      if (s.shardID === character.shardID) {
        result[serverIndex].characters = addOrUpdate(result[serverIndex].characters, character, characterEquals);
      }
    }
  }

  return result;
}


// reducer
export interface ServersState {
  serversFetchStatus: FetchStatus;
  charactersFetchStatus: FetchStatus;
  ready: boolean;
  servers: PatcherServer[];
  selectedServer: PatcherServer;
}

function getInitialState(): ServersState {
  return {
    serversFetchStatus: defaultFetchStatus,
    charactersFetchStatus: defaultFetchStatus,
    ready: false,
    servers: [],
    selectedServer: null,
  };
}

export default function reducer(state: ServersState = getInitialState(), action: ServersAction = defaultAction): ServersState {
  switch(action.type) {
    default: return state;

    case SELECT_SERVER:
    {
      localStorage.setItem('cse-patcher-last-server-name', action.server.name);
      return merge(state, {
        selectedServer: action.server,
      });
    }

    case SELECT_CHARACTER:
    {
      localStorage.setItem(`cse-patcher-last-character-name-${action.character.shardID}`, action.character.name);

      let servers = clone(state.servers);
      let selectedServer = clone(state.selectedServer);

      const selectedServerIndex = findIndexWhere(state.servers, s => s.name === selectedServer.name);
      servers[selectedServerIndex].selectedCharacter = action.character;
      selectedServer.selectedCharacter = action.character;

      return merge(state, {
        selectedCharacter: action.character,
        servers: servers,
        selectedServer: selectedServer,
      });
    }

    case INIT_SERVERS:
    {
      return merge(state, {
        ready: false,
      });
    }

    case SERVERS_READY:
    {
      return merge(state, {
        ready: true,
      });
    }

    case GET_CHANNELS:
    {
      return merge(state, {
        servers: channelsToPatcherServers(state.servers, action.channels),
      });
    }

    case FETCH_ONLINE_SERVERS:
    {
      const serversStatus = clone(state.serversFetchStatus);
      serversStatus.isFetching = true;
      serversStatus.lastFetchStart = action.when;
      return merge(state, {
        serversFetchStatus: serversStatus
      });
    }

    case FETCH_ONLINE_SERVERS_SUCCESS:
    {
      const serversStatus = clone(state.serversFetchStatus);
      serversStatus.isFetching = false;
      serversStatus.lastFetchSuccess = action.when;

      const servers = apiServersToPatcherServers(state.servers, action.servers);

      let selected = state.selectedServer ? clone(state.selectedServer) : null;
      if (selected) {
        const selectedIndex = findIndexWhere(servers, s => s.name === state.selectedServer.name)
        selected = clone(servers[selectedIndex]);
      } else if (localStorage.getItem('cse-patcher-last-server-name')) {
        const name = localStorage.getItem('cse-patcher-last-server-name');
        const index = findIndexWhere(servers, s => s.name === name);
        selected = clone(servers[index >= 0 ? index : 0]);
      } else {
        selected = clone(servers[0]);
      }

      return merge(state, {
        serversFetchStatus: serversStatus,
        servers: servers,
        selectedServer: selected,
      });
    }

    case FETCH_ONLINE_SERVERS_FAILED:
    {
      const serversStatus = clone(state.serversFetchStatus);
      serversStatus.isFetching = false;
      serversStatus.lastFetchFailed = action.when;
      serversStatus.lastError = action.error;

      return merge(state, {
        serversFetchStatus: serversStatus,
      });
    }

    case FETCH_CHARACTERS:
    {
      const charactersStatus = clone(state.charactersFetchStatus);
      charactersStatus.isFetching = true;
      charactersStatus.lastFetchStart = action.when;
      return merge(state, {
        charactersFetchStatus: charactersStatus
      });
    }

    case FETCH_CHARACTERS_SUCCESS:
    {
      const charactersStatus = clone(state.charactersFetchStatus);
      charactersStatus.isFetching = false;
      charactersStatus.lastFetchSuccess = action.when;

      const servers = updateCharactersWithServers(state.servers, action.characters);
      let selectedServer = state.selectedServer ? clone(servers[findIndexWhere(state.servers, s => s.name === state.selectedServer.name)]) : state.selectedServer;
      if (!selectedServer) {
      } else if (selectedServer.selectedCharacter) {

        const selectedServerIndex = findIndexWhere(state.servers, s => s.name === selectedServer.name);
        const selectedCharacterIndex = findIndexWhere(selectedServer.characters, c => c.name === selectedServer.selectedCharacter.name);
        servers[selectedServerIndex].selectedCharacter = clone(selectedServer.characters[selectedCharacterIndex]);
        selectedServer.selectedCharacter = clone(selectedServer.characters[selectedCharacterIndex]);

      } else if (localStorage.getItem(`cse-patcher-last-character-name-${selectedServer.shardID}`)) {

        const name = localStorage.getItem(`cse-patcher-last-character-name-${selectedServer.shardID}`);
        const selectedServerIndex = findIndexWhere(state.servers, s => s.name === selectedServer.name);
        const selectedCharacterIndex = findIndexWhere(selectedServer.characters, c => c.name === name);
        servers[selectedServerIndex].selectedCharacter = clone(selectedServer.characters[selectedCharacterIndex]);
        selectedServer.selectedCharacter = clone(selectedServer.characters[selectedCharacterIndex]);

      } else {

        const selectedServerIndex = findIndexWhere(state.servers, s => s.name === selectedServer.name);
        const selectedCharacterIndex = findIndexWhere(selectedServer.characters, c => c.name === name);
        const character = selectedCharacterIndex >= 0 ? clone(selectedServer.characters[selectedCharacterIndex]) : null;

        servers[selectedServerIndex].selectedCharacter = character;
        selectedServer.selectedCharacter = character;

      }

      return merge(state, {
        charactersFetchStatus: charactersStatus,
        servers: servers,
        selectedServer: selectedServer,
      });
    }

    case FETCH_CHARACTERS_FAILED:
    {
      const charactersStatus = clone(state.charactersFetchStatus);
      charactersStatus.isFetching = false;
      charactersStatus.lastFetchFailed = action.when;
      charactersStatus.lastError = action.error;

      return merge(state, {
        charactersFetchStatus: charactersStatus,
      });
    }

    case CHARACTER_CREATED:
    {
      let selectedServer = clone(state.selectedServer);
      selectedServer.selectedCharacter = clone(action.character);
      selectedServer.characters.concat(clone(action.character));
      return merge(state, {
        selectedServer: selectedServer,
      });
    }

  }
}
