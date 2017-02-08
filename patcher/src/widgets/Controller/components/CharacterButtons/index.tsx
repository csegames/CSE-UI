/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {Race, webAPI, events} from 'camelot-unchained';

export interface CharacterButtonsProps {
  creating: boolean;
  selectedCharacter: webAPI.SimpleCharacter,
  onDelete: (character: webAPI.SimpleCharacter) => void;
  onCreate: () => void;
  onCancel: () => void;
};

export interface CharacterButtonsState {
};

class CharacterButtons extends React.Component<CharacterButtonsProps, CharacterButtonsState> {
  public name: string = 'cse-patcher-Character-buttons';

  constructor(props: CharacterButtonsProps) {
    super(props);
  }

  createClicked = (): void => {
    events.fire('play-sound', 'select');
    this.props.creating ? this.props.onCancel() : this.props.onCreate();
  }

  deleteClicked = (): void => {
    events.fire('play-sound', 'select');
    this.props.onDelete(this.props.selectedCharacter);
  }

  render() {
    return (
      <div className="character-buttons">
        <button className={ this.props.creating ? 'cancel' : 'create' }
          onClick={this.createClicked}>{ this.props.creating ? 'Cancel Creation' : 'Create' }</button>
        <button
          className={this.props.selectedCharacter && !this.props.creating ? 'delete' : 'disabled'}
          onClick={this.deleteClicked}
          disabled={!this.props.selectedCharacter || this.props.creating}>Delete</button>
      </div>
    );
  }
}

export default CharacterButtons;
