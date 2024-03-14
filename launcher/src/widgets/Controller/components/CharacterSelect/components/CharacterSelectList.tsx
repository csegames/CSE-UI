/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { styled } from '@csegames/linaria/react';

import { ControllerContext, PatcherServer, VIGRIDR_CHANNEL } from '../../../ControllerContext';
import { patcher, ChannelStatus, PatchChannelMode } from '../../../../../services/patcher';
import CharacterList from './CharacterList';
import ServerOptionsMenu from './ServerOptionsMenu';
import { APIServerStatus } from '../../ControllerDisplay/index';
import { Sound, playSound } from '../../../../../lib/Sound';
import { SimpleCharacter } from '../../../../../api/helpers';
import { Dictionary } from '../../../../../lib/Dictionary';

const MinimizeAll = styled.div`
  cursor: pointer;
  z-index: 10;
  opacity: 0.5;
  padding: 15px 25px 0 25px;
  margin-bottom: -10px;
  display: flex;
  align-items: center;
  &:hover {
    opacity: 1;
  }
`;

const ArrowIcon = styled.i`
  font-size: 12px;
  margin-right: 5px;
`;

export interface ComponentProps {
  servers: { [id: string]: PatcherServer };
  selectedServer: PatcherServer;
  selectedCharacter: SimpleCharacter;
  onCharacterSelect: (character: SimpleCharacter) => void;
  onChooseCharacter: (character: SimpleCharacter, server: PatcherServer) => void;
  charSelectVisible: boolean;
  apiServerStatus: APIServerStatus;
}

export interface InjectedProps {
  characters: { [id: string]: SimpleCharacter };
  updateChannels: () => void;
}

export type Props = ComponentProps & InjectedProps;

export interface CharacterSelectListState {
  minimized: boolean;
  serverForOptions: PatcherServer;
  optionsMenuPosition: { top: number; left: number };
  serversCollapsed: Dictionary<boolean>;
}

class CharacterSelectList extends React.Component<Props, CharacterSelectListState> {
  private channelUpdateTimeout: number;
  constructor(props: Props) {
    super(props);
    this.state = {
      minimized: false,
      serverForOptions: null,
      optionsMenuPosition: null,
      serversCollapsed: {}
    };
  }

  public render() {
    // Put selected server at top
    const sortedServers = this.getServers().filter((s) => s.channelID !== VIGRIDR_CHANNEL);
    return (
      <div style={{ position: 'relative' }}>
        <MinimizeAll
          onClick={this.state.minimized ? this.onMaximizeAllClick.bind(this) : this.onMinimizeAllClick.bind(this)}
          style={{ pointerEvents: this.props.charSelectVisible ? 'all' : 'none' }}
        >
          <ArrowIcon className={this.state.minimized ? 'fal fa-arrow-to-bottom' : 'fal fa-arrow-to-top'}></ArrowIcon>
          {this.state.minimized ? 'Maximize All' : 'Minimize All'}
        </MinimizeAll>
        {this.state.serverForOptions && (
          <ServerOptionsMenu
            top={this.state.optionsMenuPosition.top}
            left={this.state.optionsMenuPosition.left}
            charSelectVisible={this.props.charSelectVisible}
            serverForOptions={this.state.serverForOptions}
            handleInstallUninstall={this.handleInstallUninstall.bind(this)}
            onToggleChannelMode={this.onToggleChannelMode.bind(this)}
            toggleMenu={this.toggleMenu.bind(this)}
          />
        )}
        {_.values(sortedServers).map((server, index) => {
          const apiServerOnline = this.props.apiServerStatus[server.apiHost];
          const serverCharacters: SimpleCharacter[] = [];
          Object.keys(this.props.characters).forEach((key) => {
            if (this.props.characters[key].shardID === server.shardID) {
              serverCharacters.push(this.props.characters[key]);
            }
          });
          return (
            <CharacterList
              key={index}
              index={index}
              server={server}
              sortedServers={sortedServers}
              serverCharacters={serverCharacters}
              selectedCharacter={this.props.selectedCharacter}
              onCharacterSelect={this.props.onCharacterSelect}
              onChooseCharacter={this.props.onChooseCharacter}
              toggleMenu={this.toggleMenu.bind(this)}
              charSelectVisible={this.props.charSelectVisible}
              collapsed={this.state.serversCollapsed[server.name]}
              onToggleCollapse={this.onToggleCollapse.bind(this)}
              apiServerOnline={apiServerOnline}
            />
          );
        })}
      </div>
    );
  }

  public componentDidMount() {
    this.onMaximizeAllClick();
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (this.props.charSelectVisible && !nextProps.charSelectVisible && this.state.serverForOptions) {
      this.setState({ serverForOptions: null });
    }
  }

  public componentWillUnmount() {
    window.clearTimeout(this.channelUpdateTimeout);
  }

  private getServers = () => {
    const { servers, selectedServer } = this.props;
    const localLastPlay = JSON.parse(localStorage.getItem('cse-patcher-lastplay'));
    const sortedServers = _.sortBy(servers, [
      localLastPlay ? (server: any) => (server.name === localLastPlay.serverName ? -1 : 0) : null,
      (server: any) => (server.available ? -1 : 0),
      selectedServer ? (server: any) => (server.shardID === selectedServer.shardID ? -1 : 0) : null
    ]);
    return sortedServers;
  };

  private toggleMenu(e: React.MouseEvent<HTMLDivElement>, server: PatcherServer) {
    e.stopPropagation();
    e.persist();
    this.setState((state, props) => {
      if (state.serverForOptions) {
        return {
          serverForOptions: null,
          optionsMenuPosition: null
        };
      }
      return {
        serverForOptions: server,
        optionsMenuPosition: {
          top: e.clientY,
          left: e.clientX - 180
        }
      };
    });
  }

  private onToggleCollapse(name: string, collapsed: boolean) {
    const serversCollapsed = this.state.serversCollapsed;
    serversCollapsed[name] = collapsed;
    this.setState({ serversCollapsed });
  }

  private onMinimizeAllClick() {
    const serversCollapsed = this.state.serversCollapsed;
    Object.keys(serversCollapsed).forEach((name) => {
      serversCollapsed[name] = true;
    });
    this.setState({ serversCollapsed, minimized: true });
  }

  private onMaximizeAllClick = () => {
    const serversCollapsed = this.state.serversCollapsed;
    _.values(this.props.servers).forEach((server) => {
      serversCollapsed[server.name] = false;
    });
    this.setState({ serversCollapsed, minimized: false });
  };

  private handleInstallUninstall = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (this.state.serverForOptions.channelStatus === ChannelStatus.NotInstalled) {
      this.install();
    } else {
      this.uninstall();
    }
  };

  private onToggleChannelMode = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    playSound(Sound.Select);
    if (this.state.serverForOptions.mode === PatchChannelMode.Automatic) {
      patcher.setChannelMode(this.state.serverForOptions.channelID, PatchChannelMode.ThiryTwoBit);
      this.channelUpdateTimeout = window.setTimeout(() => this.props.updateChannels(), 200);
    } else {
      patcher.setChannelMode(this.state.serverForOptions.channelID, PatchChannelMode.Automatic);
      this.channelUpdateTimeout = window.setTimeout(() => this.props.updateChannels(), 200);
    }
  };

  private install = () => {
    const { serverForOptions } = this.state;
    patcher.installChannel(serverForOptions.channelID | 0);
    this.channelUpdateTimeout = window.setTimeout(() => this.props.updateChannels(), 200);
    playSound(Sound.Select);
  };

  private uninstall = () => {
    const { serverForOptions } = this.state;
    patcher.uninstallChannel(serverForOptions.channelID | 0);
    this.channelUpdateTimeout = window.setTimeout(() => this.props.updateChannels(), 200);
    playSound(Sound.Select);
  };
}

class CharacterSelectListWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    return (
      <ControllerContext.Consumer>
        {({ characters, updateChannels }) => (
          <CharacterSelectList {...this.props} characters={characters} updateChannels={updateChannels} />
        )}
      </ControllerContext.Consumer>
    );
  }
}

export default CharacterSelectListWithInjectedContext;
