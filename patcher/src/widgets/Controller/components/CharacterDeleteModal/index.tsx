/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {webAPI, events} from 'camelot-unchained';

export interface CharacterDeleteModalProps {
  character: webAPI.SimpleCharacter;
  closeModal: () => void;
  deleteCharacter: (character: webAPI.SimpleCharacter) => void;
}

export interface CharacterDeleteModalState {
  deleteEnabled: boolean;
}

class CharacterDeleteModal extends React.Component<CharacterDeleteModalProps, CharacterDeleteModalState> {

  constructor(props: CharacterDeleteModalProps) {
    super(props);
    this.state = this.initialState();
  }

  initialState(): CharacterDeleteModalState {
    return { deleteEnabled: false };
  }

  componentDidMount() {
    (this.refs['name'] as HTMLInputElement).focus();
  }

  onKeyUp = (e: React.KeyboardEvent) : void => {
    const input : HTMLInputElement = this.refs['name'] as HTMLInputElement;
    this.setState({ deleteEnabled: input.value === this.props.character.name });
  }

  deleteCharacter = (): void => {
    this.props.deleteCharacter(this.props.character);
    events.fire('play-sound', 'select');
  }

  cancelDelete = (): void => {
    this.props.closeModal();
    events.fire('play-sound', 'select');
  }


  render() {
    return (
      <div className='CharacterDeleteModal'>
        <div className='CharacterDeleteModal__title'>Delete character?</div>
        <div className='CharacterDeleteModal__text'>Warning! This cannot be undone.</div>
        <label>Enter character name to confirm</label>
        <input id='name' ref='name' type='text' onKeyUp={this.onKeyUp}/>
        <div className='CharacterDeleteModal__buttons'>
          <button className='CharacterDeleteModal__button' disabled={!this.state.deleteEnabled} onClick={this.deleteCharacter}>DELETE</button>
          <button className='CharacterDeleteModal__button' onClick={this.cancelDelete}>CANCEL</button>
        </div>
      </div>
    );
  }
}

export default CharacterDeleteModal;
