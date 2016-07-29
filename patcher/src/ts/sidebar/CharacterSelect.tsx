/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {connect} from 'react-redux';
import {fetchCharacters, selectCharacter, characterCreated, CharactersState} from '../redux/modules/characters';
import {ServersState} from '../redux/modules/servers';
import * as events from '../../../../shared/lib/events';
import {components, race, gender, restAPI} from 'camelot-unchained';
import QuickSelect from '../../lib/QuickSelect';

import * as moment from 'moment';

export interface ActiveCharacterViewProps {
  item: restAPI.SimpleCharacter;
};
export interface ActiveCharacterViewState {};
class ActiveCharacterView extends React.Component<ActiveCharacterViewProps, ActiveCharacterViewState> {
  render() {
    const lastLogin: string = this.props.item.lastLogin === '0001-01-01T00:00:00Z' ? 'Never' : moment(this.props.item.lastLogin).fromNow();
    return (
      <div className='character-select quickselect-active'>
        <h5 className='label'>SELECT CHARACTER</h5>
        <div>
          <div className='character-status'><div className={'indicator tooltipped ' + status} data-position='right'
            data-delay='150' data-tooltip={status} /></div>
          <div className='character-details'>
            <h6 className={`character char-${race[this.props.item.race]}-${gender[this.props.item.gender]}`}>
              <div>{this.props.item.name}</div>
              <div className='character-lastlogin'>Last Login: {lastLogin}</div>
            </h6>
          </div>
        </div>
      </div>
    );
  }
}

export interface CharacterListViewProps {
  item: restAPI.SimpleCharacter;
};
export interface CharacterListViewState {};
class CharacterListView extends React.Component<CharacterListViewProps, CharacterListViewState> {
  render() {
    const lastLogin: string = this.props.item.lastLogin === '0001-01-01T00:00:00Z' ? 'Never' : moment(this.props.item.lastLogin).fromNow();
    return (
      <div className='character-select quickselect-list'>
        <div>
          <div className='character-status'><div className={'indicator tooltipped ' + status} data-position='right'
            data-delay='150' data-tooltip={status} /></div>
          <div className='character-details'>
            <h6 className={`character char-${race[this.props.item.race]}-${gender[this.props.item.gender]}`}>{this.props.item.name}<br />
              <div className='character-lastlogin'>Last Login: {lastLogin}</div>
            </h6>
          </div>
        </div>
      </div>
    );
  }
}

function mapToProps(state: any): any {
  return {
    charactersState: state.characters,
    serversState: state.servers
  };
}

export interface CharacterSelectProps {
  dispatch?: (action: any) => void;
  serversState?: ServersState;
  charactersState?: CharactersState;
};

export interface CharacterSelectState {
};

class CharacterSelect extends React.Component<CharacterSelectProps, CharacterSelectState> {
  public name: string = 'cse-patcher-Character-select';
  private characters:Array<restAPI.SimpleCharacter> = new Array<restAPI.SimpleCharacter>();
  private selectedCharacter:restAPI.SimpleCharacter = null;

  constructor(props: CharacterSelectProps) {
    super(props);
  }

  generateActiveView = (character: restAPI.SimpleCharacter) => {
    return <ActiveCharacterView item={character} />
  }

  generateListView = (character: restAPI.SimpleCharacter) => {
    return <CharacterListView item={character} />
  }

  getSelectedIndex = () : number => {
    return this.characters.findIndex((c: restAPI.SimpleCharacter) => c.id === this.selectedCharacter.id);
  }

  onSelectedCharacterChanged = (character: restAPI.SimpleCharacter) => {
    const {dispatch} = this.props;
    dispatch(selectCharacter(character));
    events.fire('play-sound', 'select');
  }

  render() {
    const {charactersState, serversState} = this.props;

    this.characters = charactersState.characters.filter((c: restAPI.SimpleCharacter) => c.shardID == serversState.currentServer.shardID || c.shardID == 0);
    this.selectedCharacter = null;

    if (!this.characters || this.characters.length == 0) {
      return (
        <div className="character-select-none">CREATE CHARACTER</div>
      );
    }

    if (charactersState.selectedCharacter && charactersState.selectedCharacter.shardID == serversState.currentServer.shardID) {
      this.selectedCharacter = charactersState.selectedCharacter;
    } else {
      this.selectedCharacter = this.characters[0];
    }

    return (
        <QuickSelect items={this.characters}
          selectedItemIndex={this.getSelectedIndex()}
          activeViewComponentGenerator={this.generateActiveView}
          listViewComponentGenerator={this.generateListView}
          onSelectedItemChanged={this.onSelectedCharacterChanged} />
    );
  }
}

export default connect(mapToProps)(CharacterSelect);
