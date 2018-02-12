/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { webAPI, events, CollapsingList } from 'camelot-unchained';

import { PatcherServer } from '../../../services/session/controller';
import CharacterSelectListItem from './CharacterSelectListItem';
import CreateCharacterItem from './CreateCharacterItem';

const ServerTitle = styled('div')`
  display: flex;
  justify-content: space-between;
  color: #dac0a9;
  font-family: "Caudex";
  font-size: 16px;
  height: 30px;
  width: 330px;
  padding: 5px 15px 5px 35px;
  text-transform: Uppercase;
  letter-spacing: 1px;
  background: url(images/controller/server-name-bg.png) no-repeat;
  &:hover {
    filter: brightness(140%);
  }
`;

const Icon = styled('i')`
  color: ${props => props.color};
  font-size: ${props => props.size}px;
  margin-right: ${props => props.marginRight}px;
`;

const ServerOptionsButton = styled('div')`
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
            CollapsingList: {
              paddingBottom: 145,
            },
          } : index === 0 ? {
            body: {
              transition: '0.5s ease',
            },
            CollapsingList: {
              paddingTop: 15,
            },
          } : {
            body: {
              transition: '0.5s ease',
            },
          }}
          title={(collapsed: boolean) =>
            <ServerTitle>
              <div>
                <Icon marginRight={5}>{collapsed ? '+' : '-'}</Icon>
                <Icon
                  className='fa fa-power-off'
                  aria-hidden='true'
                  color={server.available ? 'green' : 'red'}
                  size={12}>
                </Icon>
                &nbsp;{server.name} ({serverCharacters.length})&nbsp;
              </div>
              <ServerOptionsButton visible={this.props.charSelectVisible} onClick={e => this.onToggleMenu(e, server)}>
                <i className='fa fa-cog' />
              </ServerOptionsButton>
            </ServerTitle>
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
            <CreateCharacterItem server={server} />
          )}
        />
      </div>
    );
  }

  public componentDidMount() {
    setTimeout(() => {
      const characterList = document.getElementById(`character-list-${this.props.server.shardID}`);
      if (!this.state.initialHeight) {
        this.setState({ initialHeight: characterList.clientHeight - 40 });
      }
    }, 300);
  }

  public componentWillReceiveProps(nextProps: CharacterListProps) {
    if (this.props.collapsed !== nextProps.collapsed) {
      console.log(nextProps.collapsed);
    }
    if (this.props.server.shardID !== nextProps.server.shardID) {
      this.setState({ initialHeight: null });
      setTimeout(() => {
        const characterList = document.getElementById(`character-list-${this.props.server.shardID}`);
        this.setState({ initialHeight: characterList.clientHeight - 40 });
      }, 300);
    }
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
