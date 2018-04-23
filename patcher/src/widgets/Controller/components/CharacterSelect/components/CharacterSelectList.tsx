/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';
import { events, webAPI } from '@csegames/camelot-unchained';

import { patcher, canAccessChannel, ChannelStatus } from '../../../../../services/patcher';
import { PatcherServer } from '../../../services/session/controller';
import CharacterList from './CharacterList';
import ServerOptionsMenu from './ServerOptionsMenu';
import { APIServerStatus } from '../../ControllerDisplay/index';

const MinimizeAll = styled('div')`
  cursor: pointer;
  pointer-events: ${props => props.visible ? 'all' : 'none'}
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

const ArrowIcon = styled('i')`
  font-size: 12px;
  margin-right: 5px;
`;

export interface CharacterSelectListProps {
  servers: {[id: string]: PatcherServer};
  characters: {[id: string]: webAPI.SimpleCharacter};
  selectedServer: PatcherServer;
  selectedCharacter: webAPI.SimpleCharacter;
  onCharacterSelect: (character: webAPI.SimpleCharacter) => void;
  onChooseCharacter: (character: webAPI.SimpleCharacter) => void;
  charSelectVisible: boolean;
  apiServerStatus: APIServerStatus;
}

export interface CharacterSelectListState {
  minimized: boolean;
  serverForOptions: PatcherServer;
  optionsMenuPosition: { top: number, left: number };
  serversCollapsed: {[shardID: number]: boolean};
}

class CharacterSelectList extends React.Component<CharacterSelectListProps, CharacterSelectListState> {
  constructor(props: CharacterSelectListProps) {
    super(props);
    this.state = {
      minimized: false,
      serverForOptions: null,
      optionsMenuPosition: null,
      serversCollapsed: {},
    };
  }

  public render() {
    // Put selected server at top
    const sortedServers = this.getServers();
    return (
      <div>
        <MinimizeAll
          onClick={this.state.minimized ? this.onMaximizeAllClick : this.onMinimizeAllClick}
          visible={this.props.charSelectVisible}>
            <ArrowIcon className={this.state.minimized ? 'fal fa-arrow-to-bottom' : 'fal fa-arrow-to-top'}></ArrowIcon>
            {this.state.minimized ? 'Maximize All' : 'Minimize All'}
        </MinimizeAll>
        {this.state.serverForOptions &&
          <ServerOptionsMenu
            top={this.state.optionsMenuPosition.top}
            left={this.state.optionsMenuPosition.left}
            charSelectVisible={this.props.charSelectVisible}
            serverForOptions={this.state.serverForOptions}
            handleInstallUninstall={this.handleInstallUninstall}
            toggleMenu={this.toggleMenu}
          />
        }
        {_.values(sortedServers).map((server, index) => {
          const apiServerOnline = this.props.apiServerStatus[server.apiHost];
          const serverCharacters: webAPI.SimpleCharacter[] = [];
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
              toggleMenu={this.toggleMenu}
              charSelectVisible={this.props.charSelectVisible}
              collapsed={this.state.serversCollapsed[server.shardID]}
              onToggleCollapse={this.onToggleCollapse}
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

  public componentWillReceiveProps(nextProps: CharacterSelectListProps) {
    if (this.props.charSelectVisible && !nextProps.charSelectVisible && this.state.serverForOptions) {
      this.setState({ serverForOptions: null });
    }
  }

  private getServers = () => {
    const { servers, selectedServer } = this.props;
    const serversForPermission = _.values(servers).filter((server) => {
      return canAccessChannel(patcher.getPermissions(), server.channelPatchPermissions);
    });
    const sortedServers = selectedServer ?
      _.sortBy(serversForPermission, server => server.shardID === selectedServer.shardID ? -1 : 0) :
      _.values(serversForPermission);
    return sortedServers;
  }

  private toggleMenu = (e: React.MouseEvent<HTMLDivElement>, server: PatcherServer) => {
    e.stopPropagation();
    e.persist();
    this.setState((state, props) => {
      if (state.serverForOptions) {
        return {
          serverForOptions: null,
          optionsMenuPosition: null,
        };
      }
      return {
        serverForOptions: server,
        optionsMenuPosition: {
          top: e.clientY,
          left: e.clientX - 180,
        },
      };
    });
  }

  private onToggleCollapse = (shardID: number, collapsed: boolean) => {
    const serversCollapsed = this.state.serversCollapsed;
    serversCollapsed[shardID] = collapsed;
    this.setState({ serversCollapsed });
  }

  private onMinimizeAllClick = () => {
    const serversCollapsed = this.state.serversCollapsed;
    Object.keys(serversCollapsed).forEach((shardID) => {
      serversCollapsed[shardID] = true;
    });
    this.setState({ serversCollapsed, minimized: true });
  }

  private onMaximizeAllClick = () => {
    const serversCollapsed = this.state.serversCollapsed;
    _.values(this.props.servers).forEach((server) => {
      serversCollapsed[server.shardID] = false;
    });
    this.setState({ serversCollapsed, minimized: false });
  }

  private handleInstallUninstall = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();
    if (this.state.serverForOptions.channelStatus === ChannelStatus.NotInstalled) {
      this.install();
    } else {
      this.uninstall();
    }
  }

  private install = () => {
    const { serverForOptions } = this.state;
    patcher.installChannel(serverForOptions.channelID | 0);
    this.playSound('select');
  }

  private uninstall = () => {
    const { serverForOptions } = this.state;
    patcher.uninstallChannel(serverForOptions.channelID | 0);
    this.playSound('select');
  }

  private playSound = (sound: string) => {
    events.fire('play-sound', sound);
  }
}

export default CharacterSelectList;
