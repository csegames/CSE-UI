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
import CharacterCreation, {CharacterCreationModel} from '../../../../shared/widgets/CharacterCreation';
import Animate from '../../../../shared/components/Animate';
import * as events from '../../../../shared/lib/events';

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
  private channelInterval: any = null;
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
    const lastCharacterID = lastPlay && lastPlay.characterID ? lastPlay.characterID : null;
    this.fetchCharacters(lastCharacterID);
    this.props.onLogIn();
    this.props.dispatch(requestChannels());
  }

  onLogOut = () => {
  }

  initjQueryObjects = () => {
    $('.dropdown-button').dropdown();
    //$('.tooltipped').tooltip();
  }

  fetchCharacters = (selectedCharacterID?: string) => {
    this.props.dispatch(fetchCharacters(selectedCharacterID));
  }

  onSelectedServerChanged = (server: Server) => {
    this.props.dispatch(changeServer(server));
    events.fire('play-sound', 'select');
  }

  onSelectedChannelChanged = (channel: Channel) => {
    this.selectCharacter(null);
    this.props.dispatch(changeChannel(channel));
    events.fire('play-sound', 'select');
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
    this.props.dispatch(fetchAlerts());
    this.alertsInterval = setInterval(() => {
      this.props.dispatch(validateAlerts());
      if (!this.props.patcherAlertsState.isFetching) this.props.dispatch(fetchAlerts());
    }, 60000);

    // fetch initial channels and then every minute fetch channels again
    const lastChannel = lastPlay && lastPlay.channelID ? lastPlay.channelID : null;
    this.props.dispatch(requestChannels(lastChannel));
    this.channelInterval = setInterval(() => {
      this.props.dispatch(requestChannels());
    }, 60000);

    // fetch initial servers and then every 30 seconds fetch servers again.
    const lastServer = lastPlay && lastPlay.serverName ? lastPlay.serverName : null;
    this.props.dispatch(fetchServers(lastServer));
    this.serversInterval = setInterval(() => {
      if (!this.props.serversState.isFetching) this.props.dispatch(fetchServers());
    }, 30000);
  }

  componentDidUnMount() {
    // unregister intervals
    clearInterval(this.alertsInterval);
    clearInterval(this.channelInterval);
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
    let selectedServer: Server = null;
    let selectedCharacter: restAPI.SimpleCharacter = null;
    let selectedChannel: Channel = null;
    let selectedChannelIndex: number = -1;
    if (this.props.serversState.servers.length > 0 && typeof(this.props.channelsState.channels) !== 'undefined' && this.props.channelsState.channels.length > 0) {
      selectedChannel = this.props.channelsState.selectedChannel;
      selectedChannelIndex = this.props.channelsState.channels.findIndex(c => c.channelID == selectedChannel.channelID);
      if (typeof(selectedChannelIndex) == 'undefined') selectedChannelIndex = 0;

      let servers = this.props.serversState.servers.filter((s: Server) => s.channelID === selectedChannel.channelID);
      if (servers.length > 0) {
        if (this.props.serversState.currentServer) {
          for (let i: number = 0; i < servers.length; i++) {
            if (this.props.serversState.currentServer.name == servers[i].name) {
              selectedServer = servers[i];
            }
          }
        }
        if (!selectedServer) selectedServer = servers[0];

        // Hide localhost for normal users
        for (let i: number = 0; i < servers.length; i++) {
          if (servers[i].name === 'localhost' && patcher.getScreenName().search(/^cse/i) === -1) {
            servers.splice(i, 1);
            i--;
          }
        }

        let characters = this.props.charactersState.characters.filter((c: restAPI.SimpleCharacter) => c.shardID == selectedServer.shardID || c.shardID == 0);
        selectedCharacter = this.props.charactersState.selectedCharacter;
        if (!selectedCharacter) selectedCharacter = characters[0];
        renderServerSection = (
          <div>
            <ServerSelect servers={servers}
                          selectedServer={selectedServer}
                          onSelectedServerChanged={this.onSelectedServerChanged} />
            <CharacterSelect characters={characters}
                             selectedCharacter={selectedCharacter}
                             onCharacterSelectionChanged={this.selectCharacter} />
            { this.generateCharacterButtons(selectedServer.shardID, selectedCharacter) }
            <ServerCounts artCount={selectedServer.arthurians}
                          tddCount={selectedServer.tuathaDeDanann}
                          vikCount={selectedServer.vikings} />
          </div>
        );
      }
    }

    return (
      <div id={this.name} className=''>
        <Alerts alerts={this.props.patcherAlertsState.alerts} />
        <ChannelSelect channels={this.props.channelsState.channels} selectedChannelIndex={selectedChannelIndex} onSelectedChannelChanged={this.onSelectedChannelChanged} />
        <div className='card-panel no-padding'>
          {renderServerSection}
          <PatchButton server={selectedServer}
                       channelIndex={selectedChannelIndex}
                       character={selectedCharacter}
                       fetchCharacters={() => this.props.dispatch(fetchCharacters())} />
        </div>
      </div>
    );
  }
};

//export default Sidebar;
export default connect(select)(Sidebar);