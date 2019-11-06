/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { KillStreakCounterData } from '.';

const ANIMATION_DURATION = 0.3;

const KillStreakCounterContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 200px;
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
  flex: 1;
`;

const BG = styled.div`
  position: absolute;
  width: 390px;
  height: 65px;
  left: -15%;
  z-index: -1;
  -webkit-mask-image: url(../images/hud/kill-counter.svg);
  -webkit-mask-size: contain;
  background: ${(props: { color: string } & React.HTMLProps<HTMLDivElement>) =>
    `linear-gradient(to right, ${props.color}, transparent)`};

  &.bigNumber {
    animation: bigNumber ${ANIMATION_DURATION}s forwards;
  }

  @keyframes bigNumber {
    from {
      transform: translateX(50%);
    }

    to {
      transform: translateX(0%);
    }
  }
`;

const Text = styled.div`
  color: white;
  font-size: 21px;
  line-height: 21px;
  text-transform: uppercase;
  font-family: Colus;
`;

const BarContainer = styled.div`
  position: relative;
  width: 100%;
  height: 10px;
  border: 2px solid #bdbab4;
`;

const Fill = styled.div`
  position: absolute;
  top: 1px;
  right: 1px;
  bottom: 1px;
  left: 1px;
  background-color: #f7f7f7;
`;

export interface Props {
  killStreakCounter: KillStreakCounterData;
  onTimerFinish: () => void;
}

export interface State {
  timerProgress: number;
  shouldPlayNumberChangeAnimation: boolean;
  shouldPlayBigNumberAnimation: boolean;
}

export class Counter extends React.Component<Props, State> {
  private timerHandle: number;
  private playSlideHandle: number;
  private playBigNumberHandle: number;
  constructor(props: Props) {
    super(props);
    this.state = {
      timerProgress: 0,
      shouldPlayNumberChangeAnimation: false,
      shouldPlayBigNumberAnimation: false,
    }
  }

  public render() {
    const slideAnimationClass = this.state.shouldPlayNumberChangeAnimation ? 'animation' : '';
    const bigNumberAnimationClass = this.state.shouldPlayBigNumberAnimation ? 'bigNumber' : '';
    return (
      <KillStreakCounterContainer>
        <BG color={this.getColor()} className={bigNumberAnimationClass} />
        <Kills className={`${slideAnimationClass} ${bigNumberAnimationClass}`}>
          {this.props.killStreakCounter.newCount}
        </Kills>
        <Content>
          <Text>Kills</Text>
          <BarContainer>
            <Fill style={{ width: `${this.state.timerProgress}%` }} />
          </BarContainer>
        </Content>
      </KillStreakCounterContainer>
    );
  }

  public componentDidMount() {
    this.timerHandle = window.setInterval(this.updateTimer, 30);
  }

  public componentDidUpdate(prevProps: Props) {
    if (prevProps.killStreakCounter.newCount !== this.props.killStreakCounter.newCount) {
      window.clearInterval(this.timerHandle);
      this.timerHandle = null;

      this.timerHandle = window.setInterval(this.updateTimer, 30);

      this.playSlideAnimation();

      if (prevProps.killStreakCounter.newCount < 10 && this.props.killStreakCounter.newCount >= 10) {
        this.playBGAnimation();
      } else if (prevProps.killStreakCounter.newCount < 20 && this.props.killStreakCounter.newCount >= 20) {
        this.playBGAnimation();
      } else if (prevProps.killStreakCounter.newCount < 50 && this.props.killStreakCounter.newCount >= 50) {
        this.playBGAnimation();
      } else if (prevProps.killStreakCounter.newCount < 100 && this.props.killStreakCounter.newCount >= 100) {
        this.playBGAnimation();
      }
    }
  }

  private playSlideAnimation = () => {
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
