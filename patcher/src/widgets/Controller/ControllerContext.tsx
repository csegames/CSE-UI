/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import gql from 'graphql-tag';
import { client, webAPI, utils } from '@csegames/camelot-unchained';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { SubscriptionResult } from '@csegames/camelot-unchained/lib/graphql/subscription';
import { QueryOptions } from '@csegames/camelot-unchained/lib/graphql/query';
import { patcher, ChannelStatus, Channel, PatchChannelMode } from '../../services/patcher';
import { PatcherCharacterFragment, ServerModelFragment } from 'gql/fragments';
import {
  ControllerContextQuery,
  SimpleCharacter,
  ServerModel,
  ControllerContextSubscription,
  ServerUpdateType,
  PatcherAlert,
} from 'gql/interfaces';

export enum ServerType {
  CUGAME,
  CUBE,
  CHANNEL,
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
  mode: PatchChannelMode;
}

export function serverTypeToIcon(t: ServerType) {
  switch (t) {
    case ServerType.CUGAME: return 'images/controller/cu-logo.png';
    case ServerType.CUBE: return 'images/controller/cube-logo.png';
    case ServerType.CHANNEL: return 'images/controller/tools-logo.png';
    case ServerType.UNKNOWN: return 'ERROR';
  }
}

export function gqlSimpleCharacterToSimpleCharacter(gqlCharacter: SimpleCharacter): webAPI.SimpleCharacter {
  const gqlArchetype = gqlCharacter.archetype;
  const gqlRace = gqlCharacter.race;
  const gqlFaction = gqlCharacter.faction;

  const character = {
    ...gqlCharacter,
    archetype: webAPI.Archetype[gqlArchetype],
    race: webAPI.Race[gqlRace],
    faction: webAPI.Faction[gqlFaction],
  };

  return character;
}

export function gqlServerModelToServerModel(gqlServerModel: ServerModel): webAPI.ServerModel {
  const gqlAccessLevel = gqlServerModel.accessLevel;

  const server = {
    ...gqlServerModel,
    accessLevel: webAPI.AccessType[gqlAccessLevel],
  };

  return server;
}

export function webAPIServerToPatcherServer(server: webAPI.ServerModel): PatcherServer {
  const channels = patcher.getAllChannels();
  const channelIndex = utils.findIndexWhere(channels, c => c.channelID === server.channelID);
  const channel = channels[channelIndex];

  return utils.merge({
    name: server.name,
    available: server.playerMaximum > 0,
    type: ServerType.CUGAME,
    channelStatus: channel ? channel.channelStatus : ChannelStatus.NotInstalled,
    apiHost: server.apiHost,
    mode: channel ? channel.mode : PatchChannelMode.Automatic,
  }, server);
}

function getServerTypeFromChannel(channelID: number): ServerType {
  switch (channelID) {
    case 4: return ServerType.CUGAME;
    case 27: return ServerType.CUBE;
    case 1:
    case 6:
    case 10:
    case 11: {
      return ServerType.HIDDEN;
    }
    default: return ServerType.CHANNEL;
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
    mode: channel.mode,
  };
}

export interface Props {
  loggedIn: boolean;
}

export interface ContextState {
  characters: {[id: string]: webAPI.SimpleCharacter};
  servers: {[serverName: string]: PatcherServer};
  selectedCharacter: webAPI.SimpleCharacter;
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
  namedQueryCache: false,
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
  private channelUpdateInterval: number;
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
              url: (patcher.apiHost() + '/graphql').replace('http', 'ws'),
              initPayload: {
                Authorization: `Bearer ${patcher.getAccessToken()}`,
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
    window.clearInterval(this.channelUpdateInterval);
  }

  private getConfig = () => {
    const queryConf: QueryOptions = {
      url: patcher.apiHost() + '/graphql',
      requestOptions: {
        headers: {
          Authorization: `${client.ACCESS_TOKEN_PREFIX} ${patcher.getAccessToken()}`,
          shardID: `${client.shardID}`,
          characterID: client.characterID,
        },
      },
      stringifyVariables: false,
    };

    return {
      queryConf,
      subsConf: null as any,
    };
  }

  private handleQueryResult = (graphql: GraphQLResult<ControllerContextQuery.Query>) => {
    if (!graphql.data) return graphql;
    const characters = this.getCharacters(graphql);
    const servers = this.getServers(graphql, characters);
    this.setState({ characters, servers, refetch: graphql.refetch });
  }

  private handleSubscription = (result: SubscriptionResult<ControllerContextSubscription.Subscription>,
                                data: ControllerContextQuery.Query) => {
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

  private getCharacters = (graphql: GraphQLResult<ControllerContextQuery.Query>) => {
    const characters: {[id: string]: webAPI.SimpleCharacter} = {};
    graphql.data.shardCharacters.forEach((character) => {
      characters[character.id] = gqlSimpleCharacterToSimpleCharacter(character);
    });

    return characters;
  }

  private getServers = (graphql: GraphQLResult<ControllerContextQuery.Query>,
                        characters: {[id: string]: webAPI.SimpleCharacter}) => {
    const servers: {[id: string]: PatcherServer} = {};
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

  private getServersWithCharacterCounts(servers: utils.Dictionary<PatcherServer>,
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

  private updateChannels = () => {
    const channels = patcher.getAllChannels() || [];
    const channelServers: utils.Dictionary<PatcherServer> = {};
    const channelDict: utils.Dictionary<Channel> = {};
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

    const servers = utils.clone(this.state.servers);
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
