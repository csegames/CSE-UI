/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { webAPI } from '@csegames/camelot-unchained';

import ControllerDisplayView from './ControllerDisplayView';
import { Routes } from '../../../../services/session/routes';
import { patcher } from '../../../../services/patcher';
import {
  ControllerContextProvider,
  ControllerContext,
  ContextState,
  PatcherServer,
  ServerType,
} from '../../ControllerContext';
import { SimpleCharacter } from 'gql/interfaces';

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

  private toggleCharacterSelect = () => {
    this.updateApiServerStatus();
    this.setState({ charSelectVisible: !this.state.charSelectVisible });
  }

  private updateApiServerStatus = () => {
    const { servers } = this.props;
    const apiServerStatus = {};
    Object.keys(servers).forEach((_key) => {
      const config: RequestConfig = () => ({
        url: servers[_key].apiHost + '/',
        headers: {
          Authorization: `Bearer ${patcher.getAccessToken()}`,
        },
      });
      webAPI.ServersAPI.GetServersV1(config)
        .then((_res) => {
          if (_res.ok) {
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
    if (serverType === ServerType.CUBE) {
      this.setState({ serverType });
      this.props.onUpdateState({
        selectedServer: this.props.servers['C.U.B.E'],
      });
    } else {
      this.setState({ serverType });
    }
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
