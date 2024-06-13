/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

import Login from '../Login';
import PatchButton from '../PatchButton';
import CharacterSelect from '../CharacterSelect';
import ProgressBar from '../ProgressBar';
import CharacterButton from '../CharacterButton';
import { APIServerStatus } from '.';

import { Routes } from '../../../../services/session/routes';
import { PatcherServer, ServerType } from '../../ControllerContext';
import { SimpleCharacter } from '../../../../api/helpers';
import { ContentPhase } from '../../../../services/ContentPhase';

const Container = styled.div`
  position: relative;
  background-color: transparent;
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  -webkit-user-select: none;
  user-select: none;
`;

const ControllerBody = styled.div`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

const VersionNumber = styled.div`
  position: fixed;
  bottom: 5px;
  right: 5px;
  font-size: 10px;
  color: white;
  z-index: 9999;
  font-family: Caudex;
`;

export interface ComponentProps {
  phase: ContentPhase;
  activeRoute: Routes;
  charSelectVisible: boolean;
  serverType: ServerType;
  apiServerStatus: APIServerStatus;
  onToggleCharacterSelect: () => void;
  onDeleteCharacterSuccess: (id: string) => void;
  selectServerType: (serverType: ServerType) => void;
}

export interface InjectedProps {
  characters: { [id: string]: SimpleCharacter };
  servers: { [id: string]: PatcherServer };
  selectedServer: PatcherServer;
  selectedCharacter: SimpleCharacter;
}

export type Props = ComponentProps & InjectedProps;

export interface ControllerDisplayViewState {
  initialCharSelectOpen: boolean;
}

export class ControllerDisplayView extends React.Component<Props, ControllerDisplayViewState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      initialCharSelectOpen: true
    };
  }

  public render() {
    const { activeRoute, selectedServer, selectedCharacter } = this.props;

    if (this.props.phase == ContentPhase.Login) {
      return (
        <Container style={{ pointerEvents: 'none' }}>
          <Login />
          <VersionNumber>v0.2.0</VersionNumber>
        </Container>
      );
    }

    const displayCharacter =
      !this.props.charSelectVisible &&
      activeRoute !== Routes.NEWS &&
      activeRoute !== Routes.CHAT &&
      activeRoute !== Routes.PATCHNOTES;

    return (
      <Container>
        {!this.state.initialCharSelectOpen && (
          <div style={{ display: this.props.charSelectVisible ? 'block' : 'none' }}>
            <CharacterSelect
              charSelectVisible={this.props.charSelectVisible}
              onCloseClick={this.props.onToggleCharacterSelect}
              onDeleteCharacterSuccess={this.props.onDeleteCharacterSuccess}
              apiServerStatus={this.props.apiServerStatus}
            />
          </div>
        )}
        {displayCharacter && (
          <ControllerBody>
            <CharacterButton
              serverType={this.props.serverType}
              selectServerType={this.props.selectServerType}
              onNavigateToCharacterSelect={this.props.onToggleCharacterSelect}
            />
            <PatchButton
              servers={this.props.servers}
              selectedServer={selectedServer}
              selectedCharacter={selectedCharacter}
            />
          </ControllerBody>
        )}
        <ProgressBar servers={this.props.servers} selectedServer={selectedServer} />
      </Container>
    );
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (this.state.initialCharSelectOpen && !this.props.charSelectVisible && nextProps.charSelectVisible) {
      this.setState({ initialCharSelectOpen: false });
    }
  }
}
