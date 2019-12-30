/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  text-transform: uppercase;
`;

const WaitingForConnectionText = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Colus;
  font-size: 32px;
  color: white;
`;

const WaitingTimer = styled.div`
  font-size: 24px;
  font-family: Colus;
  color: white;
`;

const CountdownText = styled.div`
  font-family: Colus;
  font-size: 45px;
  color: white;

  &.animate {
    animation: popIn 0.2s forwards;

    @keyframes popIn {
      from {
        transform: scale(1.5);
      }

      to {
        transform: scale(1);
      }
    }
  }
`;

const GoText = styled.div`
  font-family: Colus;
  font-size: 60px;
  color: white;
  animation: popIn 0.2s forwards;

    @keyframes popIn {
      from {
        transform: scale(1.5);
      }

      to {
        transform: scale(1);
      }
    }
`;

export interface Props {
}

export interface State {
  scenarioState: ScenarioRoundState;
  scenarioStateEndTime: number;
  message: string;
  shouldAnimate: boolean;
}

export class ScenarioIntro extends React.Component<Props, State> {
  private evh: EventHandle;
  private countdownTimeout: number;
  private animateTimeout: number;
  constructor(props: Props) {
    super(props);
    this.state = {
      scenarioState: hordetest.game.selfPlayerState.scenarioRoundState,
      scenarioStateEndTime: hordetest.game.selfPlayerState.scenarioRoundStateEndTime,
      message: '0',
      shouldAnimate: false
    };
  }

  public render() {
    return (
      <Container>
        {this.renderMessage()}
      </Container>
    );
  }

  public componentDidMount() {
    this.evh = hordetest.game.onScenarioRoundUpdate(this.handleScenarioRoundUpdate);
  }

  public componentWillUnmount() {
    this.evh.clear();
  }

  private handleScenarioRoundUpdate = (newScenarioState: ScenarioRoundState, newScenarioStateEndTime: number) => {
    if (this.state.scenarioState !== ScenarioRoundState.WaitingForConnections &&
        newScenarioState === ScenarioRoundState.WaitingForConnections) {
      this.updateCountdown(newScenarioStateEndTime - game.worldTime);
    }

    if (this.state.scenarioState !== ScenarioRoundState.Countdown && newScenarioState === ScenarioRoundState.Countdown) {
      this.stopCountdown();
      this.updateCountdown(newScenarioStateEndTime - game.worldTime);
    }

    if (this.state.scenarioState === ScenarioRoundState.Countdown && newScenarioState !== ScenarioRoundState.Countdown) {
      this.stopCountdown();
      this.showGoMessage();
    }

    this.setState({ scenarioState: newScenarioState, scenarioStateEndTime: newScenarioStateEndTime });
  }

  private renderMessage = () => {
    switch (this.state.scenarioState) {
      case ScenarioRoundState.WaitingForConnections: {
        return (
          <WaitingForConnectionText>
            WAITING FOR PLAYERS
            <WaitingTimer>({this.state.message})</WaitingTimer>
          </WaitingForConnectionText>
        );
      }

      case ScenarioRoundState.Countdown: {
        return (
          <CountdownText className={this.state.shouldAnimate ? 'animate' : ''}>{this.state.message}</CountdownText>
        );
      }

      case ScenarioRoundState.Running: {
        return (
          <GoText>{this.state.message}</GoText>
        )
      }

      default: {
        return null;
      }
    }
  }

  private updateCountdown = (countdown: number) => {
    this.setState({ shouldAnimate: true, message: Math.round(countdown).toString() });

    this.animateTimeout = window.setTimeout(() => {
      this.setState({ shouldAnimate: false });
    }, 200);

    const newCountdown = countdown - 1;
    this.countdownTimeout = window.setTimeout(() => {
      if (newCountdown > 0) {
        this.updateCountdown(newCountdown);
      }
    }, 1000);
  }

  private stopCountdown = () => {
    window.clearTimeout(this.countdownTimeout);
    window.clearTimeout(this.animateTimeout);
  }

  private showGoMessage = () => {
    this.setState({ message: 'GO' });

    window.setTimeout(() => {
      this.setState({ message: '' });
    }, 5000);
  }
}
