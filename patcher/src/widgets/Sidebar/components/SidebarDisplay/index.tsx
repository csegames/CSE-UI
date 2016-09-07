/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';
import {race, archetype, faction} from 'camelot-unchained';
import CharacterCreation, {CharacterCreationModel} from 'cu-character-creation';

import Login from '../Login';
import Alerts from '../Alerts';
import SelectServer from '../ServerSelect';
import PatchButton from '../PatchButton';
import ServerCounts from '../ServerCounts';
import CharacterSelect from '../CharacterSelect';
import CharacterButtons from '../CharacterButtons';
import CharacterDeleteModal from '../CharacterDeleteModal';
import ServerSelect, {ServerStatus} from '../ServerSelect';

import {events} from 'camelot-unchained';
import Animate from '../../../../lib/Animate';
import QuickSelect from '../../../../lib/QuickSelect';
import {patcher, Channel} from '../../../../services/patcher';

import api from '../../services/api';

import {GlobalState} from '../../services/session';
import {AlertsState, PatcherAlert, initAlerts, stopAlertsInterval} from '../../services/session/alerts';
import {ServersState, PatcherServer, SimpleCharacter, initServers, stopServersInterval, selectCharacter, selectServer, characterCreated} from '../../services/session/servers';

declare let $: any;

const lastPlay: any = JSON.parse(localStorage.getItem('cse-patcher-lastplay'));

function select(state: GlobalState): SidebarDisplayReduxProps {
  return {
    serversState: state.servers,
    alertsState: state.alerts,
  };
}

export interface SidebarDisplayReduxProps {
  dispatch?: (action: any) => void;
  serversState: ServersState;
  alertsState: AlertsState;
}

export interface SidebarDisplayProps extends SidebarDisplayReduxProps {
  onLogIn: () => void;
}

export interface SidebarState {
  loggedIn: boolean;
  showCreation: boolean;
  characterToDelete: SimpleCharacter;
};

class SidebarDisplay extends React.Component<SidebarDisplayProps, SidebarState> {
  public name = 'cse-patcher-sidebar';

  constructor(props: SidebarDisplayProps) {
    super(props);
    this.state = {
      loggedIn: false,
      showCreation: false,
      characterToDelete: null
    };
  }

  onLogIn = () => {
    const {onLogIn, dispatch} = this.props;

    const lastCharacterID = lastPlay && lastPlay.characterID ? lastPlay.characterID : null;
    const lastServer = lastPlay && lastPlay.serverName ? lastPlay.serverName : null;
    const lastChannel = lastPlay && lastPlay.channelID ? lastPlay.channelID : null;

    onLogIn();
    dispatch(initServers(500));
  }

  onLogOut = () => {
  }

  initjQueryObjects = () => {
    $('.dropdown-button').dropdown();
  }

  selectCharacter = (character: SimpleCharacter) => {
    this.props.dispatch(selectCharacter(character));
    events.fire('play-sound', 'select');
  }

  generateCharacterButtons = (shardID: number, selectedCharacter: SimpleCharacter) : JSX.Element => {
    let creation: JSX.Element;
    let confirm: JSX.Element;
    if (this.state.showCreation) {
      creation = (
        <div className='cu-patcher-ui__character-creation' key='char-create'>
          <CharacterCreation apiHost={'https://api.camelotunchained.com/'}
            apiVersion={1}
            shard={shardID}
            apiKey={patcher.getLoginToken()}
            created={(created: CharacterCreationModel) => {
              this.closeCreation();
              let simpleCharacter = {
                archetype: created.archetype,
                faction: created.faction,
                gender: created.gender,
                id: null,
                lastLogin: Date.now(),
                name: created.name,
                race: created.race,
                shardID: created.shardID,
              } as any;
              this.props.dispatch(characterCreated(simpleCharacter));
            }} />
        </div>
      );
    }
    if (this.state.characterToDelete) {
      confirm = (
        <div className='fullscreen-blackout'>
          <CharacterDeleteModal
            character={selectedCharacter}
            closeModal={this.cancelDeleteCharacter}
            deleteCharacter={this.deleteCharacter}/>
        </div>
      );
    }
    return (
      <div>
        <Animate
          animationEnter='slideInRight'  durationEnter={400}
          animationLeave='slideOutRight' durationLeave={500}>
          {creation}
        </Animate>
        <CharacterButtons
          creating={creation !== undefined}
          selectedCharacter={selectedCharacter}
          onCreate={this.createCharacter}
          onCancel={this.cancelCreateCharacter}
          onDelete={this.confirmDelete}/>
        <Animate animationEnter='slideInUp' animationLeave='slideOutDown'
          durationEnter={400} durationLeave={500}>
          {confirm}
        </Animate>
      </div>
    );
  }

  createCharacter = () : void => {
    this.setState({ showCreation: true } as any);
  }

  cancelCreateCharacter = () : void => {
    this.setState({ showCreation: false } as any);
  }

  closeCreation = () : void => {
    this.setState({ showCreation: false } as any);
  }

  confirmDelete = (character: SimpleCharacter) => {
    this.setState({ characterToDelete: character } as any);
  }

  cancelDeleteCharacter = (): void => {
    this.setState({ characterToDelete: null } as any);
  }

  deleteCharacter = (character: SimpleCharacter) : void => {
    api.deleteCharacter(character.shardID, character.id)
      .then(() => this.props.dispatch(selectCharacter(null)));
    this.setState({ characterToDelete: null } as any);
  }

  componentDidMount() {
    this.props.dispatch(initAlerts(30000));
  }

  componentDidUnMount() {
    stopAlertsInterval();
    stopServersInterval();
  }

  render() {
    if (!patcher.hasLoginToken()) {
      return (
        <div id={this.name} className=''>
          <Login onLogIn={this.onLogIn} />
        </div>
      );
    }

    setTimeout(this.initjQueryObjects, 100);
    let renderServerSection: any = null;

    const {selectedServer} = this.props.serversState;
    if (selectedServer) {
      //todo: redux up ServerCounts, componentize character buttons
      renderServerSection = (
        <div>
          <ServerSelect selectServer={(server: PatcherServer) => this.props.dispatch(selectServer(server))}
                        serversState={this.props.serversState} />
          <CharacterSelect selectCharacter={(character: SimpleCharacter) => this.props.dispatch(selectCharacter(character)) }
                           serversState={this.props.serversState} />
          { this.generateCharacterButtons(selectedServer.shardID, selectedServer.selectedCharacter) }
          <ServerCounts artCount={0}
                        tddCount={0}
                        vikCount={0} />
        </div>
      );
    } else {
      renderServerSection = (
          <div>
            <ServerSelect selectServer={(server: PatcherServer) => this.props.dispatch(selectServer(server))}
                          serversState={this.props.serversState} />                
          </div>
        );
    }

    return (
      <div id={this.name} className=''>
        <Alerts alerts={this.props.alertsState.alerts} />
        
        <div className='card-panel no-padding'>
          <div>
            {renderServerSection}
          </div>
          <PatchButton />
        </div>
      </div>
    );
  }
};

export default connect(select)(SidebarDisplay);
