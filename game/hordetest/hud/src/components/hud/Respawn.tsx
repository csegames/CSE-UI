/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { InputContext } from 'components/context/InputContext';

const Container = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: radial-gradient(transparent, rgba(0, 0, 0, 0.9) 50%, rgba(0, 0, 0, 1) 80%);
  display: flex;
  justify-content: center;
  pointer-events: none;
  opacity: 0;
  animation: fadeIn 0.5s forwards;

  &:before {
    content: '';
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: -1;
  }

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
`;

const Banner = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 473px;
  height: 1080px;
  background-image: url(../images/hud/respawn/banner.png);
  background-size: contain;
  pointer-events: all;
  animation: bounceIn 0.5s forwards;
  animation-delay: 0.5s;
  margin-top: -1080px;

  @keyframes bounceIn {
    0% {
      maring-top: -1080px;
    }

    80% {
      margin-top: 0px;
    }

    100% {
      margin-top: -20px;
    }
  }
`;

const DeadText = styled.div`
  width: 298px;
  height: 132px;
  background-image: url(../images/hud/respawn/dead-text.png);
  background-repeat: no-repeat;
  background-size: contain;
  margin-bottom: 30px;
`;

const Button = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
  text-transform: uppercase;
  font-family: Colus;
  font-size: 22px;
  background-color: transparent;
  transition: background-color 0.2s;
  border: 3px solid #f9e163;
  color: #f9e163;
  cursor: pointer;
  letter-spacing: 2px;

  &.leave {
    color: white;
    border: 3px solid #f9e163;
    color: #f9e163;
  }

  &.highlight {
    background-color: rgba(255, 255, 255, 0.2);
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const HeartsContainer = styled.div`
  position: relative;
  display: flex;
  margin-bottom: 5px;
`;

const DashLine = styled.div`
  position: absolute;
  width: 246px;
  height: 3px;
  background-image: url(../images/hud/respawn/dash-line.png);
  background-size: contain;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 2;
`;

const Heart = styled.div`
  font-size: 24px;
  color: black;
  -webkit-text-stroke-width: 10px;
  -webkit-text-stroke-color: #666666;
  margin: 0 8px;
  z-index: 1;

  &.life {
    color: #f9042b;
    -webkit-text-stroke-color: #fff1e7;
    z-index: 3;
  }
`;

const LivesText = styled.div`
  color: #969696;
  font-size: 14px;
  font-family: Colus;
  margin-bottom: 30px;
  text-transform: uppercase;
`;

export interface Props {
  isConsole: boolean;
}

export interface State {
  visible: boolean;
}

class RespawnWithInjectedContext extends React.Component<Props, State> {
  private visibilityEVH: EventHandle;
  private controllerSelectEVH: EventHandle;

  constructor(props: Props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  public render() {
    const playerState = hordetest.game.selfPlayerState;
    const hearts = Array.from(Array(playerState.maxDeaths));
    const livesLeft = playerState.maxDeaths - playerState.currentDeaths;
    return this.state.visible ? (
        <Container data-input-group='block'>
          <Banner>
            <DeadText />
            <HeartsContainer>
              {hearts.map((_, i) => {
                const isLife = i + 1 <= livesLeft;
                const lifeClass = isLife ? 'life' : '';
                return (
                  <Heart className={`${lifeClass} fs-icon-misc-heart`} />
                );
              })}

              <DashLine />
            </HeartsContainer>
            <LivesText>{livesLeft} {livesLeft !== 1 ? 'Lives' : 'Life'} Left</LivesText>
            {playerState.currentDeaths < playerState.maxDeaths ?
              <Button className={this.props.isConsole ? 'highlight' : ''} onClick={this.onRespawn}>
                {this.props.isConsole && <span className={game.gamepadSelectBinding.iconClass}></span>}
                Respawn
              </Button> :
              <Button className='leave' onClick={this.onRespawn}>Leave Match</Button>
            }
          </Banner>
        </Container>
    ) : null;
  }

  public componentDidMount() {
    this.handleVisibility();
    this.visibilityEVH = hordetest.game.selfPlayerState.onUpdated(this.handleVisibility);
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.state.visible) {
      if (!prevProps.isConsole && this.props.isConsole) {
        this.setWaitingForSelect(true);
        this.controllerSelectEVH = game.onControllerSelect(this.onRespawn);
      }

      if (prevProps.isConsole && !this.props.isConsole) {
        this.setWaitingForSelect(false);
        this.controllerSelectEVH.clear();
      }
    }
  }

  public componentWillUnmount() {
    this.visibilityEVH.clear();

    if (this.controllerSelectEVH) {
      this.controllerSelectEVH.clear();
    }
  }

  private handleVisibility = () => {
    if (!hordetest.game.selfPlayerState.isAlive && !this.state.visible) {
      this.show();
      return;
    }

    if (hordetest.game.selfPlayerState.isAlive && this.state.visible) {
      this.hide();
    }
  }

  private show = () => {
    if (this.props.isConsole) {
      this.setWaitingForSelect(true);
      this.controllerSelectEVH = game.onControllerSelect(this.onRespawn);
    } else {
      game.releaseMouseCapture();
    }

    this.setState({ visible: true });
  }

  private hide = () => {
    if (this.props.isConsole) {
      this.setWaitingForSelect(false);
    }

    this.setState({ visible: false });
  }

  private onRespawn = () => {
    hordetest.game.selfPlayerState.respawn('-1');
  }

  private setWaitingForSelect = (isWaitingForSelect: boolean) => {
    game.setWaitingForSelect(isWaitingForSelect);
  }
}

export function Respawn() {
  return (
    <InputContext.Consumer>
      {({ isConsole }) => (
        <RespawnWithInjectedContext isConsole={isConsole} />
      )}
    </InputContext.Consumer>
  );
}
