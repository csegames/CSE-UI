/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import gql from 'graphql-tag';

import { patcher, ChannelStatus, Channel, PatchChannelMode, Product } from '../../services/patcher';
import { GraphQLClient, primary } from '../../api/graphql';
import { AccessType, ServerStatus } from '../../api/webapi';
import { Archetype, Gender, Race, SimpleCharacter } from '../../api/helpers';
import { Dictionary } from '../../lib/Dictionary';
import { clone } from '../../lib/reduxUtils';
import { SubscriptionResult, Subscriptions } from '../../api/subscription';
import { ServerModelFragment } from '../../gql/fragments/ServerModelFragment';
import { primaryConf, primarySubsConf } from '../../api/networkConfig';
import { ListenerHandle } from '../../lib/ListenerHandle';
import { GraphQLQueryResult } from '../../api/query';
import { ContentPhase } from '../../services/ContentPhase';

const ServerUpdateType = primary.ServerUpdateType;

const LastSelectedCharacterId: string = 'last-selected-character-id';
export const LastSelectedServerName: string = 'last-selected-server-name';

export interface ControllerContextQuery {
  shardCharacters: primary.SimpleCharacter[];
  connectedServices: {
    servers: primary.ServerModel[];
  };
}

export enum ServerType {
  CUGAME,
  CUBE,
  CHANNEL,
  COLOSSUS,
  UNKNOWN,
  HIDDEN
}

export const VIGRIDR_CHANNEL = 2200;

// Server interface which the Controller will use for rendering
export interface PatcherServer {
  name: string;
  type: ServerType;
  channelStatus: number;
  available: boolean;
  channelPatchPermissions?: number;
  accessLevel?: AccessType;
  channelID?: number;
  shardID?: number;
  characterCount?: number;
  characters?: SimpleCharacter[];
  lastUpdated?: number;
  apiHost?: string;
  mode: PatchChannelMode;
}

export function serverTypeToIcon(t: ServerType) {
  switch (t) {
    case ServerType.CUGAME:
      return 'images/controller/cu-logo.png';
    case ServerType.CUBE:
      return 'images/controller/cube-logo.png';
    case ServerType.CHANNEL:
      return 'images/controller/tools-logo.png';
    case ServerType.UNKNOWN:
      return 'ERROR';
    case ServerType.COLOSSUS:
      return 'images/colossus/fs-icon.png';
  }
}

export function serverTypeToProductType(serverType: ServerType): Product {
  switch (serverType) {
    case ServerType.CUGAME:
      return Product.CamelotUnchained;
    case ServerType.COLOSSUS:
      return Product.Colossus;
    case ServerType.CUBE:
      return Product.Cube;
    default:
      return Product.Tools;
  }
}

export function gqlSimpleCharacterToSimpleCharacter(gqlCharacter: primary.SimpleCharacter): SimpleCharacter {
  return {
    archetype: Archetype[gqlCharacter.archetype as keyof typeof Archetype],
    faction: primary.Faction[gqlCharacter.faction],
    gender: Gender[gqlCharacter.gender as keyof typeof Gender],
    id: gqlCharacter.id,
    lastLogin: gqlCharacter.lastLogin,
    name: gqlCharacter.name,
    race: Race[gqlCharacter.race as keyof typeof Race],
    shardID: gqlCharacter.shardID
  };
}

function translateAccessLevel(accessType: primary.AccessType): AccessType {
  switch (accessType) {
    case primary.AccessType.Public:
      return AccessType.Public;
    case primary.AccessType.Live:
      return AccessType.Live;
    case primary.AccessType.Beta3:
      return AccessType.Beta3;
    case primary.AccessType.Beta2:
      return AccessType.Beta2;
    case primary.AccessType.Beta1:
      return AccessType.Beta1;
    case primary.AccessType.Alpha:
      return AccessType.Alpha;
    case primary.AccessType.InternalTest:
      return AccessType.InternalTest;
    default:
      return AccessType.Employees;
  }
}

function translateServerStatus(status: primary.ServerStatus): ServerStatus {
  switch (status) {
    case primary.ServerStatus.Online:
      return ServerStatus.Online;
    case primary.ServerStatus.Starting:
      return ServerStatus.Starting;
    default:
      return ServerStatus.Offline;
  }
}

function gqlServerModelToPatcherServer(server: primary.ServerModel, channels: Dictionary<Channel>): PatcherServer {
  const channel = channels[server.channelID];

  return {
    name: server.name,
    type: getServerTypeFromChannel(server.channelID),
    channelStatus: channel?.channelStatus ?? ChannelStatus.NotInstalled,
    available: translateServerStatus(server.status) === ServerStatus.Online,
    channelPatchPermissions: server.channelPatchPermissions,
    accessLevel: translateAccessLevel(server.accessLevel),
    channelID: server.channelID,
    shardID: server.shardID,
    apiHost: patcher.getShardHostOverride(server.shardID) ?? server.apiHost,
    mode: channel?.mode ?? PatchChannelMode.Automatic
  };
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
    lastUpdated: channel.lastUpdated || 0,
    mode: channel.mode
  };
}

// TODO[CSE-719] : push ProductID as a new ServerModel field, remove this mapping
function getServerTypeFromChannel(channelID: number, defaultsTo: ServerType = ServerType.CHANNEL): ServerType {
  switch (channelID) {
    case 1000:
    case 1200:
    case 1300:
    case 1400:
    case 1500:
    case 1600:
    case 2500:
    case 2700:
    case 2900:
    case 3300:
    case 3400:
      return ServerType.CUGAME;

    case 27:
      return ServerType.CUBE;

    case 1:
    case 4:
    case 6:
    case 7:
    case 8:
    case 10:
    case 11:
    case 12:
    case 14:
    case 15:
      return ServerType.HIDDEN;

    case 1100:
    case 1700:
    case 1800:
    case 1900:
    case 2000:
    case 2100:
    case 2200:
    case 2300:
    case 2400:
    case 2600:
    case 2800:
    case 3000:
    case 3100:
    case 3200:
      return ServerType.COLOSSUS;

    // 29 is CUBEPrep, which functions exactly like CUBE.  But the CUBE category isn't setup to support
    // multiple different channels.  So we leave it in the "Channel" bucket which runs it without parameters
    // and doesn't require character creation, which is exactly how CUBE/CUBEPrep should be run.
    case 29:
      return ServerType.CHANNEL;

    default:
      return defaultsTo;
  }
}

export interface ContextState {
  characters: { [id: string]: SimpleCharacter };
  servers: { [serverName: string]: PatcherServer };
  selectedCharacter: SimpleCharacter;
  selectedServer: PatcherServer;

  onUpdateState: (phase: ContentPhase, state: Partial<ContextState>) => void;
  updateChannels: () => void;
  refetch: () => void;
}

function noOp() {}
export const defaultControllerContextState: ContextState = {
  characters: {},
  servers: {},
  selectedCharacter: null,
  selectedServer: null,

  onUpdateState: noOp,
  updateChannels: noOp,
  refetch: noOp
};

export const ControllerContext = React.createContext(defaultControllerContextState);

type QueryResult = Pick<primary.CUQuery, 'shardCharacters' | 'connectedServices'>;

const query = gql`
  query ControllerContextQuery {
    shardCharacters {
      id
      archetype
      faction
      gender
      lastLogin
      name
      race
      shardID
    }
    connectedServices {
      servers {
        accessLevel
        channelID
        shardID
        channelPatchPermissions
        name
        status
        apiHost
      }
    }
  }
`;

type UpdatesResult = Pick<primary.CUSubscription, 'serverUpdates'>;

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

type Props = { shouldConnect: boolean };

export class ControllerContextProvider extends React.Component<Props, ContextState> {
  private graphql: GraphQLClient<QueryResult>;
  private loginHandle: ListenerHandle;
  private subHandle: ListenerHandle;
  private channelUpdateInterval: number;
  private queryRefetchInterval: number;
  constructor(props: Props) {
    super(props);
    this.state = {
      ...defaultControllerContextState,
      onUpdateState: this.onUpdateState.bind(this),
      updateChannels: this.updateChannels.bind(this),
      refetch: this.refresh.bind(this)
    };
  }

  public render() {
    return <ControllerContext.Provider value={this.state}>{this.props.children}</ControllerContext.Provider>;
  }

  public componentDidMount(): void {
    if (this.props.shouldConnect) this.connect();
  }

  public componentDidUpdate(prevProps: Readonly<Props>): void {
    if (!prevProps.shouldConnect && this.props.shouldConnect) this.connect();
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
    this.subHandle?.close();
    this.loginHandle?.close();
  }

  private refresh() {
    this.graphql?.query({ query }).then(this.handleQueryResult.bind(this));
  }

  private connect() {
    this.graphql = new GraphQLClient<QueryResult>(primaryConf);
    this.graphql.query({ query }).then(this.handleQueryResult.bind(this));
    this.subHandle = Subscriptions.create(primarySubsConf()).add(
      { query: subscription },
      this.handleSubscription.bind(this)
    );
    this.channelUpdateInterval = window.setInterval(this.updateChannels.bind(this), 1000);
  }

  private handleQueryResult(result: GraphQLQueryResult<QueryResult>) {
    if (!this.queryRefetchInterval) {
      this.queryRefetchInterval = window.setInterval(this.refresh.bind(this), 60000);
    }

    if (!result.ok || !result.data) return;

    const characters = this.getCharacters(result.data);
    const servers = this.getServers(result.data, characters);

    const [selectedServer, selectedCharacter] = this.initializeSelections(servers, characters);
    this.setState({ characters, servers, selectedServer, selectedCharacter });
  }

  private handleSubscription(result: SubscriptionResult<UpdatesResult>) {
    if (!result.data.serverUpdates) return;
    this.handleServerUpdates(result.data.serverUpdates);
  }

  private handleServerUpdates(serverUpdates: primary.IServerUpdate) {
    if (!serverUpdates) return;
    const channels = patcher.getAllChannels();
    switch (serverUpdates.type) {
      case ServerUpdateType.Updated: {
        const msg = serverUpdates as primary.ServerUpdated;
        const servers = { ...this.state.servers };
        servers[msg.server.name] = gqlServerModelToPatcherServer(msg.server, channels);
        this.setState({ servers });
        break;
      }
      case ServerUpdateType.UpdatedAll: {
        const msg = serverUpdates as primary.ServerUpdatedAll;
        const servers = { ...this.state.servers };
        servers[msg.server.name] = gqlServerModelToPatcherServer(msg.server, channels);
        this.setState({ servers });
        break;
      }
      case ServerUpdateType.UnavailableAll: {
        // TODO : this message is supposed to have a server name to disable; it is *not*
        // meant to be a catch-all to disable everything.  The LauncherAPI needs to be
        // fixed before we can interpret this signal correctly.
        /*        
        const servers = { ...this.state.servers };
        Object.keys(servers).forEach((serverName) => {
          servers[serverName] = {
            ...servers[serverName],
            available: false,
          };
        });
        this.setState({ servers });
*/
        break;
      }
    }
  }

  private getCharacters(graphql: QueryResult) {
    const characters: Dictionary<SimpleCharacter> = {};
    graphql.shardCharacters?.forEach((character) => {
      characters[character.id] = gqlSimpleCharacterToSimpleCharacter(character);
    });

    return characters;
  }

  private getServers(graphql: QueryResult, characters: Dictionary<SimpleCharacter>) {
    const channels = patcher.getAllChannels();
    const servers: Dictionary<PatcherServer> = { ...this.state.servers };
    graphql.connectedServices?.servers.forEach((server) => {
      servers[server.name] = gqlServerModelToPatcherServer(server, channels);
    });

    return this.getServersWithCharacterCounts(servers, characters);
  }

  private initializeSelections(
    servers: Dictionary<PatcherServer>,
    characters: Dictionary<SimpleCharacter>
  ): [PatcherServer, SimpleCharacter] {
    if (this.state.selectedCharacter || this.state.selectedServer) {
      return [this.state.selectedServer, this.state.selectedCharacter];
    }
    const lastServerName = localStorage.getItem(LastSelectedServerName);
    const selectedServer = servers[lastServerName];
    let selectedCharacter = this.state.selectedCharacter;
    if (selectedServer) {
      const lastCharacterId = localStorage.getItem(`${lastServerName}-${LastSelectedCharacterId}`);
      selectedCharacter = characters[lastCharacterId];
    }
    return [selectedServer, selectedCharacter];
  }

  private onUpdateState(phase: ContentPhase, state: Partial<ContextState>) {
    this.setState((prevState) => {
      const server = state.selectedServer;
      if (phase != ContentPhase.Camelot) {
        state.selectedCharacter = null;
      } else if (prevState?.selectedServer != server) {
        // only record last server in CU mode
        localStorage.setItem(LastSelectedServerName, server.name);
        if (server) {
          if (state.selectedCharacter) {
            localStorage.setItem(`${server.name}-${LastSelectedCharacterId}`, state.selectedCharacter.id);
          } else {
            state.selectedCharacter =
              this.state.characters[localStorage.getItem(`${server.name}-${LastSelectedCharacterId}`)];
          }
        }
      } else if (server && prevState?.selectedCharacter != state.selectedCharacter) {
        localStorage.setItem(`${server.name}-${LastSelectedCharacterId}`, state.selectedCharacter?.id);
      }
      return {
        ...prevState,
        ...state
      };
    });
  }

  private getServersWithCharacterCounts(
    servers: Dictionary<PatcherServer>,
    characters: Dictionary<SimpleCharacter>
  ): Dictionary<PatcherServer> {
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

  private updateChannels() {
    const channels = patcher.getAllChannels() || {};
    const channelServers: Dictionary<PatcherServer> = {};
    for (const c of Object.values(channels)) {
      // check if we have a server with a matching name to a channel, if not the channel becomes it's own 'server'.
      if (!this.state.servers[c.channelName]) {
        // create a server for this channel
        channelServers[c.channelName] = channelToPatcherServer(c);
      } else {
        // while we're here lets see if we need to update the last updated time
        if (
          this.state.servers[c.channelName].channelStatus === ChannelStatus.Updating &&
          c.channelStatus === ChannelStatus.Ready
        ) {
          localStorage.setItem(`channel_updated_${c.channelName}`, Date.now().toLocaleString());
        }
      }
    }

    const servers = clone(this.state.servers);
    for (const key in servers) {
      const server = servers[key];
      const channel = channels[server.channelID];
      if (channel) {
        server.channelStatus = channel.channelStatus;
        server.lastUpdated = channel.lastUpdated;
        server.mode = channel.mode;
      } else {
        server.channelStatus = ChannelStatus.NotInstalled;
        server.lastUpdated = 0;
        server.mode = PatchChannelMode.Automatic;
      }
    }

    const newServers = {
      ...servers,
      ...channelServers
    };
    const updatedSelectedServer = this.state.selectedServer ? newServers[this.state.selectedServer.name] : null;
    this.setState({ servers: newServers, selectedServer: updatedSelectedServer });
  }
}
