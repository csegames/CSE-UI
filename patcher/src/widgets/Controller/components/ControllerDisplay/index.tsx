/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { events, webAPI } from 'camelot-unchained';

import ControllerDisplayView from './components/ControllerDisplayView';

import { GlobalState } from '../../services/session';
import {
  ControllerState,
  PatcherServer,
  ServerType,
  initialize,
} from '../../services/session/controller';

export interface ControllerDisplayReduxProps {
  dispatch?: (action: any) => void;
  ControllerState: ControllerState;
}

export interface ControllerDisplayProps extends ControllerDisplayReduxProps {
}

export interface ControllerDisplayState {
  charSelectVisible: boolean;
  loggedIn: boolean;
  showCreation: boolean;
  serverType: ServerType;
  selectedServer: PatcherServer;
  selectedCharacter: webAPI.SimpleCharacter;
  serverListHelper: {[shardId: string]: webAPI.ServerModel};
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
    };
  }

  public render() {
    return (
      <ControllerDisplayView
        controllerState={this.props.ControllerState}
        selectedServer={this.state.selectedServer}
        selectedCharacter={this.state.selectedCharacter}
        charSelectVisible={this.state.charSelectVisible}
        serverType={this.state.serverType}
        onLogin={this.onLogin}
        onChooseCharacter={this.onChooseCharacter}
        onToggleCharacterSelect={this.toggleCharacterSelect}
        selectCharacter={this.selectCharacter}
        selectServer={this.selectServer}
        selectServerType={this.selectServerType}
      />
    );
  }

  public componentDidMount() {
    this.getServers();
  }

  public componentWillUnmount() {
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
    this.setState({ charSelectVisible: !this.state.charSelectVisible });
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
    events.fire('play-sound', 'select');
    this.setState({ selectedServer: server });
  }

  private selectCharacter = (character: webAPI.SimpleCharacter) => {
    events.fire('play-sound', 'select');
    this.setState({ selectedCharacter: character });
  }

  private onChooseCharacter = (character: webAPI.SimpleCharacter) => {
    this.toggleCharacterSelect();
    const characterServer = _.find(this.props.ControllerState.servers, server => server.shardID === character.shardID);
    this.selectServer(characterServer);
    this.selectCharacter(character);
  }
}

function select(state: GlobalState): ControllerDisplayReduxProps {
  return {
    ControllerState: state.controller,
  };
}

export default connect(select)(ControllerDisplay);
