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
  scenarioStateStartTime: number;
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
      scenarioStateStartTime: hordetest.game.selfPlayerState.scenarioRoundStateStartTime,
      message: '',
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

    window.clearTimeout(this.animateTimeout);
    window.clearTimeout(this.countdownTimeout);
  }

  private handleScenarioRoundUpdate = (newScenarioState: ScenarioRoundState, newScenarioStateStartTime: number, newScenarioStateEndTime: number) => {
    if (this.state.scenarioState !== ScenarioRoundState.WaitingForConnections &&
        newScenarioState === ScenarioRoundState.WaitingForConnections) {
      this.updateMatchDuration(game.worldTime - newScenarioStateStartTime);
    }

    if (this.state.scenarioState !== ScenarioRoundState.Countdown && newScenarioState === ScenarioRoundState.Countdown) {
      this.stopCountdown();
      this.updateMatchDuration(game.worldTime - newScenarioStateStartTime);
    }

    if (this.state.scenarioState === ScenarioRoundState.Countdown && newScenarioState !== ScenarioRoundState.Countdown) {
      this.stopCountdown();
      this.showGoMessage();
    }

    this.setState({
      scenarioState: newScenarioState,
      scenarioStateStartTime: newScenarioStateStartTime,
      scenarioStateEndTime: newScenarioStateEndTime,
    });
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

  private updateMatchDuration = (countdown: number) => {
    this.setState({ shouldAnimate: true, message: Math.round(countdown).toString() });

    this.animateTimeout = window.setTimeout(() => {
      this.setState({ shouldAnimate: false });
    }, 200);

    this.countdownTimeout = window.setTimeout(() => {
        this.updateMatchDuration(game.worldTime - this.state.scenarioStateStartTime);
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
