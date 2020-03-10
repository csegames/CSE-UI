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
  private shouldPlayInGameMusic: boolean = true;
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

  private updateCountdown = (countdown: number) => {
    const roundedCountdown = Math.round(countdown);
    this.setState({ shouldAnimate: true, message: roundedCountdown.toString() });
    this.playCountdownSound(roundedCountdown);

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
    game.playGameSound(SoundEvents.PLAY_SCENARIO_START_COUNTDOWN_GO);
    this.setState({ message: 'GO' });

    window.setTimeout(() => {
      this.setState({ message: '' });
    }, 5000);
  }

  private playCountdownSound = (countdown: number) => {
    if (this.shouldPlayInGameMusic) {
      game.playGameSound(SoundEvents.PLAY_MUSIC_IN_GAME);
      this.shouldPlayInGameMusic = false;
    }

    switch (countdown) {
      case 10: {
        game.playGameSound(SoundEvents.PLAY_SCENARIO_START_COUNTDOWN_10);
        break;
      }

      case 9: {
        game.playGameSound(SoundEvents.PLAY_SCENARIO_START_COUNTDOWN_9);
        break;
      }

      case 8: {
        game.playGameSound(SoundEvents.PLAY_SCENARIO_START_COUNTDOWN_8);
        break;
      }

      case 7: {
        game.playGameSound(SoundEvents.PLAY_SCENARIO_START_COUNTDOWN_7);
        break;
      }

      case 6: {
        game.playGameSound(SoundEvents.PLAY_SCENARIO_START_COUNTDOWN_6);
        break;
      }

      case 5: {
        game.playGameSound(SoundEvents.PLAY_SCENARIO_START_COUNTDOWN_5);
        break;
      }

      case 4: {
        game.playGameSound(SoundEvents.PLAY_SCENARIO_START_COUNTDOWN_4);
        break;
      }

      case 3: {
        game.playGameSound(SoundEvents.PLAY_SCENARIO_START_COUNTDOWN_3);
        break;
      }

      case 2: {
        game.playGameSound(SoundEvents.PLAY_SCENARIO_START_COUNTDOWN_2);
        break;
      }

      case 1: {
        game.playGameSound(SoundEvents.PLAY_SCENARIO_START_COUNTDOWN_1);
        break;
      }

      default: {
        break;
      }
    }
  }
}
