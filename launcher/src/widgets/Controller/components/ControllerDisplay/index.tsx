/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { ControllerDisplayView } from './ControllerDisplayView';
import { Routes } from '../../../../services/session/routes';
import {
  ContextState,
  ControllerContext,
  LastSelectedServerName,
  PatcherServer,
  ServerType
} from '../../ControllerContext';
import { checkAPIServer } from '../../../../lib/checkAPIServer';
import { Sound, playSound } from '../../../../lib/Sound';
import { globalEvents } from '../../../../lib/EventEmitter';
import { SimpleCharacter } from '../../../../api/helpers';
import { ContentPhase } from '../../../../services/ContentPhase';

export interface APIServerStatus {
  [apiHost: string]: 'Online' | 'Offline';
}

export interface ComponentProps {
  phase: ContentPhase;
  activeRoute: Routes;
}

export interface InjectedProps {
  servers: { [id: string]: PatcherServer };
  selectedServer: PatcherServer;
  selectedCharacter: SimpleCharacter;

  onUpdateState: (phase: ContentPhase, state: Partial<ContextState>) => void;
}

export type Props = ComponentProps & InjectedProps;

export interface ControllerDisplayState {
  charSelectVisible: boolean;
  showCreation: boolean;
  serverType: ServerType;
  apiServerStatus: APIServerStatus;
  hasInitializedServer: boolean;
}

export class ControllerDisplay extends React.PureComponent<Props, ControllerDisplayState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      charSelectVisible: false,
      showCreation: false,
      serverType: ServerType.CUGAME,
      apiServerStatus: {},
      hasInitializedServer: false
    };
  }

  public render() {
    return (
      <ControllerContext.Consumer>
        {({ characters, servers, selectedServer, selectedCharacter }) => (
          <ControllerDisplayView
            characters={characters}
            servers={servers}
            selectedServer={selectedServer}
            selectedCharacter={selectedCharacter}
            phase={this.props.phase}
            activeRoute={this.props.activeRoute}
            charSelectVisible={this.state.charSelectVisible}
            serverType={this.state.serverType}
            onToggleCharacterSelect={this.toggleCharacterSelect.bind(this)}
            onDeleteCharacterSuccess={this.onDeleteCharacterSuccess.bind(this)}
            selectServerType={this.selectServerType.bind(this)}
            apiServerStatus={this.state.apiServerStatus}
          />
        )}
      </ControllerContext.Consumer>
    );
  }

  public componentDidMount() {
    this.checkForInitializeServer();
  }

  public componentDidUpdate() {
    this.checkForInitializeServer();
  }

  private toggleCharacterSelect = () => {
    this.updateApiServerStatus();
    if (this.state.charSelectVisible) {
      // We are closing char select
      globalEvents.trigger('resume-videos');
    } else {
      // We are opening char select
      globalEvents.trigger('pause-videos');
    }

    this.setState({ charSelectVisible: !this.state.charSelectVisible });
  };

  private updateApiServerStatus = () => {
    const { servers } = this.props;
    const apiServerStatus: APIServerStatus = {};
    Object.keys(servers).forEach((_key) => {
      const apiHost = servers[_key]?.apiHost;
      checkAPIServer(apiHost).then((ok) => {
        apiServerStatus[apiHost] = ok ? 'Online' : 'Offline';
      });
    });
    this.setState({ apiServerStatus });
  };

  private selectServerType(serverType: ServerType) {
    if (this.state.serverType === serverType) return;
    playSound(Sound.Select);
    this.checkForInitializeServer();
  }

  private checkForInitializeServer() {
    switch (this.props.phase) {
      case ContentPhase.Login:
        break;
      case ContentPhase.Colossus:
        if (this.state.serverType !== ServerType.COLOSSUS || !this.state.hasInitializedServer) {
          this.setState({ serverType: ServerType.COLOSSUS });
          this.initializeColossusServer();
        }
        break;
      case ContentPhase.Camelot:
        if (this.state.serverType !== ServerType.CUGAME || !this.state.hasInitializedServer) {
          this.setState({ serverType: ServerType.CUGAME });
          this.initializeCUServer();
        }
        break;
      case ContentPhase.Cube:
        if (this.state.serverType !== ServerType.CUBE || !this.state.hasInitializedServer) {
          this.setState({ serverType: ServerType.CUBE });
          this.initializeCubeServer();
        }
        break;
      case ContentPhase.Tools:
        if (this.state.serverType !== ServerType.CHANNEL || !this.state.hasInitializedServer) {
          this.setState({ serverType: ServerType.CHANNEL });
          this.initializeTools();
        }
        break;
    }
  }

  private initializeCubeServer() {
    const cubeServerKey = Object.keys(this.props.servers).find((key) => this.props.servers[key].channelID === 27);
    this.props.onUpdateState(ContentPhase.Cube, { selectedServer: this.props.servers[cubeServerKey] });
    this.setState({ hasInitializedServer: true });
  }

  private initializeColossusServer() {
    const servers: PatcherServer[] = this.getServersWithPatchPermissions(ServerType.COLOSSUS);
    if (servers.length === 0) {
      this.props.onUpdateState(ContentPhase.Colossus, { selectedServer: null });
      return;
    }

    // Hardcode find channel 2200 (Vigridr)
    const colossusServer = servers.find((server) => server.channelID === 2200);
    this.props.onUpdateState(ContentPhase.Colossus, { selectedServer: colossusServer });
    this.setState({ hasInitializedServer: true });
  }

  private initializeCUServer() {
    const lastServerName = localStorage.getItem(LastSelectedServerName);
    const selectedServer = this.props.servers[lastServerName];
    if (selectedServer) {
      this.props.onUpdateState(ContentPhase.Camelot, { selectedServer });
      return;
    }

    const matches = this.getServersWithPatchPermissions(ServerType.CUGAME);
    this.props.onUpdateState(ContentPhase.Camelot, { selectedServer: matches.length > 0 ? matches[0] : null });
    this.setState({ hasInitializedServer: true });
  }

  private initializeTools() {
    const servers: PatcherServer[] = this.getServersWithPatchPermissions(ServerType.CUGAME);
    this.props.onUpdateState(ContentPhase.Tools, { selectedServer: servers[0] });
    this.setState({ hasInitializedServer: true });
  }

  private getServersWithPatchPermissions(serverType: ServerType): PatcherServer[] {
    const values: PatcherServer[] = [];
    const servers = this.props.servers;
    Object.keys(servers).forEach((key: string) => {
      if (servers[key].type === serverType) {
        values.push(servers[key]);
      }
    });

    return values;
  }

  private onDeleteCharacterSuccess(id: string) {
    // this.props.dispatch(characterRemoved(id));
  }
}
