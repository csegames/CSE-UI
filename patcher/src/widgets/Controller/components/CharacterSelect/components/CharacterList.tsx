/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';
import { webAPI, events, CollapsingList } from '@csegames/camelot-unchained';

import { PatcherServer } from '../../../services/session/controller';
import CharacterSelectListItem from './CharacterSelectListItem';
import CreateCharacterItem from './CreateCharacterItem';

import PlayerCounts from './PlayerCounts';

const Server = styled('div')`
  display: block;
  height: 55px;
  width: 407px;
  &:hover {
    filter: brightness(140%);
  }
`;

const ServerTitle = styled('div')`
  display: flex;
  justify-content: space-between;
  text-align: right;
  height: 30px;
  width: 390px;
  margin-left: -16px;
  margin-right: 5px;
  font-size: 16px;
  letter-spacing: 1px;
  text-transform: capitalize;
  background: url(images/controller/server-name-bg.png) no-repeat;
  div {
    display: inline;
    text-align: left;
    margin-top: 2px;
    margin-left: 45px;
  }
  font-family: "Caudex";
  color: #dac0a9;`;

const ServerInfo = styled('div')`
  display: flex;
  justify-content: space-between;
  height: 20px;
  width: 407px;
  margin-left: -33px;
  background: url(images/controller/server-name-bg.png) no-repeat;
  font-size: 12px;
  p {
    display: inline;
    margin-top: -5px;
    margin-right: 5px;
    opacity: 0.5;
  }
`;

const Icon = styled('i')`
  position: relative;
  top: -1px;
  display: inline;
  margin-right: 6px;
  color: ${props => props.color};
  font-size: ${props => props.size}px;
`;

const ServerOptionsButton = styled('div')`
  display: inline;
  margin-top: 9px;
  margin-right: 5px;
  cursor: pointer;
  pointer-events: ${props => props.visible ? 'all' : 'none'};
  z-index: 1;
  &:hover {
    color: #fff;
    filter: drop-shadow(1px 1px 5px rgba(255,255,255,0.5));
  }
`;

export interface CharacterListProps {
  index: number;
  collapsed: boolean;
  server: PatcherServer;
  sortedServers: PatcherServer[];
  serverCharacters: webAPI.SimpleCharacter[];
  selectedCharacter: webAPI.SimpleCharacter;
  onCharacterSelect: (character: webAPI.SimpleCharacter) => void;
  onChooseCharacter: (character: webAPI.SimpleCharacter) => void;
  toggleMenu: (e: React.MouseEvent<HTMLDivElement>, server: PatcherServer) => void;
  onToggleCollapse: (shardID: number, collapsed: boolean) => void;
  charSelectVisible: boolean;
  apiServerOnline: 'Online' | 'Offline' | undefined;
}

export interface CharacterListState {
  initialHeight: number;
}

class CharacterList extends React.PureComponent<CharacterListProps, CharacterListState> {
  constructor(props: CharacterListProps) {
    super(props);
    this.state = {
      initialHeight: null,
    };
  }
  public render() {
    const { server, serverCharacters, sortedServers, index } = this.props;
    return (
      <div id={`character-list-${server.shardID}`} style={{ opacity: !this.state.initialHeight ? 0 : 1 }}>
        <CollapsingList
          key={server.shardID}
          items={serverCharacters}
          collapsed={this.props.collapsed}
          onToggleCollapse={this.onToggleCollapse}
          animationClass={this.handleAnimationClass}
          styles={index === sortedServers.length - 1 ? {
            body: {
              transition: '0.5s ease',
            },
            container: {
              marginBottom: 145,
            },
          } : index === 0 ? {
            body: {
              transition: '0.5s ease',
            },
            container: {
              marginTop: 15,
            },
          } : {
            body: {
              transition: '0.5s ease',
            },
          }}
          title={(collapsed: boolean) =>
            <Server>
              <ServerTitle>
                <div>
                  <Icon size={14}>{collapsed ? '+' : '-'}</Icon>
                  <Icon
                    className='fa fa-power-off'
                    aria-hidden='true'
                    color={server.available ? 'green' : 'red'}
                    size={12}>
                  </Icon>
                    {server.name} ({serverCharacters.length})
                </div>
                <ServerOptionsButton visible={this.props.charSelectVisible} onClick={e => this.onToggleMenu(e, server)}>
                  <i className='fa fa-cog' />
                </ServerOptionsButton>
              </ServerTitle>
              <ServerInfo>
                <PlayerCounts server={server.name} />
                <p>Accessible to {webAPI.accessLevelString(server.accessLevel)}</p>
              </ServerInfo>
            </Server>
          }
          renderListItem={(character: webAPI.SimpleCharacter, i: number) => (
            <CharacterSelectListItem
              key={character.id}
              character={character}
              selected={this.props.selectedCharacter.id === character.id}
              onCharacterSelect={this.props.onCharacterSelect}
              onChooseCharacter={this.props.onChooseCharacter}
              charSelectVisible={this.props.charSelectVisible}
            />
          )}
          renderListFooter={() => (
            <CreateCharacterItem server={server} apiServerOnline={this.props.apiServerOnline} />
          )}
        />
      </div>
    );
  }

  public componentDidMount() {
    this.initHeight();
  }

  public componentWillReceiveProps(nextProps: CharacterListProps) {
    if (this.props.server.shardID !== nextProps.server.shardID ||
        !_.isEqual(this.props.serverCharacters, nextProps.serverCharacters)) {
      this.setState({ initialHeight: null });
      setTimeout(() => {
        const characterList = document.getElementById(`character-list-${this.props.server.shardID}`);
        this.setState({ initialHeight: characterList.clientHeight - 40 });
      }, 300);
    }
  }

  private initHeight = () => {
    setTimeout(() => {
      const characterList = document.getElementById(`character-list-${this.props.server.shardID}`);
      if (!this.state.initialHeight) {
        this.setState({ initialHeight: characterList.clientHeight - 40 });
      }
    }, 300);
  }

  private onToggleMenu = (e: React.MouseEvent<HTMLDivElement>, server: PatcherServer) => {
    events.fire('play-sound', 'select');
    this.props.toggleMenu(e, server);
  }

  private onToggleCollapse = (collapsed: boolean) => {
    events.fire('play-sound', 'select-change');

    this.props.onToggleCollapse(this.props.server.shardID, collapsed);
  }

  private handleAnimationClass = (collapsed: boolean) => {
    if (!collapsed) {
      return {
        anim: {
          opacity: 1,
          visibility: 'visible',
          height: this.state.initialHeight ? `${this.state.initialHeight}px` : '100%',
          overflow: 'hidden',
        },
      };
    } else {
      return {
        anim: {
          opacity: 0,
          visibility: 'hidden',
          height: '0px',
          overflow: 'hidden',
        },
      };
    }
  }
}

export default CharacterList;
