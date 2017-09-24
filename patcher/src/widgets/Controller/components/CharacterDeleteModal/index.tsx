/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import {
  webAPI,
  events,
  Spinner,
  Tooltip,
  client,
} from 'camelot-unchained';

export interface CharacterDeleteModalProps {
  character: webAPI.SimpleCharacter;
  closeModal: () => void;
  onSuccess: () => void;
}

export interface CharacterDeleteModalState {
  deleteEnabled: boolean;
  deleting: boolean;
  error: string;
  success: boolean;
}

class CharacterDeleteModal extends React.Component<CharacterDeleteModalProps, CharacterDeleteModalState> {

  constructor(props: CharacterDeleteModalProps) {
    super(props);
    this.state = {
      deleteEnabled: false,
      deleting: false,
      error: null,
      success: false,
    };
  }

  public render() {
    return (
      <div className='CharacterDeleteModal'>
        <div className='CharacterDeleteModal__title'>Delete character?</div>
        <div className='CharacterDeleteModal__text'>Warning! This cannot be undone.</div>
        <label>Enter character name to confirm</label>
        <input id='name' ref='name' type='text' onKeyUp={this.onKeyUp}/>
        {
          this.state.error ?
            <div className='ChracterDeleteModal__error'>
              <Tooltip content={() => <span>{this.state.error || 'An unknown error occurred.'}</span>}>
                  <i className='fa fa-exclamation-circle'></i> Delete failed.
                </Tooltip>
            </div> :
            null
        }

        {
          this.state.success ?
            <div className='ChracterDeleteModal__success'>
              <Tooltip content={() => <span>{`${this.props.character.name} was deleted.`}</span>}
                      styles={{tooltip: {maxWidth: '400px'}}}>
                  <i className='fa fa-info-circle'></i> Success!
                </Tooltip>
            </div> :
            null
        }
        <div className='CharacterDeleteModal__buttons'>
          {
            this.state.deleting ?
              <button className='CharacterDeleteModal__button'>
                <Spinner />
              </button> :
              <button className='CharacterDeleteModal__button'
                      disabled={!this.state.deleteEnabled}
                      onClick={this.deleteCharacter}>
                Delete
              </button>

          }
          <button className='CharacterDeleteModal__button' onClick={this.cancelDelete}>Cancel</button>
        </div>
      </div>
    );
  }

  public componentDidMount() {
    (this.refs['name'] as HTMLInputElement).focus();
  }

  private onKeyUp = (e: React.KeyboardEvent<HTMLInputElement>) : void => {
    const input : HTMLInputElement = this.refs['name'] as HTMLInputElement;
    this.setState({ deleteEnabled: input.value === this.props.character.name });
  }

  private deleteCharacter = async () => {
    await events.fire('play-sound', 'select');
    await this.setState({ deleting: true });

    const character = this.props.character;
    try {
      const res = await webAPI.CharactersAPI.DeleteCharacterV1(
        webAPI.defaultConfig,
        client.loginToken,
        character.shardID,
        character.id,
      );
      const data = JSON.parse(res.data);
      if (res.ok) {
        // success

        this.setState({ success: true, error: null, deleting: false });

        setTimeout(() => {
          this.props.onSuccess();
        }, 200);
        return;
      }
      // failed 
      this.setState({ deleting: false, success: false, error: data.Message });
    } catch (err) {
      webAPI.handleWebAPIError(err);
      this.setState({ deleting: false, success: false, error: err });
    }
  }

  private cancelDelete = (): void => {
    this.props.closeModal();
    events.fire('play-sound', 'select');
  }
}

export default CharacterDeleteModal;
