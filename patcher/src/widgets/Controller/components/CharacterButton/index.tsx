/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

import { patcher } from '../../../../services/patcher';
import { ControllerContext, ContextState, PatcherServer, ServerType } from '../../ControllerContext';
import GameSelect from './components/GameSelect';
import CharacterInfo from './components/CharacterInfo';
import ToolsSelect from './components/ToolsSelect';
import { SimpleCharacter } from 'gql/interfaces';

const ButtonContainer = styled.div`
  display: flex;
`;

const HoverArea = styled.div`
  position: absolute;
  width: 60px;
  height: 70%;
  left: 100px;
  top: -25px;
  transform: rotate(35deg);
  z-index: 10;
  cursor: pointer;
`;

export interface ComponentProps {
  serverType: ServerType;
  selectServerType: (type: ServerType) => void;
  onNavigateToCharacterSelect: () => void;
}

export interface InjectedProps {
  selectedServer: PatcherServer;
  selectedCharacter: SimpleCharacter;
  characters: {[id: string]: SimpleCharacter};
  servers: {[id: string]: PatcherServer};
  onUpdateState: (state: Partial<ContextState>) => void;
}

export type Props = ComponentProps & InjectedProps;

export interface CharacterButtonState {
  hasAccess: boolean;
}

class CharacterButton extends React.PureComponent<Props, CharacterButtonState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasAccess: false,
    };
  }

  public render() {
    const {
      servers,
      selectedCharacter,
      characters,
      selectedServer,
      onNavigateToCharacterSelect,
      serverType,
      selectServerType,
    } = this.props;

    if (selectedServer === null || typeof selectedServer === 'undefined' || selectedServer.type !== this.props.serverType) {
      this.initializeSelectedServer(this.props);
    }

    if (!selectedCharacter || selectedCharacter === null || !characters[selectedCharacter.id] ||
        (selectedServer && selectedCharacter.shardID !== selectedServer.shardID)) {
      setTimeout(() => this.initializeSelectedCharacter(this.props), 100);
    }

    return (
      <ButtonContainer>
        <HoverArea />
        {servers &&
          <GameSelect
            servers={servers}
            serverType={serverType}
            onSelectServerType={selectServerType}
          />
        }
        {serverType === ServerType.CHANNEL &&
          <ToolsSelect
            servers={servers}
            onUpdateState={this.props.onUpdateState}
            selectedServer={selectedServer}
          />
        }
        {serverType === ServerType.CUGAME &&
          <CharacterInfo
            character={selectedCharacter}
            characters={characters}
            servers={servers}
            selectedServer={selectedServer}
            hasAccessToServers={this.state.hasAccess}
            onNavigateToCharacterSelect={onNavigateToCharacterSelect}
          />
        }
      </ButtonContainer>
    );
  }

  public componentDidMount() {
    this.checkForAccess();
  }

  public componentDidCatch(error: Error, info: any) {
    console.error(error);
    console.log(info);
  }

  private checkForAccess = () => {
    const servers = this.getServersWithPatchPermissions(this.props);
    if (servers.length === 0) {
      this.setState({ hasAccess: false });
    } else if (this.props.serverType !== ServerType.CHANNEL) {
      this.setState({ hasAccess: true });
    }
  }

  private getServersWithPatchPermissions = (props: Props) => {
    const values: PatcherServer[] = [];
    const servers = props.servers;
    Object.keys(servers).forEach((key: string) => {
      if (servers[key].type === props.serverType && patcher.getPermissions() & servers[key].channelPatchPermissions) {
        values.push(servers[key]);
      }
    });

    return values;
  }

  private initializeSelectedServer = (props: Props) => {
    const servers: PatcherServer[] = this.getServersWithPatchPermissions(props);

    if (servers.length === 0) {
      this.setState({ hasAccess: false });
      this.props.onUpdateState({ selectedServer: null });
      return;
    }

    this.setState({ hasAccess: true });
  }

  private initializeSelectedCharacter = (props: Props) => {
    const { selectedServer, selectedCharacter, characters } = props;
    const serverCharacters: SimpleCharacter[] = [];

    if (!selectedServer || !selectedServer.shardID) {
      return;
    }

    Object.keys(characters).forEach((key) => {
      if (characters[key].shardID.toString() === selectedServer.shardID.toString()) {
        serverCharacters.push(characters[key]);
      }
    });

    if (serverCharacters) {
      serverCharacters.sort((a, b) => {
        return Date.parse(b.lastLogin) - Date.parse(a.lastLogin);
      });
    }

    if (!selectedCharacter || selectedCharacter === null || !characters[selectedCharacter.id] ||
        selectedCharacter.shardID.toString() !== selectedServer.shardID.toString()) {
      const lastSelectedCharacterID = localStorage.getItem('cu-patcher-last-selected-character-id');
      const lastSelectedCharacter = serverCharacters.find((char: SimpleCharacter) =>
        char.id === lastSelectedCharacterID);
      this.props.onUpdateState({ selectedCharacter: lastSelectedCharacter || serverCharacters[0] });
    }
  }
}

class CharacterButtonWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    return (
      <ControllerContext.Consumer>
        {({ characters, servers, selectedCharacter, selectedServer, onUpdateState }) => (
          <CharacterButton
            {...this.props}
            characters={characters}
            servers={servers}
            selectedCharacter={selectedCharacter}
            selectedServer={selectedServer}
            onUpdateState={onUpdateState}
          />
        )}
      </ControllerContext.Consumer>
    );
  }
}

export default CharacterButtonWithInjectedContext;
