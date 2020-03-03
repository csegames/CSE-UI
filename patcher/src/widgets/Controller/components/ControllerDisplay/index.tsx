/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import ControllerDisplayView from './ControllerDisplayView';
import { Routes } from '../../../../services/session/routes';
import {
  ControllerContextProvider,
  ControllerContext,
  ContextState,
  PatcherServer,
  ServerType,
} from '../../ControllerContext';
import { SimpleCharacter } from 'gql/interfaces';
import { checkAPIServer } from '../../../../lib/checkAPIServer';

export interface APIServerStatus {
  [apiHost: string]: 'Online' | 'Offline';
}

export interface ComponentProps {
  activeRoute: Routes;
}

export interface InjectedProps {
  servers: {[id: string]: PatcherServer};
  selectedServer: PatcherServer;
  selectedCharacter: SimpleCharacter;

  onUpdateState: (state: Partial<ContextState>) => void;
  onLogin: () => void;
}

export type Props = ComponentProps & InjectedProps;

export interface ControllerDisplayState {
  charSelectVisible: boolean;
  loggedIn: boolean;
  showCreation: boolean;
  serverType: ServerType;
  apiServerStatus: APIServerStatus;
}

class ControllerDisplay extends React.PureComponent<Props, ControllerDisplayState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      charSelectVisible: false,
      loggedIn: false,
      showCreation: false,
      serverType: ServerType.CUGAME,
      apiServerStatus: {},
    };
  }

  public render() {
    return (
      <ControllerDisplayView
        activeRoute={this.props.activeRoute}
        charSelectVisible={this.state.charSelectVisible}
        serverType={this.state.serverType}
        onLogin={this.props.onLogin}
        onToggleCharacterSelect={this.toggleCharacterSelect}
        onDeleteCharacterSuccess={this.onDeleteCharacterSuccess}
        selectServerType={this.selectServerType}
        apiServerStatus={this.state.apiServerStatus}
      />
    );
  }

  public componentDidMount() {
    this.checkForInitializeServer();
  }

  public componentDidUpdate() {
    this.checkForInitializeServer();
  }

  private toggleCharacterSelect = () => {
    this.updateApiServerStatus();
    if (this.state.charSelectVisible) {
      // We are closing char select
      game.trigger('resume-videos');
    } else {
      // We are opening char select
      game.trigger('pause-videos');
    }

    this.setState({ charSelectVisible: !this.state.charSelectVisible });
  }

  private updateApiServerStatus = () => {
    const { servers } = this.props;
    const apiServerStatus = {};
    Object.keys(servers).forEach((_key) => {
      checkAPIServer(servers[_key].apiHost)
        .then((ok) => {
          if (ok) {
            apiServerStatus[servers[_key].apiHost] = 'Online';
          } else {
            apiServerStatus[servers[_key].apiHost] = 'Offline';
          }
          this.setState({ apiServerStatus });
        });
    });
  }

  private selectServerType = (serverType: ServerType) => {
    if (this.state.serverType === serverType) return;

    game.trigger('play-sound', 'select');
    this.checkForInitializeServer();
  }

  private checkForInitializeServer = () => {
    if (window.patcherState.loggedIn) {
      const isSelectedServerNull = this.props.selectedServer === null || typeof this.props.selectedServer === 'undefined';

      switch (window.patcherState.selectedProduct) {
        case Product.Colossus: {
          if (isSelectedServerNull) {
            this.initializeColossusServer();
          }

          if (this.state.serverType !== ServerType.COLOSSUS) {
            this.setState({ serverType: ServerType.COLOSSUS });
            this.initializeColossusServer();
          }
          return;
        }

        case Product.CamelotUnchained: {
          if (isSelectedServerNull) {
            this.initializeCUServer();
          }

          if (this.state.serverType !== ServerType.CUGAME) {
            this.setState({ serverType: ServerType.CUGAME });
            this.initializeCUServer();
          }
          return;
        }

        case Product.Cube: {
          if (isSelectedServerNull) {
            this.initializeCubeServer();
          }

          if (this.state.serverType !== ServerType.CUBE) {
            this.setState({ serverType: ServerType.CUBE });
            this.initializeCubeServer();
          }
          return;
        }

        case Product.Tools: {
          if (isSelectedServerNull) {
            this.initializeTools();
          }
          if (this.state.serverType !== ServerType.CHANNEL) {
            this.setState({ serverType: ServerType.CHANNEL });
            this.initializeTools();
          }
          return;
        }
      }
    }
  }

  private initializeCubeServer = () => {
    const cubeServerKey = Object.keys(this.props.servers).find(key => this.props.servers[key].channelID === 27);
    this.props.onUpdateState({ selectedServer: this.props.servers[cubeServerKey] });
  }

  private initializeColossusServer = () => {
    const servers: PatcherServer[] = this.getServersWithPatchPermissions(ServerType.COLOSSUS);
    if (servers.length === 0) {
      this.props.onUpdateState({ selectedServer: null });
      return;
    }

    // Hardcode find channel 2200 (Vigridr)
    const colossusServer = servers.find(server => server.channelID === 2200);
    this.props.onUpdateState({ selectedServer: colossusServer });
  }

  private initializeCUServer = () => {
    const servers: PatcherServer[] = this.getServersWithPatchPermissions(ServerType.CUGAME);
    if (servers.length === 0) {
      this.props.onUpdateState({ selectedServer: null });
      return;
    }

    const lastPlayString = localStorage.getItem('cse-patcher-lastplay');

    let selectedServer = null;
    if (lastPlayString) {
      const lastPlay: { channelID: string, serverName: string, characterID: string } = JSON.parse(lastPlayString);
      selectedServer = servers.find(server => server.name === lastPlay.serverName);
    }

    if (!selectedServer) {
      selectedServer = servers.find(server => server.type === ServerType.CUGAME);
    }

    this.props.onUpdateState({ selectedServer });
  }

  private initializeTools = () => {
    const servers: PatcherServer[] = this.getServersWithPatchPermissions(ServerType.CUGAME);
    this.props.onUpdateState({ selectedServer: servers.find((value: any) => value.name === 'Editor') || servers[0] });
  }

  private getServersWithPatchPermissions = (serverType: ServerType) => {
    const values: PatcherServer[] = [];
    const servers = this.props.servers;
    Object.keys(servers).forEach((key: string) => {
      if (servers[key].type === serverType) {
        values.push(servers[key]);
      }
    });

    return values;
  }

  // private selectServer = (server: PatcherServer) => {
  //   // Only check for undefined because selected server can be null
  //   if (typeof server !== 'undefined' && !_.isEqual(server, this.state.selectedServer)) {
  //     game.trigger('play-sound', 'select');
  //     this.setState({ selectedServer: server });
  //   }
  // }

  // private selectCharacter = (character: SimpleCharacter) => {
  //   // Only check for undefined because selected character can be null
  //   if (typeof character !== 'undefined' && !_.isEqual(character, this.state.selectedCharacter)) {
  //     if (character && character.id) {
  //       // Save last selected character
  //       localStorage.setItem('cu-patcher-last-selected-character-id', character.id);
  //     }
  //     game.trigger('play-sound', 'select');
  //     this.setState({ selectedCharacter: character });
  //   }
  // }

  // private onChooseCharacter = (character: SimpleCharacter) => {
  //   this.toggleCharacterSelect();
  //   const characterServer = _.find(this.props.ControllerState.servers, server => server.shardID === character.shardID);
  //   this.selectServer(characterServer);
  //   this.selectCharacter(character);
  // }

  private onDeleteCharacterSuccess = (id: string) => {
    // this.props.dispatch(characterRemoved(id));
  }
}

class ControllerDisplayWithInjectedContext extends React.Component<ComponentProps, { loggedIn: boolean }> {
  constructor(props: Props) {
    super(props);
    this.state = {
      loggedIn: false,
    };
  }

  public render() {
    return (
      <ControllerContextProvider loggedIn={this.state.loggedIn}>
        <ControllerContext.Consumer>
          {({ servers, selectedServer, selectedCharacter, onUpdateState }) => (
            <ControllerDisplay
              {...this.props}
              servers={servers}
              selectedServer={selectedServer}
              selectedCharacter={selectedCharacter}
              onUpdateState={onUpdateState}
              onLogin={this.onLogin}
            />
          )}
        </ControllerContext.Consumer>
      </ControllerContextProvider>
    );
  }

  private onLogin = () => {
    this.setState({ loggedIn: true });
  }
}

export default ControllerDisplayWithInjectedContext;
