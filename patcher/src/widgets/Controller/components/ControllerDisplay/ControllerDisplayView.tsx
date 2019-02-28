/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from 'linaria/react';

import Login from '../Login';
// import Alerts from '../Alerts';
// import PatcherError from '../PatcherError';
// import FatalError from '../FatalError';
import PatchButton from '../PatchButton';
import CharacterSelect from '../CharacterSelect';
import ProgressBar from '../ProgressBar';
import CharacterButton from '../CharacterButton';
import { patcher } from '../../../../services/patcher';
import { APIServerStatus } from '.';

import { Routes } from '../../../../services/session/routes';
import { ControllerContext, PatcherServer, ServerType } from '../../ControllerContext';
import { SimpleCharacter } from 'gql/interfaces';

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
  activeRoute: Routes;
  charSelectVisible: boolean;
  serverType: ServerType;
  apiServerStatus: APIServerStatus;
  onLogin: () => void;
  onToggleCharacterSelect: () => void;
  onDeleteCharacterSuccess: (id: string) => void;
  selectServerType: (serverType: ServerType) => void;
}

export interface InjectedProps {
  characters: {[id: string]: SimpleCharacter};
  servers: {[id: string]: PatcherServer};
  selectedServer: PatcherServer;
  selectedCharacter: SimpleCharacter;
}

export type Props = ComponentProps & InjectedProps;

export interface ControllerDisplayViewState {
  initialCharSelectOpen: boolean;
}

class ControllerDisplayView extends React.Component<Props, ControllerDisplayViewState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      initialCharSelectOpen: true,
    };
  }

  public render() {
    const { activeRoute, servers, characters } = this.props;
    // const { alerts, errors } = this.props.controllerState;
    const selectedServer = this.props.selectedServer ? servers[this.props.selectedServer.name] : null;
    const selectedCharacter = this.props.selectedCharacter ? characters[this.props.selectedCharacter.id] : null;

    // const alertArray: webAPI.PatcherAlert[] = [];
    // for (const key in alerts) alertArray.push(alerts[key]);

    // if (errors && errors.length) {
    //   for (let i = 0; i < errors.length; i++) {
    //     if (errors[i].fatal) {
    //       return <FatalError errors={errors}/>;
    //     }
    //   }
    // }

    if (!patcher.hasAccessToken() && activeRoute !== Routes.NEWS) {
      return (
        <Container style={{ pointerEvents: 'none' }}>
          <Login onLogin={this.props.onLogin} />
          {/* <Alerts alerts={alertArray} /> */}
          {/* <PatcherError errors={errors} onClear={this.props.onClearError}/> */}
          <VersionNumber>v0.1.9</VersionNumber>
        </Container>
      );
    }

    return (
      <Container>
        {!this.state.initialCharSelectOpen &&
          <div style={{ display: this.props.charSelectVisible ? 'block' : 'none' }}>
            <CharacterSelect
              charSelectVisible={this.props.charSelectVisible}
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
        }
        <ProgressBar
          servers={this.props.servers}
          selectedServer={selectedServer}
        />
        {/* <Alerts alerts={alertArray} />
        <PatcherError errors={errors} onClear={this.props.onClearError}/> */}
      </Container>
    );
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (this.state.initialCharSelectOpen && !this.props.charSelectVisible && nextProps.charSelectVisible) {
      this.setState({ initialCharSelectOpen: false });
    }
  }
}

class ControllerDisplayViewWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    return (
      <ControllerContext.Consumer>
        {({ characters, servers, selectedServer, selectedCharacter }) => (
          <ControllerDisplayView
            {...this.props}
            characters={characters}
            servers={servers}
            selectedServer={selectedServer}
            selectedCharacter={selectedCharacter}
          />
        )}
      </ControllerContext.Consumer>
    );
  }
}

export default ControllerDisplayViewWithInjectedContext;
