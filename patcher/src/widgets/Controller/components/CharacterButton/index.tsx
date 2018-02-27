/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';
import { events, webAPI } from 'camelot-unchained';

import { PatcherServer, ServerType } from '../../services/session/controller';
import { patcher, canAccessChannel } from '../../../../services/patcher';
import GameSelect from './components/GameSelect';
import CharacterInfo from './components/CharacterInfo';
import ToolsSelect from './components/ToolsSelect';

const ButtonContainer = styled('div')`
  display: flex;
`;

const HoverArea = styled('div')`
  position: absolute;
  width: 60px;
  height: 70%;
  left: 100px;
  top: -25px;
  transform: rotate(35deg);
  z-index: 10;
  cursor: pointer;
`;

export interface CharacterButtonProps {
  character: webAPI.SimpleCharacter;
  selectedServer: PatcherServer;
  characters: {[id: string]: webAPI.SimpleCharacter};
  servers: {[id: string]: PatcherServer};
  serverType: ServerType;
  selectCharacter: (character: webAPI.SimpleCharacter) => void;
  selectServer: (server: PatcherServer) => void;
  selectServerType: (type: ServerType) => void;
  onNavigateToCharacterSelect: () => void;
}

export interface CharacterButtonState {
  gameMaskOpen: boolean;
  characterInfoOpen: boolean;
}

class CharacterButton extends React.PureComponent<CharacterButtonProps, CharacterButtonState> {
  constructor(props: CharacterButtonProps) {
    super(props);
    this.state = {
      gameMaskOpen: false,
      characterInfoOpen: false,
    };
  }
  public render() {
    const {
      servers,
      character,
      selectedServer,
      onNavigateToCharacterSelect,
      serverType,
      selectServerType,
      selectServer,
    } = this.props;
    return (
      <ButtonContainer>
        {!this.state.gameMaskOpen && <HoverArea className='hover-area' onMouseEnter={this.onGameMaskOpen} />}
        {servers &&
          <GameSelect
            servers={servers}
            serverType={serverType}
            onSelectServerType={selectServerType}
            isOpen={this.state.gameMaskOpen}
            onGameMaskOpen={this.onGameMaskOpen}
            onGameMaskClose={this.onGameMaskClose}
          />
        }
        {serverType === ServerType.CHANNEL &&
          <ToolsSelect
            servers={servers}
            onSelectServer={selectServer}
            selectedServer={selectedServer}
          />
        }
        {serverType === ServerType.CUGAME &&
          <CharacterInfo
            character={character}
            selectedServer={selectedServer}
            onNavigateToCharacterSelect={onNavigateToCharacterSelect}
            isOpen={this.state.characterInfoOpen}
            onCharacterInfoOpen={this.onCharacterInfoOpen}
            onCharacterInfoClose={this.onCharacterInfoClose}
          />
        }
      </ButtonContainer>
    );
  }

  public componentWillReceiveProps(nextProps: CharacterButtonProps) {
    const serversNotEmpty = _.isEmpty(this.props.servers) && !_.isEmpty(nextProps.servers);
    const serverTypeChange = this.props.serverType !== nextProps.serverType;
    const charactersNotEmpty = _.isEmpty(this.props.characters) && !_.isEmpty(nextProps.characters);
    const selectedServerChange = !_.isEqual(this.props.selectedServer, nextProps.selectedServer);

    if (serversNotEmpty || serverTypeChange) {
      this.initializeSelectedServer(nextProps);
    }

    if (charactersNotEmpty || selectedServerChange) {
      this.initializeSelectedCharacter(nextProps);
    }
  }

  public componentDidCatch(error: Error, info: any) {
    console.error(error);
    console.log(info);
  }

  private initializeSelectedServer = (props: CharacterButtonProps) => {
    const values = [];
    const servers = props.servers;
    Object.keys(servers).forEach((key: string) => {
      if (servers[key].type === props.serverType &&
        canAccessChannel(patcher.getPermissions(), servers[key].channelPatchPermissions)) {
        values.push(servers[key]);
      }
    });
    if (props.serverType === ServerType.CHANNEL) {
      this.props.selectServer(values.find(value => value.name === 'Editor') || values[0]);
    } else {
      this.props.selectServer(values[0]);
    }
  }

  private initializeSelectedCharacter = (props: CharacterButtonProps) => {
    const { selectedServer, character, characters } = props;
    const serverCharacters: webAPI.SimpleCharacter[] = [];

    if (!selectedServer || !selectedServer.shardID) {
      this.props.selectCharacter(null);
      return;
    }

    Object.keys(characters).forEach((key) => {
      if (characters[key].shardID.toString() === selectedServer.shardID.toString()) {
        serverCharacters.push(characters[key]);
      }
    });

    if (!character || character === null || !characters[character.id] ||
        character.shardID.toString() !== selectedServer.shardID.toString()) {
      this.props.selectCharacter(serverCharacters[0]);
    }
  }

  private onGameMaskOpen = () => {
    this.setState({ gameMaskOpen: true });
    events.fire('play-sound', 'select-change');
  }

  private onGameMaskClose = () => {
    this.setState({ gameMaskOpen: false });
  }

  private onCharacterInfoOpen = () => {
    if (!this.state.characterInfoOpen) {
      this.setState({ characterInfoOpen: true });
      events.fire('play-sound', 'select-change');
    }
  }

  private onCharacterInfoClose = () => {
    this.setState({ characterInfoOpen: false });
  }
}

export default CharacterButton;
