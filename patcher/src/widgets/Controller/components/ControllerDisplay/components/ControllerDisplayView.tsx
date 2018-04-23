/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { webAPI } from '@csegames/camelot-unchained';

import Login from '../../Login';
import Alerts from '../../Alerts';
import PatchButton from '../../PatchButton';
import CharacterSelect from '../../CharacterSelect';
import ProgressBar from '../../ProgressBar';
import CharacterButton from '../../CharacterButton';
import { patcher } from '../../../../../services/patcher';
import { APIServerStatus } from '../index';

import { Routes } from '../../../../../services/session/routes';
import {
  ControllerState,
  PatcherServer,
  ServerType,
} from '../../../services/session/controller';


const Container = styled('div')`
  position: relative;
  background-color: transparent;
  z-index: 100;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  -webkit-user-select: none;
  user-select: none;
`;

const ControllerBody = styled('div')`
  flex: 1;
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

export interface ControllerDisplayViewProps {
  activeRoute: Routes;
  controllerState: ControllerState;
  selectedServer: PatcherServer;
  selectedCharacter: webAPI.SimpleCharacter;
  charSelectVisible: boolean;
  serverType: ServerType;
  apiServerStatus: APIServerStatus;
  onLogin: () => void;
  onChooseCharacter: (character: webAPI.SimpleCharacter) => void;
  onToggleCharacterSelect: () => void;
  onDeleteCharacterSuccess: (id: string) => void;
  selectCharacter: (character: webAPI.SimpleCharacter) => void;
  selectServer: (server: PatcherServer) => void;
  selectServerType: (serverType: ServerType) => void;
}

export interface ControllerDisplayViewState {
  initialCharSelectOpen: boolean;
}

class ControllerDisplayView extends React.Component<ControllerDisplayViewProps, ControllerDisplayViewState> {
  constructor(props: ControllerDisplayViewProps) {
    super(props);
    this.state = {
      initialCharSelectOpen: true,
    };
  }

  public render() {
    const { activeRoute } = this.props;
    const { alerts, servers, characters } = this.props.controllerState;
    const selectedServer = this.props.selectedServer ? servers[this.props.selectedServer.name] : null;
    const selectedCharacter = this.props.selectedCharacter ? characters[this.props.selectedCharacter.id] : null;
    const alertArray: webAPI.PatcherAlert[] = [];
    for (const key in alerts) alertArray.push(alerts[key]);

    if (!patcher.hasLoginToken()) {
      return (
        <Container>
          <Login onLogin={this.props.onLogin} />
          <Alerts alerts={alertArray} />
        </Container>
      );
    }

    return (
      <Container>
        {!this.state.initialCharSelectOpen &&
          <div style={{ display: this.props.charSelectVisible ? 'block' : 'none' }}>
            <CharacterSelect
              charSelectVisible={this.props.charSelectVisible}
              servers={this.props.controllerState.servers}
              characters={this.props.controllerState.characters}
              selectedCharacter={selectedCharacter}
              selectedServer={selectedServer}
              onChooseCharacter={this.props.onChooseCharacter}
              onCloseClick={this.props.onToggleCharacterSelect}
              onDeleteCharacterSuccess={this.props.onDeleteCharacterSuccess}
              apiServerStatus={this.props.apiServerStatus}
            />
          </div>
        }
        {!this.props.charSelectVisible &&
          activeRoute !== Routes.NEWS && activeRoute !== Routes.CHAT && activeRoute !== Routes.PATCHNOTES &&
          <ControllerBody>
            <CharacterButton
              character={selectedCharacter}
              characters={this.props.controllerState.characters}
              selectedServer={selectedServer}
              selectCharacter={this.props.selectCharacter}
              servers={this.props.controllerState.servers}
              serverType={this.props.serverType}
              selectServer={this.props.selectServer}
              selectServerType={this.props.selectServerType}
              onNavigateToCharacterSelect={this.props.onToggleCharacterSelect}
            />
            <PatchButton
              servers={this.props.controllerState.servers}
              selectedServer={selectedServer}
              selectedCharacter={selectedCharacter}
            />
          </ControllerBody>
        }
        <ProgressBar
          servers={this.props.controllerState.servers}
          selectedServer={selectedServer}
        />
      </Container>
    );
  }

  public componentWillReceiveProps(nextProps: ControllerDisplayViewProps) {
    if (this.state.initialCharSelectOpen && !this.props.charSelectVisible && nextProps.charSelectVisible) {
      this.setState({ initialCharSelectOpen: false });
    }
  } 
}

export default ControllerDisplayView;
