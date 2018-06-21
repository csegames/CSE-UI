/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as events  from '@csegames/camelot-unchained/lib/events';

import styled, { keyframes } from 'react-emotion';
import GameSelectItem from './GameSelectItem';
import { PatcherServer, ServerType, serverTypeToIcon } from '../../../services/session/controller';
import { patcher, permissionsString } from '../../../../../services/patcher';

const imageShine = keyframes`
  0% {
    left: -115px;
    opacity: 0;
  }
  90% {
    left: -115px;
    opacity: 0;
  }
  100% {
    left: 100%;
    opacity: 1;
  }
`;

const GameMask = styled('div')`
  position: relative;
  height: 97px;
  width: 175px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent),
    url(images/controller/games-bot-left-bg.png) no-repeat;
  background-size: cover;
  -webkit-mask-image: url(images/controller/bottom-left-mask.png);
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: 100% 100%;
  box-shadow: inset 0px 0px 20px 20px rgba(0, 0, 0, 0.5);
  z-index: 1;
  transition: left ease .4s, width ease .4s, filter ease .4s, -webkit-mask-size ease 0.1s;
  transition-delay: -webkit-mask-size 0.4s;
  cursor: pointer;
  border: 1px solid #535353;
  border-left: 0px;

  &:hover ~ .hover-area {
    z-index: 1;
  }

  &:before {
    content: '';
    position: absolute;
    top: 0px;
    left: -100px;
    width: 100px;
    height: 100%;
    background: linear-gradient(to right, transparent, rgba(255,255,255,0.3) 60%, transparent);
    -webkit-animation: ${imageShine} 10s ease infinite;
    animation: ${imageShine} 10s ease infinite;
  }
`;

const PopupContainer = styled('div')`
  position: absolute;
  display: flex;
  flex-direction: column;
  top: ${props => props.top}px;
  opacity: ${props => props.opacity};
  visibility: ${props => props.opacity === 0 ? 'hidden' : 'visible'};
  transition: ${props => props.instant ? '' : 'all 0.5s ease'};
`;

const SelectedGame = styled('div')`
  display: inline-block;
  position: relative;
  pointer-events: all;
  margin-left: 35px;
  width: 60px;
  height: 95px;
  zoom: 100%;
  cursor: pointer;
  background: url(${props => props.img}) no-repeat center;
  z-index: 10;
  transition: ${props => props.instant ? '' : 'opacity .3s ease'};
  bottom: 0;
`;

const AccessLevelText = styled('div')`
  position: absolute;
  top: -25px;
  left: 15px;
  color: white;
  font-size: 14px;
  margin-right: 30px;
  opacity: ${props => props.opacity};
  -webkit-transition: 0.4s ease;
  transition: 0.4s ease;
`;

export interface GameSelectProps {
  servers: {[id: string]: PatcherServer};
  serverType: ServerType;
  onSelectServerType: (serverType: ServerType) => void;
}

export interface GameSelectState {
  instant: boolean;
  isOpen: boolean;
  popupHeight: number;
}

class GameSelect extends React.Component<GameSelectProps, GameSelectState> {
  private closeTimeout: any;
  private popupRef: HTMLDivElement;

  constructor(props: GameSelectProps) {
    super(props);
    this.state = {
      instant: false,
      isOpen: false,
      popupHeight: 0,
    };
  }
  public render() {
    const { serverType } = this.props;
    const serverTypes: ServerType[] = this.getServerTypes();
    return (
      <div>
        {patcher.getPermissions() &&
          <AccessLevelText opacity={this.state.isOpen ? 0 : 0.5}>
            Your Access Level: {permissionsString(patcher.getPermissions())}
          </AccessLevelText>
        }
        <GameMask
          className='character-button-game-mask'
          width={175}
          isCUGame={serverType === ServerType.CUGAME}
        >
          <SelectedGame
            key={serverType}
            img={serverTypeToIcon(serverType)}
            onMouseEnter={this.open}
            onMouseLeave={this.close}
          />
        </GameMask>
        <PopupContainer
          className='game-popup-container'
          innerRef={r => this.popupRef = r}
          top={this.popupRef ? -(this.popupRef.getBoundingClientRect().height + 5) : 0}
          opacity={this.state.isOpen ? 1 : 0}
          instant={this.state.instant}
          onMouseEnter={this.open}
          onMouseLeave={this.close}
        >
          {serverTypes.map(type => type === this.props.serverType ? null : (
            <GameSelectItem
              key={type}
              type={type}
              onSelectServerType={this.onSelectServerType}
            />
          ))}
        </PopupContainer>
      </div>
    );
  }

  private open = () => {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    } else {
      events.fire('play-sound', 'select-change');
    }
    this.setState({ isOpen: true });
  }

  private close = (instant?: boolean) => {
    if (this.state.isOpen) {
      if (instant === true) {
        this.setState({ isOpen: false, instant: true });
        setTimeout(() => this.setState({ instant: false }), 50);
      } else {
        this.closeTimeout = setTimeout(() => this.setState({ isOpen: false }), 50);
      }
    }
  }

  private onSelectServerType = (serverType: ServerType) => {
    this.props.onSelectServerType(serverType);
    this.close(true);
  }

  private getServerTypes = () => {
    const serverTypes: ServerType[] = [];
    for (let i = ServerType.CUGAME; i < ServerType.UNKNOWN; ++i) {
      let anyOfType = false;
      for (const key in this.props.servers) {
        if (this.props.servers[key].type === i) {
          anyOfType = true;
          break;
        }
      }
      if (anyOfType) serverTypes.push(i);
    }

    return serverTypes;
  }
}

export default GameSelect;
