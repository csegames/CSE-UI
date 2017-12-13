/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { events, webAPI } from 'camelot-unchained';

import { patcher, ChannelStatus } from '../../../../../services/patcher';
import { PatcherServer } from '../../../services/session/controller';
import CharacterList from './CharacterList';
import ServerOptionsMenu from './ServerOptionsMenu';

export interface CharacterSelectListProps {
  servers: {[id: string]: PatcherServer};
  characters: {[id: string]: webAPI.SimpleCharacter};
  selectedServer: PatcherServer;
  selectedCharacter: webAPI.SimpleCharacter;
  onCharacterSelect: (character: webAPI.SimpleCharacter) => void;
  onChooseCharacter: (character: webAPI.SimpleCharacter) => void;
  charSelectVisible: boolean;
}

export interface CharacterSelectListState {
  serverForOptions: PatcherServer;
  optionsMenuPosition: { top: number, left: number };
}

class CharacterSelectList extends React.Component<CharacterSelectListProps, CharacterSelectListState> {
  constructor(props: CharacterSelectListProps) {
    super(props);
    this.state = {
      serverForOptions: null,
      optionsMenuPosition: null,
    };
  }

  public render() {
    // Put selected server at top
    const { servers, selectedServer } = this.props;
    const sortedServers = _.sortBy(servers, server => server.shardID === selectedServer.shardID ? -1 : 0);

    return (
      <div>
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
            />
          );
        })}
      </div>
    );
  }

  public componentWillReceiveProps(nextProps: CharacterSelectListProps) {
    if (this.props.charSelectVisible && !nextProps.charSelectVisible && this.state.serverForOptions) {
      this.setState({ serverForOptions: null });
    }
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
