/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled, { keyframes } from 'react-emotion';
import { PatcherServer, ServerType, serverTypeToIcon } from '../../../services/session/controller';

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
  height: 92px;
  width: ${props => props.width ? props.width : 375}px;
  left: ${props => props.left}px;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), transparent),
    url(images/controller/games-bot-left-bg.png) no-repeat;
  background-size: cover;
  -webkit-mask-image: url(images/controller/bottom-left-mask.png);
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: ${props => props.isCUGame ? '495px' : '100% 100%'};
  box-shadow: inset 0px 0px 20px 20px rgba(0, 0, 0, 0.5);
  z-index: 1;
  transition: left ease .4s, width ease .4s, filter ease .4s, -webkit-mask-size ease 0.1s;
  transition-delay: -webkit-mask-size 0.4s;
  cursor: pointer;
  border: 1px solid #535353;
  border-left: 0px;

  &:hover {
    filter: brightness(150%)
  }

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

const GameImage = styled('div')`
  display: inline-block;
  position: relative;
  pointer-events: all;
  margin-top: 15px;
  margin-left: 35px;
  width: 60px;
  height: 60px;
  zoom: 100%;
  cursor: pointer;
  background-image: url(${props => props.img});
  transition: all .2s cubic-bezier(0.93, 0.02, 1, 1.01);
  z-index: 10;
  bottom: 0;

  &:before {
    content: '';
    z-index: 0;
    position: absolute;
    bottom: 0;
    left: 32px;
    opacity: 0;
    transition: opacity .3s ease;
    box-shadow: 0 0 75px 16px rgba(255,255,255,0.89);
  }
  &:hover:before {
    opacity: 1;
  }
`;

export interface GameSelectProps {
  servers: {[id: string]: PatcherServer};
  serverType: ServerType;
  onSelectServerType: (serverType: ServerType) => void;
}

export interface GameSelectState {
  isOpen: boolean;
}

class GameSelect extends React.Component<GameSelectProps, GameSelectState> {
  private closeTimeout: any;

  constructor(props: GameSelectProps) {
    super(props);
    this.state = {
      isOpen: false,
    };
  }
  public render() {
    const { serverType } = this.props;
    const serverTypes: ServerType[] = this.getServerTypes();

    return (
      <GameMask
        className='character-button-game-mask'
        onMouseOver={this.open}
        onMouseOut={this.close}
        left={this.state.isOpen ? 0 : serverType === ServerType.CUBE ? -115 : serverType === ServerType.CHANNEL ? -215 : 0}
        width={!this.state.isOpen ? (serverType === ServerType.CUBE ? 250 : serverType === ServerType.CUGAME ? 175 :
          serverType === ServerType.CHANNEL && 330) : 375}
        isCUGame={serverType === ServerType.CUGAME}
      >
        {serverTypes.map(serverType => (
          <GameImage
            key={serverType}
            img={serverTypeToIcon(serverType)}
            onClick={() => this.onSelectServerType(serverType)}
          />
        ))}
      </GameMask>
    );
  }

  private open = () => {
    if (this.closeTimeout) {
      clearTimeout(this.closeTimeout);
      this.closeTimeout = null;
    }
    if (!this.state.isOpen) {
      this.setState({ isOpen: true });
    }
  }

  private close = () => {
    if (this.state.isOpen) {
      this.closeTimeout = setTimeout(() => this.setState({ isOpen: false }), 100);
    }
  }

  private onSelectServerType = (serverType: ServerType) => {
    this.props.onSelectServerType(serverType);
    this.close();
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
