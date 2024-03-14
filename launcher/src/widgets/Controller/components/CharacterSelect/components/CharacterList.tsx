/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { css } from 'react-emotion';
import { styled } from '@csegames/linaria/react';

import CharacterSelectListItem from './CharacterSelectListItem';
import CreateCharacterItem from './CreateCharacterItem';
import { CollapsingList } from '../../../../../components/CollapsingList';
import { ControllerContext, ContextState, PatcherServer } from '../../../ControllerContext';
import { Sound, playSound } from '../../../../../lib/Sound';
import { primary } from '../../../../../api/graphql';
import { SimpleCharacter, accessLevelString } from '../../../../../api/helpers';
import { ContentPhase } from '../../../../../services/ContentPhase';

type PatcherAlert = primary.PatcherAlert;

const Server = styled.div`
  display: block;
  height: 55px;
  width: 407px;
  background: url(/ui/images/controller/server-name-bg.png) no-repeat;
  &:hover {
    filter: brightness(140%);
  }
`;

const ServerTitle = styled.div`
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
  div {
    display: inline;
    text-align: left;
    margin-top: 6px;
    margin-left: 45px;
  }
  font-family: 'Caudex';
  color: #dac0a9;
`;

const ServerInfo = styled.div`
  display: flex;
  justify-content: space-between;
  height: 20px;
  width: 407px;
  margin-left: 40px;
  margin-top: 3px;
  font-size: 12px;
  p {
    display: inline;
    margin-top: -5px;
    margin-right: 5px;
    opacity: 0.5;
  }
`;

const Icon = styled.i`
  position: relative;
  top: -1px;
  display: inline;
  margin-right: 6px;
`;

const ServerOptionsButton = styled.div`
  display: inline;
  margin-top: 9px;
  margin-right: 5px;
  cursor: pointer;
  z-index: 1;
  &:hover {
    color: #fff;
    filter: drop-shadow(1px 1px 5px rgba(255, 255, 255, 0.5));
  }
`;

const Body = css`
  transition: 0.5s ease;
  padding: 0 0 0 15px;
`;

export interface ComponentProps {
  index: number;
  collapsed: boolean;
  server: PatcherServer;
  sortedServers: PatcherServer[];
  serverCharacters: SimpleCharacter[];
  selectedCharacter: SimpleCharacter;
  onCharacterSelect: (character: SimpleCharacter) => void;
  onChooseCharacter: (character: SimpleCharacter, server: PatcherServer) => void;
  toggleMenu: (e: React.MouseEvent<HTMLDivElement>, server: PatcherServer) => void;
  onToggleCollapse: (name: string, collapsed: boolean) => void;
  charSelectVisible: boolean;
  apiServerOnline: 'Online' | 'Offline' | undefined;
}

export interface InjectedProps {
  servers: { [id: string]: PatcherServer };
  characters: { [id: string]: SimpleCharacter };
  patcherAlerts: PatcherAlert[];
  onUpdateState: (phase: ContentPhase, stats: Partial<ContextState>) => void;
}

export type Props = ComponentProps & InjectedProps;

export interface CharacterListState {
  initialHeight: number;
}

class CharacterList extends React.PureComponent<Props, CharacterListState> {
  constructor(props: Props) {
    super(props);
    this.state = {
      initialHeight: null
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
          onToggleCollapse={this.onToggleCollapse.bind(this)}
          animationClass={this.handleAnimationClass.bind(this)}
          styles={
            index === sortedServers.length - 1
              ? {
                  body: Body,
                  container: css`
                    margin-bottom: 145px;
                  `
                }
              : index === 0
              ? {
                  body: Body,
                  container: css`
                    margin-top: 15px;
                  `
                }
              : {
                  body: Body
                }
          }
          title={(collapsed: boolean) => (
            <Server>
              <ServerTitle>
                <div>
                  <Icon style={{ fontSize: 14 }}>{collapsed ? '+' : '-'}</Icon>
                  <Icon
                    className='fa fa-power-off'
                    aria-hidden='true'
                    style={{ fontSize: 12, color: server.available ? 'green' : 'red' }}
                  ></Icon>
                  {server.name} ({serverCharacters.length})
                </div>
                <ServerOptionsButton
                  style={{ pointerEvents: this.props.charSelectVisible ? 'all' : 'none' }}
                  onClick={(e: React.MouseEvent<HTMLDivElement>) => this.onToggleMenu(e, server)}
                >
                  <i className='fa fa-cog' />
                </ServerOptionsButton>
              </ServerTitle>
              <ServerInfo>
                <p>Accessible to {accessLevelString(server.accessLevel)}</p>
              </ServerInfo>
            </Server>
          )}
          renderListItem={(character: SimpleCharacter, i: number) => (
            <CharacterSelectListItem
              key={character.id}
              character={character}
              server={server}
              selected={this.props.selectedCharacter.id === character.id}
              onCharacterSelect={this.props.onCharacterSelect}
              onChooseCharacter={this.props.onChooseCharacter}
              charSelectVisible={this.props.charSelectVisible}
            />
          )}
          renderListFooter={() => <CreateCharacterItem server={server} apiServerOnline={this.props.apiServerOnline} />}
        />
      </div>
    );
  }

  public componentDidMount() {
    this.initHeight(this.props.serverCharacters);
  }

  public componentWillReceiveProps(nextProps: Props) {
    if (
      this.props.server.shardID !== nextProps.server.shardID ||
      !_.isEqual(this.props.serverCharacters, nextProps.serverCharacters)
    ) {
      this.setState({ initialHeight: null });
      setTimeout(() => {
        this.initHeight(nextProps.serverCharacters);
      }, 300);
    }
  }

  private initHeight = (serverCharacters: SimpleCharacter[]) => {
    setTimeout(() => {
      const listHeight = serverCharacters.length * 70 + 95;
      this.setState({ initialHeight: listHeight });
    }, 300);
  };

  private onToggleMenu = (e: React.MouseEvent<HTMLDivElement>, server: PatcherServer) => {
    playSound(Sound.Select);
    this.props.toggleMenu(e, server);
  };

  private onToggleCollapse(collapsed: boolean) {
    playSound(Sound.SelectChange);
    this.props.onToggleCollapse(this.props.server.name, collapsed);
  }

  private handleAnimationClass(collapsed: boolean) {
    if (!collapsed) {
      return {
        anim: css`
          opacity: 1;
          visibility: visible;
          height: ${this.state.initialHeight ? `${this.state.initialHeight}px` : '100%'};
          overflow: hidden;
        `
      };
    } else {
      return {
        anim: css`
          opacity: 0;
          visibility: hidden;
          height: 0px;
          overflow: hidden;
        `
      };
    }
  }
}

class CharacterListWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    return (
      <ControllerContext.Consumer>
        {({ servers, characters, patcherAlerts, onUpdateState }) => (
          <CharacterList
            {...this.props}
            servers={servers}
            characters={characters}
            patcherAlerts={patcherAlerts}
            onUpdateState={onUpdateState}
          />
        )}
      </ControllerContext.Consumer>
    );
  }
}

export default CharacterListWithInjectedContext;
