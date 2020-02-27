/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import gql from 'graphql-tag';
import { utils } from '@csegames/library/lib/_baseGame';
import { GraphQL, GraphQLResult } from '@csegames/library/lib/_baseGame/graphql/react';
import { SubscriptionResult } from '@csegames/library/lib/_baseGame/graphql/subscription';
import { QueryOptions } from '@csegames/library/lib/_baseGame/graphql/query';

import { patcher, ChannelStatus, Channel, PatchChannelMode } from '../../services/patcher';
import { ServerModelFragment } from 'gql/fragments';
import {
  SimpleCharacter,
  ServerModel,
  ControllerContextSubscription,
  ServerUpdateType,
  PatcherAlert,
  ServerStatus,
  Archetype,
  Faction,
  Race,
} from 'gql/interfaces';

export interface ControllerContextQuery {
  shardCharacters: SimpleCharacter[];
  connectedServices: {
    servers: ServerModel[];
  };
}

export enum ServerType {
  CUGAME,
  CUBE,
  CHANNEL,
  COLOSSUS,
  UNKNOWN,
  HIDDEN,
}

// Server interface which the Controller will use for rendering
export interface PatcherServer {
  name: string;
  type: ServerType;
  channelStatus: number;
  available: boolean;
  channelPatchPermissions?: number;
  accessLevel?: AccessType;
  host?: string;
  playerMaximum?: number;
  channelID?: number;
  shardID?: number;
  arthurians?: number;
  tuathaDeDanann?: number;
  vikings?: number;
  max?: number;
  characterCount?: number;
  selectedCharacter?: SimpleCharacter;
  characters?: SimpleCharacter[];
  lastUpdated?: number;
  apiHost: string;
  mode: PatchChannelMode;
}

export function serverTypeToIcon(t: ServerType) {
  switch (t) {
    case ServerType.CUGAME: return 'images/controller/cu-logo.png';
    case ServerType.CUBE: return 'images/controller/cube-logo.png';
    case ServerType.CHANNEL: return 'images/controller/tools-logo.png';
    case ServerType.UNKNOWN: return 'ERROR';
    case ServerType.COLOSSUS: return 'images/colossus/fs-icon.png';
  }
}

export function gqlSimpleCharacterToSimpleCharacter(gqlCharacter: SimpleCharacter): SimpleCharacter {
  const gqlArchetype = gqlCharacter.archetype;
  const gqlRace = gqlCharacter.race;
  const gqlFaction = gqlCharacter.faction;

  const character = {
    ...gqlCharacter,
    archetype: Archetype[gqlArchetype],
    race: Race[gqlRace],
    faction: Faction[gqlFaction],
  };

  return character;
}

export function gqlServerModelToServerModel(gqlServerModel: ServerModel): ServerModel {
  const gqlAccessLevel = gqlServerModel.accessLevel;

  const server = {
    ...gqlServerModel,
    accessLevel: AccessType[gqlAccessLevel],
  };

  return server;
}

export function webAPIServerToPatcherServer(server: ServerModel): PatcherServer {
  const channels = patcher.getAllChannels();
  const channelIndex = utils.findIndexWhere(channels, c => c.channelID === server.channelID);
  const channel = channels[channelIndex];

  return merge({
    name: server.name,
    available: (server.status as any) === ServerStatus.Online,
    type: getServerTypeFromChannel(channel.channelID, ServerType.CUGAME),
    channelStatus: channel ? channel.channelStatus : ChannelStatus.NotInstalled,
    apiHost: server.apiHost,
    mode: channel ? channel.mode : PatchChannelMode.Automatic,
  }, server);
}

function getServerTypeFromChannel(channelID: number, defaultsTo: ServerType = ServerType.CHANNEL): ServerType {
  switch (channelID) {
    case 4: return ServerType.CUGAME;
    case 27: return ServerType.CUBE;
    case 1:
    case 6:
    case 10:
    case 11: {
      return ServerType.HIDDEN;
    }
    case 2000:
    case 2100:
    case 2200: {
      return ServerType.COLOSSUS;
    }
    default: return defaultsTo;
  }
}

function channelToPatcherServer(channel: Channel): PatcherServer {
  const type = getServerTypeFromChannel(channel.channelID);
  return {
    name: channel.channelName,
    available: type !== ServerType.CUGAME && type !== ServerType.COLOSSUS,
    type,
    channelStatus: channel.channelStatus,
    channelID: channel.channelID,
    channelPatchPermissions: 4, // CSE only default
    apiHost: 'https://api.camelotunchained.com',
    lastUpdated: channel.lastUpdated || 0,
    mode: channel.mode,
  };
}

export interface Props {
  loggedIn: boolean;
}

export interface ContextState {
  characters: {[id: string]: SimpleCharacter};
  servers: {[serverName: string]: PatcherServer};
  selectedCharacter: SimpleCharacter;
  selectedServer: PatcherServer;
  patcherAlerts: PatcherAlert[];

  onUpdateState: (state: Partial<ContextState>) => void;
  updateChannels: () => void;
  refetch: () => void;
}

function noOp() {}
export const defaultControllerContextState: ContextState = {
  characters: {},
  servers: {},
  patcherAlerts: [],
  selectedCharacter: null,
  selectedServer: null,

  onUpdateState: noOp,
  updateChannels: noOp,
  refetch: noOp,
};

export const ControllerContext = React.createContext(defaultControllerContextState);

const query = {
  namedQuery: 'patcherControllerContext',
  useNamedQueryCache: true,
  disableBatching: true,
};

const subscription = gql`
  subscription ControllerContextSubscription {
    serverUpdates {
      type
      ... on ServerUpdated {
        server {
          ...ServerModel
        }
      }

      ... on ServerUpdatedAll {
        server {
          ...ServerModel
        }
      }
    }
  }
  ${ServerModelFragment}
`;

export class ControllerContextProvider extends React.Component<Props, ContextState> {
  private graphql: GraphQLResult<ControllerContextQuery>;
  private channelUpdateInterval: number;
  private queryRefetchInterval: number;
  constructor(props: Props) {
    super(props);
    this.state = {
      ...defaultControllerContextState,
      onUpdateState: this.onUpdateState,
      updateChannels: this.updateChannels,
    };
  }

  public render() {
    return (
      <ControllerContext.Provider value={this.state}>
        {this.props.loggedIn &&
          <GraphQL
            query={query}
            onQueryResult={this.handleQueryResult}
            subscription={{
              query: subscription,
              url: () => (patcher.apiHost() + '/graphql').replace('http', 'ws'),
              initPayload: {
                token: patcher.getAccessToken(),
              },
            }}
            subscriptionHandler={this.handleSubscription}
            useConfig={this.getConfig}
          />
        }
        {this.props.children}
      </ControllerContext.Provider>
    );
  }

  public componentDidUpdate(prevProps: Props) {
    if (!prevProps.loggedIn && this.props.loggedIn) {
      this.channelUpdateInterval = window.setInterval(this.updateChannels, 1000);
    }
  }

  public componentWillUnmount() {
    if (this.channelUpdateInterval) {
      window.clearInterval(this.channelUpdateInterval);
      this.channelUpdateInterval = null;
    }

    if (this.queryRefetchInterval) {
      window.clearInterval(this.queryRefetchInterval);
      this.queryRefetchInterval = null;
    }
  }

  private getConfig = () => {
    const queryConf: QueryOptions = {
      url: patcher.apiHost() + '/graphql',
      requestOptions: {
        headers: {
          Authorization: `Bearer ${patcher.getAccessToken()}`,
          CharacterID: '',
        },
      },
      stringifyVariables: false,
      disableBatching: false,
    };

    return {
      queryConf,
      subsConf: null as any,
    };
  }

  private handleQueryResult = (graphql: GraphQLResult<ControllerContextQuery>) => {
    if (!this.queryRefetchInterval) {
      this.graphql = graphql;
      this.queryRefetchInterval = window.setInterval(this.graphql.refetch, 5000);
    }

    if (!graphql.data) return graphql;
    // All logs go out to the console.log file, do this to help debug when characters aren't updating
    console.log('--------- Shard Characters ---------');
    const charactersLog = graphql.data.shardCharacters.map((char) => {
      return `(CharacterID: ${char.id} Name: ${char.name})`;
    });
    console.log(JSON.stringify(charactersLog));

    const characters = this.getCharacters(graphql);
    const servers = this.getServers(graphql, characters);
    this.setState({ characters, servers, refetch: graphql.refetch });
  }

  private handleSubscription = (result: SubscriptionResult<ControllerContextSubscription.Subscription>,
                                data: ControllerContextQuery) => {
    if (!result.data) return data;
    const serverUpdate = result.data.serverUpdates;
    this.handleServerUpdates(serverUpdate);
  }

  private handleServerUpdates = (serverUpdates: ControllerContextSubscription.ServerUpdates) => {
    if (!serverUpdates) return;
    switch (serverUpdates.type) {
      case ServerUpdateType.Updated:
      case ServerUpdateType.UpdatedAll: {
        const servers = { ...this.state.servers };
        servers[serverUpdates.server.name] = webAPIServerToPatcherServer(gqlServerModelToServerModel(serverUpdates.server));
        this.setState({ servers });
        break;
      }

      case ServerUpdateType.UnavailableAll: {
        const servers = { ...this.state.servers };
        Object.keys(servers).forEach((serverName) => {
          servers[serverName] = {
            ...servers[serverName],
            available: false,
          };
        });
        this.setState({ servers });
        break;
      }
    }
  }

  private getCharacters = (graphql: GraphQLResult<ControllerContextQuery>) => {
    const characters: {[id: string]: SimpleCharacter} = {};
    graphql.data.shardCharacters.forEach((character) => {
      characters[character.id] = gqlSimpleCharacterToSimpleCharacter(character);
    });

    return characters;
  }

  private getServers = (graphql: GraphQLResult<ControllerContextQuery>,
                        characters: {[id: string]: SimpleCharacter}) => {
    const servers: {[id: string]: PatcherServer} = { ...this.state.servers };
    graphql.data.connectedServices.servers.forEach((server) => {
      servers[server.name] = webAPIServerToPatcherServer(gqlServerModelToServerModel(server));
    });

    return this.getServersWithCharacterCounts(servers, characters);
  }

  private onUpdateState = (state: Partial<ContextState>) => {
    this.setState((prevState) => {
      return {
        ...prevState,
        ...state,
      };
    });
  }

  private getServersWithCharacterCounts(servers: Dictionary<PatcherServer>,
                                characters: Dictionary<SimpleCharacter>): Dictionary<PatcherServer> {
    // get character count by shardID
    const characterCounts: Dictionary<number> = {};
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

  private updateChannels = () => {
    const channels = patcher.getAllChannels() || [];
    const channelServers: Dictionary<PatcherServer> = {};
    const channelDict: Dictionary<Channel> = {};
    for (let i = 0; i < channels.length; ++i) {
      const c = channels[i];
      // check if we have a server with a matching name to a channel, if not the channel becomes it's own 'server'.
      if (!this.state.servers[c.channelName]) {
        // create a server for this channel
        channelServers[c.channelName] = channelToPatcherServer(c);
      } else {
        // if it's not it's own server add to a dictionary to update servers by channel id
        channelDict[c.channelID] = c;

        // while we're here lets see if we need to update the last updated time
        if (this.state.servers[c.channelName].channelStatus === ChannelStatus.Updating &&
            c.channelStatus === ChannelStatus.Ready) {
          localStorage.setItem(`channel_updated_${c.channelName}`, Date.now().toLocaleString());
        }
      }
    }

    const servers = clone(this.state.servers);
    for (const key in servers) {
      const server = servers[key];
      const channel = channelDict[server.channelID];
      if (channel) {
        servers[key].channelStatus = channelDict[server.channelID].channelStatus;
        servers[key].lastUpdated = channelDict[server.channelID].lastUpdated;
        servers[key].mode = channelDict[server.channelID].mode;
      } else {
        servers[key].channelStatus = ChannelStatus.NotInstalled;
        servers[key].lastUpdated = 0;
        servers[key].mode = PatchChannelMode.Automatic;
      }
    }

    const newServers = {
      ...servers,
      ...channelServers,
    };
    const updatedSelectedServer = this.state.selectedServer ? newServers[this.state.selectedServer.name] : null;
    this.setState({ servers: newServers, selectedServer: updatedSelectedServer });
  }
}
