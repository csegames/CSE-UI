/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import { webAPI, events, client, RequestConfig } from '@csegames/camelot-unchained';
import CharacterDeleteModalView from './components/CharacterDeleteModalView';
import { PatcherServer } from '../../services/session/controller';
import { patcher } from '../../../../services/patcher';

export interface CharacterDeleteModalProps {
  servers: {[id: string]: PatcherServer};
  character: webAPI.SimpleCharacter;
  closeModal: () => void;
  onSuccess: (id: string) => void;
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
      <div>
        <CharacterDeleteModalView
          error={this.state.error}
          success={this.state.success}
          deleting={this.state.deleting}
          deleteEnabled={this.state.deleteEnabled}
          onChange={this.onChange}
          onDeleteCharacter={this.deleteCharacter}
          onCancelDelete={this.cancelDelete}
        />
      </div>
    );
  }

  private onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ deleteEnabled: e.target.value === this.props.character.name });
  }

  private deleteCharacter = async () => {
    await events.fire('play-sound', 'select');
    await this.setState({ deleting: true });

    const character = this.props.character;
    try {
      const config: RequestConfig = () => ({
        url: _.values(this.props.servers).find(server => server.shardID === character.shardID).apiHost + '/',
        headers: {
          Authorization: `${client.ACCESS_TOKEN_PREFIX} ${patcher.getAccessToken()}`,
        },
      });
      const res = await webAPI.CharactersAPI.DeleteCharacterV1(config, character.shardID, character.id);
      const data = JSON.parse(res.data);
      if (res.ok) {
        // success

        this.setState({ success: true, error: null, deleting: false });

        setTimeout(() => {
          this.props.onSuccess(character.id);
        }, 200);
        return;
      }
      // failed
      this.setState({
        deleting: false,
        success: false,
        error: data.Message || 'Uh oh... There was an error deleting your character!',
      });
    } catch (err) {
      console.error(err);
      this.setState({
        deleting: false,
        success: false,
        error: 'Uh oh... There was an error in deleting your character!',
      });
    }
  }

  private cancelDelete = (): void => {
    this.props.closeModal();
    events.fire('play-sound', 'select');
  }
}

export default CharacterDeleteModal;
