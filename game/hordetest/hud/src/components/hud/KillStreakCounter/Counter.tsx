/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { KillStreakCounterData } from '.';

const ANIMATION_DURATION = 0.3;
const MESSAGE_ANIMATION_DURATION = 5;

const KillStreakCounterContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 95px;
`;

const Kills = styled.div`
  font-size: 52px;
  line-height: 52px;
  text-transform: uppercase;
  font-family: Colus;
  color: white;
  margin-right: 3px;

  &.animation {
    animation: animation ${ANIMATION_DURATION}s forwards;
  }

  @keyframes animation {
    from {
      transform: scale(1.5);
    }

    to {
      transform: scale(1);
    }
  }
`;

const Content = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const BG = styled.div`
  position: absolute;
  width: 300px;
  height: 85px;
  left: -70%;
  z-index: -1;
  -webkit-mask-image: url(../images/hud/kill-counter.svg);
  -webkit-mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  background: ${(props: { color: string } & React.HTMLProps<HTMLDivElement>) =>
    `linear-gradient(to left, ${props.color}, transparent 90%)`};

  &.bigNumber {
    animation: bigNumber ${ANIMATION_DURATION}s forwards;
  }

  @keyframes bigNumber {
    from {
      transform: translateX(-50%);
    }

    to {
      transform: translateX(0%);
    }
  }
`;

const Text = styled.div`
  color: white;
  margin-left: 5px;
  font-size: 21px;
  line-height: 21px;
  text-transform: uppercase;
  font-family: Colus;
`;

const BarContainer = styled.div`
  position: relative;
  width: 70%;
  height: 7px;
  border: 2px solid #bdbab4;
  transform: skewX(-20deg);
`;

const Fill = styled.div`
  position: absolute;
  top: 1px;
  right: 1px;
  bottom: 1px;
  left: 1px;
  background-color: #f7f7f7;
`;

const Message = styled.div`
  position: absolute;
  top: -50%;
  font-size: 25px;
  font-family: Colus;
  font-weight: bold;
  color: white;
  transform: translate(0%, 100%);
  white-space: nowrap;
  text-shadow:
    ${(props: { color: string } & React.HTMLProps<HTMLDivElement>) => props.color} 0px 0px 20px,
    ${(props: { color: string } & React.HTMLProps<HTMLDivElement>) => props.color} 0px 0px 30px,
    ${(props: { color: string } & React.HTMLProps<HTMLDivElement>) => props.color} 0px 0px 40px,
    ${(props: { color: string } & React.HTMLProps<HTMLDivElement>) => props.color} 0px 0px 50px,
    ${(props: { color: string } & React.HTMLProps<HTMLDivElement>) => props.color} 0px 0px 75px;

  &.animation {
    animation: pop ${MESSAGE_ANIMATION_DURATION}s forwards;
  }

  @keyframes pop {
    0% {
      opacity: 0;
      transform: translate(0%, 100%) scale(1);
    }

    5% {
      opacity: 1;
      transform: translate(0%, 100%) scale(1.5);
    }

    10% {
      transform: translate(0%, 100%) scale(1);
    }

    80% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }
`;

export interface Props {
  killStreakCounter: KillStreakCounterData;
  onTimerFinish: () => void;
}

export interface State {
  timerProgress: number;
  shouldPlayNumberChangeAnimation: boolean;
  shouldPlayBigNumberAnimation: boolean;
  shouldPlayMessageAnimation: boolean;
  killStreakMessage: string;
}

export class Counter extends React.Component<Props, State> {
  private timerHandle: number;
  private playSlideHandle: number;
  private playBigNumberHandle: number;
  private playMessageHandle: number;
  constructor(props: Props) {
    super(props);
    this.state = {
      timerProgress: 0,
      shouldPlayNumberChangeAnimation: false,
      shouldPlayBigNumberAnimation: false,
      shouldPlayMessageAnimation: false,
      killStreakMessage: '',
    }
  }

  public render() {
    const slideAnimationClass = this.state.shouldPlayNumberChangeAnimation ? 'animation' : '';
    const bigNumberAnimationClass = this.state.shouldPlayBigNumberAnimation ? 'bigNumber' : '';
    const messageAnimationClass = this.state.shouldPlayMessageAnimation ? 'animation' : '';
    const color = this.getColor();

    return (
      <KillStreakCounterContainer>
        <BG color={color} className={bigNumberAnimationClass} />
        <Content>
          <Kills className={`${slideAnimationClass} ${bigNumberAnimationClass}`}>
            {this.props.killStreakCounter.newCount}
          </Kills>
          <Text>Kills</Text>
        </Content>
        <BarContainer>
          <Fill style={{ width: `${this.state.timerProgress}%` }} />
        </BarContainer>
        <Message color={color} className={messageAnimationClass}>{this.state.killStreakMessage}</Message>
      </KillStreakCounterContainer>
    );
  }

  public componentDidMount() {
    this.timerHandle = window.setInterval(this.updateTimer, 30);
    this.checkForBGAnimation();
    this.checkForMessage();
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.killStreakCounter.newCount !== this.props.killStreakCounter.newCount) {
      window.clearInterval(this.timerHandle);
      this.timerHandle = null;

      this.timerHandle = window.setInterval(this.updateTimer, 30);

      this.playNumberChangeAnimation();

      this.checkForBGAnimation(prevProps);
      this.checkForMessage(prevProps);
    }
  }

  private checkForBGAnimation = (prevProps?: Props) => {
    if ((!prevProps || prevProps.killStreakCounter.newCount < 10) && this.props.killStreakCounter.newCount >= 10) {
      this.playBGAnimation();
    } else if ((!prevProps || prevProps.killStreakCounter.newCount < 100) && this.props.killStreakCounter.newCount >= 100) {
      this.playBGAnimation();
    } else if ((!prevProps || prevProps.killStreakCounter.newCount < 300) && this.props.killStreakCounter.newCount >= 300) {
      this.playBGAnimation();
    } else if ((!prevProps || prevProps.killStreakCounter.newCount < 600) && this.props.killStreakCounter.newCount >= 600) {
      this.playBGAnimation();
    }
  }

  private checkForMessage = (prevProps?: Props) => {
    let message = '';
    if ((!prevProps || prevProps.killStreakCounter.newCount < 10) && this.props.killStreakCounter.newCount >= 10) {
      message = 'Killing Spree!';
    }

    if ((!prevProps || prevProps.killStreakCounter.newCount < 50) && this.props.killStreakCounter.newCount >= 50) {
      message = 'Dominating!';
    }

    if ((!prevProps || prevProps.killStreakCounter.newCount < 100) && this.props.killStreakCounter.newCount >= 100) {
      message = 'Wow!';
    }

    if ((!prevProps || prevProps.killStreakCounter.newCount < 150) && this.props.killStreakCounter.newCount >= 150) {
      message = 'Massacre!'
    }

    if ((!prevProps || prevProps.killStreakCounter.newCount < 200) && this.props.killStreakCounter.newCount >= 200) {
      message = 'Ludicrous!';
    }

    if ((!prevProps || prevProps.killStreakCounter.newCount < 250) && this.props.killStreakCounter.newCount >= 250) {
      message = 'Rampage!';
    }

    if ((!prevProps || prevProps.killStreakCounter.newCount < 300) && this.props.killStreakCounter.newCount >= 300) {
      message = 'Unstoppable!';
    }

    if ((!prevProps || prevProps.killStreakCounter.newCount < 400) && this.props.killStreakCounter.newCount >= 400) {
      message = 'Godlike!';
    }

    if ((!prevProps || prevProps.killStreakCounter.newCount < 600) && this.props.killStreakCounter.newCount >= 600) {
      message = 'Legendary!';
    }

    if ((!prevProps || prevProps.killStreakCounter.newCount < 1000) && this.props.killStreakCounter.newCount >= 1000) {
      message = 'Total Annihilation!';
    }

    if (message !== '') {
      this.playMessageAnimation(message);
    }
  }

  private playNumberChangeAnimation = () => {
    window.clearTimeout(this.playSlideHandle);
    this.setState({ shouldPlayNumberChangeAnimation: true });

    this.playSlideHandle = window.setTimeout(() => {
      this.setState({ shouldPlayNumberChangeAnimation: false });
    }, ANIMATION_DURATION * 1000);
  }

  private playBGAnimation = () => {
    window.clearTimeout(this.playBigNumberHandle);
    this.setState({ shouldPlayBigNumberAnimation: true });

    this.playBigNumberHandle = window.setTimeout(() => {
      this.setState({ shouldPlayBigNumberAnimation: false });
    }, ANIMATION_DURATION * 1000);
  }

  private playMessageAnimation = (message: string) => {
    window.clearTimeout(this.playMessageHandle);
    if (this.state.shouldPlayMessageAnimation) {
      this.setState({ shouldPlayMessageAnimation: false, killStreakMessage: '' });
      window.setTimeout(() => this.setState({ shouldPlayMessageAnimation: true, killStreakMessage: message }), 5);
    } else {
      this.setState({ shouldPlayMessageAnimation: true, killStreakMessage: message });
    }

    this.playMessageHandle = window.setTimeout(() => {
      this.setState({ shouldPlayMessageAnimation: false, killStreakMessage: '' });
    }, MESSAGE_ANIMATION_DURATION * 1000);
  }

  private updateTimer = () => {
    let currentProgress = this.getCurrentProgress();
    if (currentProgress > 100) {
      currentProgress = 100;
    }

    this.setState({ timerProgress: currentProgress });

    if (currentProgress <= 0) {
      this.props.onTimerFinish();

      window.clearInterval(this.timerHandle);
      this.timerHandle = null;
    }
  }

  private getCurrentProgress = () => {
    const { killStreakCounter } = this.props;
    const elapsed = game.worldTime - killStreakCounter.newTimerStart;
    let current = killStreakCounter.newTimerMax - elapsed;
    if (current < 0) {
      current = 0;
    }
    return (current / killStreakCounter.newTimerMax) * 100;
  }

  private getColor = () => {
    const { newCount } = this.props.killStreakCounter;
    let color = '';
    if (newCount < 10) {
      color = 'transparent';
    } else if (newCount < 20) {
      color= '#666666';
    } else if (newCount < 50) {
      color = '#ff0000';
    } else if (newCount < 100) {
      color = '#8d0000';
    } else {
      color = '#000000';
    }

    return color;
  }
}
