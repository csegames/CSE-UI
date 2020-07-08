/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';
import { InputContext } from 'components/context/InputContext';
import { MatchmakingContext } from 'context/MatchmakingContext';

const Container = styled.div`
  display: flex;
  position: fixed;
  right: 0;
  bottom: 0;
  left: 0;
  height: 10%;
  max-height: 120px;
  background: rgba(20, 20, 20, 0.9);
  justify-content: center;
  opacity: 0;
  animation: fadeIn 0.5s forwards;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
`;

const DeadTextWrapper = styled.div`
  width: 200px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const DeadText = styled.div`
  color: #969696;
  text-transform: uppercase;
  font-family: Colus;
  font-size: 22px;
  letter-spacing: 2px;
`;

const HeartsParent = styled.div`
  display: flex;
  width: 180px;
  height: 100%;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const HeartsContainer = styled.div`
  display: flex;
  position: relative;
`;

const DashLine = styled.div`
  position: absolute;
  width: 165px;
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
  text-transform: uppercase;
  margin-top: 4px;
`;

const Button = styled.div`
  display: flex;
  padding: 5px;
  min-width: 200px;
  margin-top: 20px;
  margin-bottom: 20px;
  margin-left: 40px;
  margin-right: 40px;
  border: 4px solid #f9e163;
  background-color: rgba(238, 168, 43, 0.2);
  transition: background-color 0.2s;
  color: #f9e163;
  align-items: center;
  justify-content: center;
  text-transform: uppercase;
  font-family: Colus;
  font-size: 22px;
  cursor: pointer;
  letter-spacing: 2px;

  &.leave {
  }

  &.highlight {
    background-color: rgba(255, 255, 255, 0.2);
  }

  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;

const FlexSpacer = styled.div`
  flex: auto;
`;

const SpectateNextPlayerWrap = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 220px;
  margin: 5px 0;
  border-left: 1px solid #969696;
`;

const SpectateNextPlayerIcon = styled.div`
  width: 30px;
  height: 30px;
  margin: 10px;
  text-align: center;
  font-size: 28px;
  color: #969696;
  margin: 0 8px;
`;

const SpectateHintText = styled.div`
  color: #969696;
  font-size: 16px;
  text-transform: uppercase;
  font-weight: bold;
  width: 130px;
`;

export interface Props {
  isConsole: boolean;
  clearMatchmakingContext: () => void;
  onLeaveMatch: () => void;
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

  private getSpectateKeybindIconClass() {
    const keybind = Object.values(game.keybinds).find(k => k.description === "Primary attack");
    if (!keybind) {
      return null;
    }

    return keybind.binds[0].iconClass;
  }

  public render() {
    const playerState = hordetest.game.selfPlayerState;
    const hearts = Array.from(Array(playerState.maxDeaths));
    const livesLeft = playerState.maxDeaths - playerState.currentDeaths;
    return this.state.visible ? (
        <Container>
          <DeadTextWrapper>
            <DeadText>You Died</DeadText>
          </DeadTextWrapper>
          <HeartsParent>
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
          </HeartsParent>
          {playerState.currentDeaths >= playerState.maxDeaths && playerState.maxDeaths !== 0 ? null :
            <Button className={this.props.isConsole ? 'highlight' : ''} onClick={this.onRespawn}>
              {this.props.isConsole && <span className={game.gamepadSelectBinding.iconClass}></span>}
              Revive
            </Button>
          }
          <FlexSpacer />
          {playerState.currentDeaths < playerState.maxDeaths || playerState.maxDeaths === 0 ? null :
            <Button className='leave' onClick={this.onLeaveMatch}>
              {this.props.isConsole && <span className={game.gamepadSelectBinding.iconClass}></span>}
              Leave Match
            </Button>
          }
          <SpectateNextPlayerWrap>
            <SpectateNextPlayerIcon className={this.getSpectateKeybindIconClass()}></SpectateNextPlayerIcon>
            <SpectateHintText>Spectate Next Player</SpectateHintText>
          </SpectateNextPlayerWrap>
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

  private onLeaveMatch = () => {
    game.disconnectFromAllServers();
    this.props.clearMatchmakingContext();
    this.props.onLeaveMatch();
  }

  private setWaitingForSelect = (isWaitingForSelect: boolean) => {
    game.setWaitingForSelect(isWaitingForSelect);
  }
}

export function Respawn(props: { onLeaveMatch: () => void }) {
  const inputContext = useContext(InputContext);
  const matchmakingContext = useContext(MatchmakingContext);
  return (
    <RespawnWithInjectedContext
      isConsole={inputContext.isConsole}
      clearMatchmakingContext={matchmakingContext.clearMatchmakingContext}
      onLeaveMatch={props.onLeaveMatch}
    />
  );
}
