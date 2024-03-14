/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

import { ControllerContext, ContextState, PatcherServer, ServerType } from '../../ControllerContext';
import GameSelect from './components/GameSelect';
import CharacterInfo from './components/CharacterInfo';
import ToolsSelect from './components/ToolsSelect';
import { SimpleCharacter } from '../../../../api/helpers';
import { ContentPhase } from '../../../../services/ContentPhase';

const ButtonContainer = styled.div`
  display: flex;
`;

export interface ComponentProps {
  serverType: ServerType;
  selectServerType: (type: ServerType) => void;
  onNavigateToCharacterSelect: () => void;
}

export interface InjectedProps {
  selectedServer: PatcherServer;
  selectedCharacter: SimpleCharacter;
  characters: { [id: string]: SimpleCharacter };
  servers: { [id: string]: PatcherServer };
  onUpdateState: (phase: ContentPhase, state: Partial<ContextState>) => void;
}

export type Props = ComponentProps & InjectedProps;

export interface CharacterButtonState {
  hasAccess: boolean;
}

class CharacterButton extends React.PureComponent<Props, CharacterButtonState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasAccess: this.shouldHaveAccess()
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
      selectServerType
    } = this.props;

    return (
      <ButtonContainer>
        {servers && <GameSelect servers={servers} serverType={serverType} onSelectServerType={selectServerType} />}
        {serverType === ServerType.CHANNEL && (
          <ToolsSelect servers={servers} onUpdateState={this.props.onUpdateState} selectedServer={selectedServer} />
        )}
        {serverType === ServerType.CUGAME && (
          <CharacterInfo
            character={selectedCharacter}
            characters={characters}
            servers={servers}
            selectedServer={selectedServer}
            hasAccessToServers={this.state.hasAccess}
            onNavigateToCharacterSelect={onNavigateToCharacterSelect}
          />
        )}
      </ButtonContainer>
    );
  }

  public componentDidUpdate(
    prevProps: Readonly<Props>,
    prevState: Readonly<CharacterButtonState>,
    snapshot?: any
  ): void {
    const shouldHaveAccess = this.shouldHaveAccess();
    if (shouldHaveAccess != this.state.hasAccess) {
      this.setState({ hasAccess: shouldHaveAccess });
    }
  }

  public componentDidCatch(error: Error, info: any) {
    console.error(error);
    console.log(info);
  }

  private shouldHaveAccess() {
    if (this.props.serverType === ServerType.CHANNEL) return false;

    for (const [_, server] of Object.entries(this.props.servers)) {
      if (server.type == this.props.serverType) return true;
    }
    return false;
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
