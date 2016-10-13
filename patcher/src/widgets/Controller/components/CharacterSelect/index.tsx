/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-09-07 12:15:34
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-10-28 17:34:08
 */

import * as React from 'react';
import {connect} from 'react-redux';
import {components, race, gender, webAPI, events, utils, archetype, archetypeToString, raceToString} from 'camelot-unchained';
import QuickSelect from '../../../../components/QuickSelect';
import {ServerType, PatcherServer} from '../../services/session/controller';
import CharacterDeleteModal from '../CharacterDeleteModal';

import * as moment from 'moment';

export interface ActiveCharacterViewProps {
  character: webAPI.characters.SimpleCharacter;
};
export interface ActiveCharacterViewState {};
class ActiveCharacterView extends React.Component<ActiveCharacterViewProps, ActiveCharacterViewState> {
  render() {
    const {character} = this.props;
    const lastLogin: string = character.lastLogin === '0001-01-01T00:00:00Z' ? 'Never' : moment(character.lastLogin).fromNow();
    return (
      <div className='ActiveCharacterView'>
        <i className={`char-icon char-icon--${race[character.race]}-${gender[character.gender]}`}></i>
        <div className='ActiveCharacterView__details'>
          <div>{character.name}</div>
          <div className='ActiveCharacterView__details__login'>{archetypeToString(character.archetype)} - {raceToString(character.race)}</div>
        </div>
      </div>
    );
  }
}

export interface CharacterListViewProps {
  character: webAPI.characters.SimpleCharacter;
};
export interface CharacterListViewState {
  showDeleteConfirmation: boolean;
};
class CharacterListView extends React.Component<CharacterListViewProps, CharacterListViewState> {
  constructor(props: CharacterListViewProps) {
    super(props);
    this.state = {showDeleteConfirmation: false};
  }

  showDeleteConfirmation = (show: boolean) => {
    this.setState({showDeleteConfirmation: show})
  }

  deleteCharacter = () => {
    const {character} = this.props;
    webAPI.characters.deleteCharacter(character.shardID, character.id);
    this.showDeleteConfirmation(false);
  }

  render() {
    const {character} = this.props;
    const lastLogin: string = character.lastLogin === '0001-01-01T00:00:00Z' ? 'Never' : moment(character.lastLogin).fromNow();
    return (
      <div className='ActiveCharacterView'>
        <i className={`char-icon char-icon--${race[character.race]}-${gender[character.gender]}`}></i>
        <div className='ActiveCharacterView__details'>
          <div>{character.name}</div>
          <div className='ActiveCharacterView__details__login'>{archetypeToString(character.archetype)} - {raceToString(character.race)}</div>
        </div>
        <div className='ActiveCharacterView__controls'>
          <span className='simptip-position-left simptip-fade' data-tooltip='coming soon'>
            <i className="fa fa-info-circle" aria-hidden="true"></i>
          </span>
          <span className='simptip-position-left simptip-fade' data-tooltip='delete character'>
            <i className="fa fa-times" onClick={() => this.showDeleteConfirmation(true)}></i>
          </span>
        </div>
        {this.state.showDeleteConfirmation ? (
          <div className='fullscreen-blackout'>
            <CharacterDeleteModal
              character={character}
              closeModal={() => this.showDeleteConfirmation(false)}
              deleteCharacter={this.deleteCharacter}/>
          </div>
        ) : null}
      </div>
    );
  }
}

export interface CharacterSelectProps {
  characters: utils.Dictionary<webAPI.characters.SimpleCharacter>,
  selectCharacter: (character: webAPI.characters.SimpleCharacter) => void,
  selectedServer: PatcherServer;
};

export interface CharacterSelectState {
  selectedCharacter: webAPI.characters.SimpleCharacter;
  createdName: string;
}

class CharacterSelect extends React.Component<CharacterSelectProps, CharacterSelectState> {
  public name: string = 'cse-patcher-Character-select';
  private characters:Array<webAPI.characters.SimpleCharacter> = new Array<webAPI.characters.SimpleCharacter>();
  private selectedCharacter:webAPI.characters.SimpleCharacter = null;

  constructor(props: CharacterSelectProps) {
    super(props);

    this.state = {
      selectedCharacter: null,
      createdName: null,
    };
  }

  componentDidMount() {
    events.on('character-created', (name: string) => {
      this.setState({ createdName: name } as any);
    });
  }

  componentWillUnmount() {
    events.off('character-created');
  }

  selectCharacter = (character: webAPI.characters.SimpleCharacter) => {
    this.props.selectCharacter(character);
    this.setState({selectedCharacter: character} as any);
  }

  public onSelectedServerChanged = (server: PatcherServer) => {
    console.log('on selected server changed -- character select')
    this.setState({selectedServer: server} as any);
  }

  render() {
    const {selectedServer} = this.props;

    // If no server, we have no characters to display selections for.
    if (!selectedServer || selectedServer == null) {
      console.log('no server selected');
      return null;
    }

    const {characters} = this.props;

    let serverCharacters: webAPI.characters.SimpleCharacter[] = [];
    for (const key in characters) {
      if (characters[key].shardID === selectedServer.shardID) serverCharacters.push(characters[key]); 
    }

    if (serverCharacters.length == 0) {
      return (
        // TODO: Do this better
        <QuickSelect items={[]}
                        containerClass='CharacterSelect'
                        selectedItemIndex={-1}
                        activeViewComponentGenerator={c => (
                            <div className='ActiveCharacterView ActiveCharacterView--none'>
                              NO CHARACTERS
                            </div>
                          )}
                        listViewComponentGenerator={c => null}
                        onSelectedItemChanged={() => null} />
      );
    }

    serverCharacters.sort((a, b) => Date.parse(b.lastLogin) - Date.parse(a.lastLogin));

    let {selectedCharacter, createdName} = this.state;
    if (createdName) {
      for (let i = 0; i < serverCharacters.length; ++i) {
        if (serverCharacters[i].name === createdName) {
          selectedCharacter = serverCharacters[i];
          this.props.selectCharacter(selectedCharacter);
          setTimeout(() => this.setState({
            createdName: null,
            selectedCharacter: selectedCharacter,
          } as any), 100);
          break;
        }
      }
    }
    if (!selectedCharacter || selectedCharacter === null || !this.props.characters[selectedCharacter.id] || selectedCharacter.shardID != selectedServer.shardID) {
      // get from local storage or use the first in the list.
      selectedCharacter = serverCharacters[0];
      this.props.selectCharacter(selectedCharacter);
    }

    return <QuickSelect items={serverCharacters}
                        containerClass='CharacterSelect'
                        selectedItemIndex={utils.findIndexWhere(serverCharacters, c => c.id === selectedCharacter.id)}
                        activeViewComponentGenerator={c => <ActiveCharacterView character={c} />}
                        listViewComponentGenerator={c => <CharacterListView character={c} />}
                        onSelectedItemChanged={this.selectCharacter} />;
  }
}

export default CharacterSelect;
