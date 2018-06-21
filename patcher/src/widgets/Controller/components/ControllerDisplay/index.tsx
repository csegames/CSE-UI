/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { events, webAPI } from '@csegames/camelot-unchained';

import ControllerDisplayView from './components/ControllerDisplayView';

import { Routes } from '../../../../services/session/routes';
import { GlobalState } from '../../services/session';
import {
  ControllerState,
  PatcherServer,
  ServerType,
  initialize,
  characterRemoved,
} from '../../services/session/controller';

export interface APIServerStatus {
  [shardId: string]: 'Online' | 'Offline';
}

export interface ControllerDisplayReduxProps {
  dispatch?: (action: any) => void;
  ControllerState: ControllerState;
}

export interface ControllerDisplayProps extends ControllerDisplayReduxProps {
  activeRoute: Routes;
}

export interface ControllerDisplayState {
  charSelectVisible: boolean;
  loggedIn: boolean;
  showCreation: boolean;
  serverType: ServerType;
  selectedServer: PatcherServer;
  selectedCharacter: webAPI.SimpleCharacter;
  serverListHelper: {[shardId: string]: webAPI.ServerModel};
  apiServerStatus: APIServerStatus;
}

class ControllerDisplay extends React.Component<ControllerDisplayProps, ControllerDisplayState> {
  constructor(props: ControllerDisplayProps) {
    super(props);
    this.state = {
      charSelectVisible: false,
      loggedIn: false,
      showCreation: false,
      serverType: ServerType.CUGAME,
      selectedServer: null,
      selectedCharacter: null,
      serverListHelper: {},
      apiServerStatus: {},
    };
  }

  public render() {
    return (
      <ControllerDisplayView
        activeRoute={this.props.activeRoute}
        controllerState={this.props.ControllerState}
        selectedServer={this.state.selectedServer}
        selectedCharacter={this.state.selectedCharacter}
        charSelectVisible={this.state.charSelectVisible}
        serverType={this.state.serverType}
        onLogin={this.onLogin}
        onChooseCharacter={this.onChooseCharacter}
        onToggleCharacterSelect={this.toggleCharacterSelect}
        onDeleteCharacterSuccess={this.onDeleteCharacterSuccess}
        selectCharacter={this.selectCharacter}
        selectServer={this.selectServer}
        selectServerType={this.selectServerType}
        apiServerStatus={this.state.apiServerStatus}
      />
    );
  }

  public componentDidMount() {
    this.getServers();
  }

  private getServers = async () => {
    try {
      const res = await webAPI.ServersAPI.GetServersV1(webAPI.defaultConfig);
      const serverListHelper = {};
      const data = JSON.parse(res.data);
      data.forEach((server: webAPI.ServerModel) => {
        serverListHelper[server.shardID] = server;
      });
      this.setState({ serverListHelper });
    } catch (err) {
      console.log(err);
    }
  }

  private onLogin = () => {
    this.props.dispatch(initialize());
  }

  private toggleCharacterSelect = () => {
    this.updateApiServerStatus();
    this.setState({ charSelectVisible: !this.state.charSelectVisible });
  }

  private updateApiServerStatus = () => {
    const { servers } = this.props.ControllerState;
    const apiServerStatus = {};
    Object.keys(servers).forEach((_key) => {
      webAPI.ServersAPI.GetServersV1({ url: servers[_key].apiHost + '/' })
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
    events.fire('play-sound', 'select');
    if (serverType === ServerType.CUBE) {
      this.setState({
        serverType,
        selectedServer: this.props.ControllerState.servers['C.U.B.E.'],
      });
    } else {
      this.setState({ serverType });
    }
  }

  private selectServer = (server: PatcherServer) => {
    // Only check for undefined because selected server can be null
    if (typeof server !== 'undefined' && !_.isEqual(server, this.state.selectedServer)) {
      events.fire('play-sound', 'select');
      this.setState({ selectedServer: server });
    }
  }

  private selectCharacter = (character: webAPI.SimpleCharacter) => {
    // Only check for undefined because selected character can be null
    if (typeof character !== 'undefined' && !_.isEqual(character, this.state.selectedCharacter)) {
      if (character && character.id) {
        // Save last selected character
        localStorage.setItem('cu-patcher-last-selected-character-id', character.id);
      }
      events.fire('play-sound', 'select');
      this.setState({ selectedCharacter: character });
    }
  }

  private onChooseCharacter = (character: webAPI.SimpleCharacter) => {
    this.toggleCharacterSelect();
    const characterServer = _.find(this.props.ControllerState.servers, server => server.shardID === character.shardID);
    this.selectServer(characterServer);
    this.selectCharacter(character);
  }

  private onDeleteCharacterSuccess = (id: string) => {
    this.props.dispatch(characterRemoved(id));
  }
}

function select(state: GlobalState): ControllerDisplayReduxProps {
  return {
    ControllerState: state.controller,
  };
}

export default connect(select)(ControllerDisplay);
