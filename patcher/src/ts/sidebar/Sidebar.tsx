/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';
import {components, race, restAPI, archetype, faction} from 'camelot-unchained';
let QuickSelect = components.QuickSelect;
declare let $: any;

import Login from './Login';
import ChannelSelect from './ChannelSelect';
import ServerSelect, {ServerStatus} from './ServerSelect';
import PatchButton from './PatchButton';
import ServerCounts from './ServerCounts';
import CharacterSelect from './CharacterSelect';
import CharacterButtons from './CharacterButtons';
import CharacterDeleteModal from './CharacterDeleteModal';
import Alerts from './Alerts';
import CharacterCreation, {CharacterCreationModel} from 'cu-character-creation';
const Animate = require('react-animate.css');
import {events} from 'camelot-unchained';

import {PatcherAlert} from '../redux/modules/patcherAlerts';
import {patcher, Channel} from '../api/PatcherAPI';
import {Server} from '../redux/modules/servers';

import reducer from '../redux/modules/reducer';
import {fetchAlerts, validateAlerts, PatcherAlertsState} from '../redux/modules/patcherAlerts';
import {changeChannel, requestChannels, ChannelState} from '../redux/modules/channels';
import {muteSounds, unMuteSounds} from '../redux/modules/sounds';
import {muteMusic, unMuteMusic} from '../redux/modules/music';
import {fetchServers, changeServer, ServersState} from '../redux/modules/servers';
import {fetchCharacters, selectCharacter, characterCreated, CharactersState} from '../redux/modules/characters';

const lastPlay: any = JSON.parse(localStorage.getItem('cse-patcher-lastplay'));

function select(state: any): any {
  return {
    channelsState: state.channels,
    patcherAlertsState: state.alerts,
    soundMuted: state.soundMuted,
    musicMuted: state.musicMuted,
    serversState: state.servers,
    charactersState: state.characters,
  }
}

export interface SidebarProps {
  dispatch?: (action: any) => void;
  channelsState?: ChannelState;
  patcherAlertsState?: PatcherAlertsState;
  soundMuted?: boolean;
  musicMuted?: boolean;
  serversState?: ServersState;
  charactersState?: CharactersState;
  onLogIn: () => void;
}

export interface SidebarState {
  loggedIn: boolean;
  activeServer: any
  showCreation: boolean;
  characterToDelete: restAPI.SimpleCharacter;
};

class Sidebar extends React.Component<SidebarProps, SidebarState> {
  public name = 'cse-patcher-sidebar';

  private alertsInterval: any = null;
  private channelsInterval: any = null;
  private serversInterval: any = null;

  static propTypes = {
    alerts: React.PropTypes.arrayOf(React.PropTypes.object).isRequired,
  }

  constructor(props: SidebarProps) {
    super(props);
    this.state = {
      loggedIn: false,
      activeServer: null,
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
    dispatch(requestChannels(lastChannel));
    dispatch(fetchServers(lastServer));
    this.fetchCharacters(lastCharacterID);
  }

  onLogOut = () => {
  }

  initjQueryObjects = () => {
    $('.dropdown-button').dropdown();
  }

  fetchCharacters = (selectedCharacterID?: string) => {
    this.props.dispatch(fetchCharacters(selectedCharacterID));
  }

  selectCharacter = (character: restAPI.SimpleCharacter) => {
    this.props.dispatch(selectCharacter(character));
    events.fire('play-sound', 'select');
  }

  generateCharacterButtons = (shardID: any, selectedCharacter: restAPI.SimpleCharacter) : JSX.Element => {
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
    this.fetchCharacters();
    this.setState({ showCreation: false } as any);
  }

  confirmDelete = (character: restAPI.SimpleCharacter) => {
    this.setState({ characterToDelete: character } as any);
  }

  cancelDeleteCharacter = (): void => {
    this.setState({ characterToDelete: null } as any);
  }

  deleteCharacter = (character: restAPI.SimpleCharacter) : void => {
    restAPI.deleteCharacterOnShard(character.shardID, character.id).then(() => {
      this.selectCharacter(null);
      this.fetchCharacters();
    });
    this.setState({ characterToDelete: null } as any);
  }

  componentDidMount() {
    // fetch initial alerts and then every minute validate & fetch alerts again.
    const { dispatch } = this.props;

    this.props.dispatch(fetchAlerts());
    this.alertsInterval = setInterval(() => {
      this.props.dispatch(validateAlerts());
      if (!this.props.patcherAlertsState.isFetching) this.props.dispatch(fetchAlerts());
    }, 60000);
    
    dispatch(requestChannels());
    this.channelsInterval = setInterval(() => {
      //if (!this.props.channelsState.isFetching) todo? 
        dispatch(requestChannels());
    }, 30000);

    if (!this.props.serversState.isFetching)
      dispatch(fetchServers());
    this.serversInterval = setInterval(() => {
      if (!this.props.serversState.isFetching)
        dispatch(fetchServers()); 
    }, 30000);
  }

  componentDidUnMount() {
    // unregister intervals
    clearInterval(this.alertsInterval);
    clearInterval(this.channelsInterval);
    clearInterval(this.serversInterval);
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

    if (this.props.serversState.currentServer) {

        //todo: redux up ServerCounts, componentize character buttons
        renderServerSection = (
          <div>
            <ServerSelect/>
            <CharacterSelect/>
            { this.generateCharacterButtons(this.props.serversState.currentServer.shardID, this.props.charactersState.selectedCharacter) }
            <ServerCounts artCount={this.props.serversState.currentServer.arthurians}
                          tddCount={this.props.serversState.currentServer.tuathaDeDanann}
                          vikCount={this.props.serversState.currentServer.vikings} />
          </div>
        );
    }
    else
    {
      renderServerSection = (
          <div>
            <ServerSelect/>                
          </div>
        );
    }

    return (
      <div id={this.name} className=''>
        <Alerts alerts={this.props.patcherAlertsState.alerts} />
        
        <div className='card-panel no-padding'>
          <div>
            {renderServerSection}
          </div>
          <PatchButton/>
        </div>
      </div>
    );
  }
};

export default connect(select)(Sidebar);
