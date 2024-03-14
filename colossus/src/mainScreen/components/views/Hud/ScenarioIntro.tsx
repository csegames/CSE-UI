/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { RootState } from '../../../redux/store';
import { connect } from 'react-redux';
import { ScenarioRoundState } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { StringTableEntryDef } from '@csegames/library/dist/hordetest/graphql/schema';
import { Dictionary } from '@reduxjs/toolkit';
import { getStringTableValue } from '../../../helpers/stringTableHelpers';

const Container = 'ScenarioIntro-Container';
const WaitingForConnectionText = 'ScenarioIntro-WaitingForConnectionText';
const WaitingTimer = 'ScenarioIntro-WaitingTimer';
const CountdownText = 'ScenarioIntro-CountdownText';

const GoText = 'ScenarioIntro-GoText';

const StringIDHUDScenarioIntroGo = 'HUDScenarioIntroGo';
const StringIDHUDScenarioIntroWaitingForPlayers = 'HUDScenarioIntroWaitingForPlayers';

interface ComponentProps {}

interface InjectedProps {
  scenarioState: ScenarioRoundState;
  scenarioStateEndTime: number;
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ComponentProps & InjectedProps;

export interface State {
  scenarioState: ScenarioRoundState;
  message: string;
  shouldAnimate: boolean;
}

class AScenarioIntro extends React.Component<Props, State> {
  private countdownTimeout: number;
  private animateTimeout: number;
  constructor(props: Props) {
    super(props);

    this.state = {
      scenarioState: ScenarioRoundState.Uninitialized,
      message: '',
      shouldAnimate: false
    };
  }

  public render() {
    return (
      <div id='ScenarioIntroContainer_HUD' className={Container}>
        {this.renderMessage()}
      </div>
    );
  }

  public componentDidUpdate(prevProps: Props): void {
    this.checkScenarioState();
  }

  private checkScenarioState(): void {
    if (this.props.scenarioState == this.state.scenarioState) {
      return;
    }

    const prevState = this.state.scenarioState;
    this.setState({ scenarioState: this.props.scenarioState });

    if (
      prevState !== ScenarioRoundState.WaitingForConnections &&
      this.props.scenarioState === ScenarioRoundState.WaitingForConnections
    ) {
      this.updateCountdown(this.props.scenarioStateEndTime - game.worldTime);
    }

    if (prevState !== ScenarioRoundState.Countdown && this.props.scenarioState === ScenarioRoundState.Countdown) {
      this.stopCountdown();
      this.updateCountdown(this.props.scenarioStateEndTime - game.worldTime);
    }

    if (prevState === ScenarioRoundState.Countdown && this.props.scenarioState !== ScenarioRoundState.Countdown) {
      this.stopCountdown();
      this.showGoMessage();
    }
  }

  public componentDidMount() {
    this.checkScenarioState();
  }

  public componentWillUnmount() {
    window.clearTimeout(this.animateTimeout);
    window.clearTimeout(this.countdownTimeout);
  }

  private renderMessage(): JSX.Element {
    if (!this.state.message) {
      return;
    }

    switch (this.state.scenarioState) {
      case ScenarioRoundState.WaitingForConnections: {
        return (
          <div className={WaitingForConnectionText}>
            {getStringTableValue(StringIDHUDScenarioIntroWaitingForPlayers, this.props.stringTable)}
            <div className={WaitingTimer}>({this.state.message})</div>
          </div>
        );
      }

      case ScenarioRoundState.Countdown: {
        return (
          <div className={`${CountdownText} ${this.state.shouldAnimate ? 'animate' : ''}`}>{this.state.message}</div>
        );
      }

      case ScenarioRoundState.Running: {
        return <div className={GoText}>{this.state.message}</div>;
      }

      default: {
        return;
      }
    }
  }

  private updateCountdown = (countdown: number) => {
    const roundedCountdown = Math.round(countdown);

    if (Number.isNaN(roundedCountdown) || Number.isFinite(roundedCountdown) == false || roundedCountdown <= 0) {
      return;
    }

    this.setState({ shouldAnimate: true, message: roundedCountdown.toString() });
    this.playCountdownSound(roundedCountdown);

    this.animateTimeout = window.setTimeout(() => {
      this.setState({ shouldAnimate: false });
    }, 200);

    const newCountdown = countdown - 1;
    if (newCountdown > 0) {
      this.countdownTimeout = window.setTimeout(() => {
        this.updateCountdown(newCountdown);
      }, 1000);
    }
  };

  private stopCountdown = () => {
    window.clearTimeout(this.countdownTimeout);
    window.clearTimeout(this.animateTimeout);
  };

  private showGoMessage = () => {
    game.playGameSound(SoundEvents.PLAY_SCENARIO_START_COUNTDOWN_GO);
    this.setState({ message: getStringTableValue(StringIDHUDScenarioIntroGo, this.props.stringTable) });

    window.setTimeout(() => {
      this.setState({ message: '' });
    }, 5000);
  };

  private playCountdownSound = (countdown: number) => {
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
  };
}

function mapStateToProps(state: RootState): Props {
  return {
    scenarioState: state.player.scenarioRoundState,
    scenarioStateEndTime: state.player.scenarioRoundStateEndTime,
    stringTable: state.stringTable.stringTable
  };
}

export const ScenarioIntro = connect(mapStateToProps)(AScenarioIntro);
