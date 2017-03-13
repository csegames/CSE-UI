/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';
import {Race, Archetype, Faction, utils, webAPI} from 'camelot-unchained';
import {CharacterCreationModel} from '../../../CharacterCreation';

import Login from '../Login';
import Alerts from '../Alerts';
import PatchButton from '../PatchButton';
import CharacterSelect from '../CharacterSelect';
import CharacterButtons from '../CharacterButtons';
import CharacterDeleteModal from '../CharacterDeleteModal';
import ServerSelect from '../ServerSelect';
import GameSelect from '../GameSelect';
import ProgressBar from '../ProgressBar';

import {events} from 'camelot-unchained';
import Animate from '../../../../lib/Animate';
import QuickSelect from '../../../../lib/QuickSelect';
import {patcher, Channel, ChannelStatus, PatchPermissions, permissionsString} from '../../../../services/patcher';
import {view} from '../../../../components/OverlayView';

import {GlobalState} from '../../services/session';
import {ControllerState, PatcherServer, ServerType, initialize, reset} from '../../services/session/controller';

declare let $: any;

const lastPlay: any = JSON.parse(localStorage.getItem('cse-patcher-lastplay'));

function select(state: GlobalState): ControllerDisplayReduxProps {
  return {
    ControllerState: state.controller,
  };
}

export interface ControllerDisplayReduxProps {
  dispatch?: (action: any) => void;
  ControllerState: ControllerState;
}

export interface ControllerDisplayProps extends ControllerDisplayReduxProps {
}

export interface ControllerDisplayState {
  loggedIn: boolean;
  showCreation: boolean;
  serverType: ServerType;
  selectedServer: PatcherServer;
  selectedCharacter: webAPI.SimpleCharacter;
};

class ControllerDisplay extends React.Component<ControllerDisplayProps, ControllerDisplayState> {
  constructor(props: ControllerDisplayProps) {
    super(props);
    this.state = {
      loggedIn: false,
      showCreation: false,
      serverType: ServerType.CUGAME,
      selectedServer: null,
      selectedCharacter: null,
    };
  }

  playSound = (sound: string) => {
    events.fire('play-sound', sound)
  }

  onLogin = () => {
    const lastCharacterID = lastPlay && lastPlay.characterID ? lastPlay.characterID : null;
    const lastServer = lastPlay && lastPlay.serverName ? lastPlay.serverName : null;
    const lastChannel = lastPlay && lastPlay.channelID ? lastPlay.channelID : null;

    this.props.dispatch(initialize());
  }

  onLogOut = () => {
    this.props.dispatch(reset());
  }

  showCharacterCreation = () => {
    events.fire('view-content', view.CHARACTERCREATION, {
      apiHost: 'https://api.camelotunchained.com/',
      apiVersion: 1,
      shard: this.state.selectedServer.shardID,
      apiKey: patcher.getLoginToken(),
      created: (c: CharacterCreationModel) => {
        events.fire('character-created', c.name);
        events.fire('view-content', view.NONE);
      },
    });
  }

  installSelectedServer = () => {
    const {selectedServer} = this.state;
    patcher.installChannel(selectedServer.channelID | 0);
    this.playSound('select');
  }

  componentDidMount() {
  }

  componentWillUnmount() {
  }

  queueStateChange = (obj: any) => {
    setTimeout(() => this.setState(obj), 2);
  }

  selectServerType = (serverType: ServerType) => {
    if (this.state.serverType === serverType) return;
    events.fire('play-sound', 'select');
    if (serverType === ServerType.CUBE) {
      this.queueStateChange({
        serverType: serverType,
        selectedServer: this.props.ControllerState.servers['C.U.B.E.'],
      } as any);
    } else {
      this.queueStateChange({serverType: serverType} as any);
    }
  }

  selectServer = (server: PatcherServer) => {
    if (this.state.selectedServer === server) return;
    events.fire('play-sound', 'select');
    this.queueStateChange({selectedServer: server} as any);
  }

  selectCharacter = (character: webAPI.SimpleCharacter) => {
    if (this.state.selectedCharacter === character) return;
    events.fire('play-sound', 'select');
    this.queueStateChange({selectedCharacter: character} as any);
  }

  renderSelections = () => {
    const {servers, characters, alerts} = this.props.ControllerState;
    const selectedServer = this.state.selectedServer ? this.props.ControllerState.servers[this.state.selectedServer.name] : null;

    switch (this.state.serverType) {
      case ServerType.CUGAME:

      return (
        <div className='ControllerDisplay__selections'>

          <div className='ControllerDisplay__selections__game'>
            <GameSelect selectType={this.selectServerType} servers={this.props.ControllerState.servers} />
            <i>Select your game</i>&nbsp;
          </div>

          <div className='ControllerDisplay__selections__server'>
            <ServerSelect selectServer={this.selectServer}
                          initialServer={selectedServer}
                          servers={servers}
                          serverType={this.state.serverType} />
            <i>Select a server</i>&nbsp;
          </div>

          <div className='ControllerDisplay__selections__character'>
            <CharacterSelect selectCharacter={this.selectCharacter}
                             selectedServer={selectedServer}
                             characters={characters} />
            <i>Select or</i><a href='#' onClick={this.showCharacterCreation}>create new character</a>&nbsp;
          </div>

          <div className='ControllerDisplay__permissions'>Your Access Level is {permissionsString(patcher.getPermissions())}.</div>
        </div>
      );

      case ServerType.CUBE:

      return (
        <div className='ControllerDisplay__selections'>
          <div className='ControllerDisplay__selections__game'>
            <GameSelect selectType={this.selectServerType} servers={this.props.ControllerState.servers} />
            <i>Select your game</i>&nbsp;
          </div>
          <div className='ControllerDisplay__permissions'>Your Access Level is {permissionsString(patcher.getPermissions())}.</div>
        </div>
      );

      case ServerType.CHANNEL:

      return (
        <div className='ControllerDisplay__selections'>

          <div className='ControllerDisplay__selections__game'>
            <GameSelect selectType={this.selectServerType} servers={this.props.ControllerState.servers} />
            <i>Select your game</i>&nbsp;
          </div>

          <div className='ControllerDisplay__selections__server'>
            <ServerSelect initialServer={selectedServer}
                          selectServer={this.selectServer}
                          servers={servers}
                          serverType={this.state.serverType} />
            <i>Select a server</i>&nbsp;
          </div>
          <div className='ControllerDisplay__permissions'>Your Access Level is {permissionsString(patcher.getPermissions())}.</div>
        </div>
      );

      default: return <h1>UNKNOWN GAME TYPE</h1>;
    }
  }

  render() {
    const {alerts} = this.props.ControllerState;
    const selectedServer = this.state.selectedServer ? this.props.ControllerState.servers[this.state.selectedServer.name] : null;
    const selectedCharacter = this.state.selectedCharacter ? this.props.ControllerState.characters[this.state.selectedCharacter.id] : null;
    if (!selectedCharacter) selectedCharacter == null;
    let alertArray: webAPI.PatcherAlert[] = [];
    for (let key in alerts) alertArray.push(alerts[key]);

    if (!patcher.hasLoginToken()) {
      return (
        <div className='ControllerDisplay'>
          <Alerts alerts={alertArray} />
          <Login onLogin={this.onLogin} />
        </div>
      );
    }

    return (
      <div className='ControllerDisplay'>
        <Alerts alerts={alertArray} />
        <ProgressBar servers={this.props.ControllerState.servers} selectedServer={selectedServer} />
        <div className='ControllerDisplay__controls'>
          {this.renderSelections()}
          <PatchButton servers={this.props.ControllerState.servers} selectedServer={selectedServer} selectedCharacter={selectedCharacter} />
        </div>
      </div>
    );
  }
};

export default connect(select)(ControllerDisplay);
