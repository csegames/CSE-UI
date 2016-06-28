/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {restAPI} from 'camelot-unchained';
import * as events from "../../../../shared/lib/events";

export interface CharacterDeleteModalProps {
  character: restAPI.SimpleCharacter;
  closeModal: () => void;
  deleteCharacter: (character: restAPI.SimpleCharacter) => void;
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
      <div className="modal-dialog character-delete">
        <div className="input-field">
          <input id="name" ref="name" type="text" onKeyUp={this.onKeyUp}/>
          <label htmlFor="name">Confirm name of character to be deleted:</label>
        </div>
        <button className="wave-effects btn-flat" disabled={!this.state.deleteEnabled} onClick={this.deleteCharacter}>DELETE</button>
        <button className="wave-effects btn-flat" onClick={this.cancelDelete}>CANCEL</button>
      </div>
    );
  }
}

export default CharacterDeleteModal;
