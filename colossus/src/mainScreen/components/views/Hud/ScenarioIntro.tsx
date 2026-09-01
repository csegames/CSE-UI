/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { RootState } from '../../../redux/store';
import { connect } from 'react-redux';
import { ScenarioRoundState } from '@csegames/library/dist/hordetest/webAPI/definitions';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { StringTableEntryDef } from '../../../dataSources/manifest/stringTableManifest';
import { Dictionary } from '@reduxjs/toolkit';
import { getStringTableValue } from '../../../helpers/stringTableHelpers';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { AnimationData } from '@csegames/library/dist/_baseGame/GameClientModels/AnimationData';

const Container = 'ScenarioIntro-Container';
const BackfillText = 'ScenarioIntro-BackfillText';
const BackfillTimer = 'ScenarioIntro-BackfillTimer';
const BackfillLockedText = 'ScenarioIntro-BackfillLockedText';
const BackfillLockedTimer = 'ScenarioIntro-BackfillLockedTimer';
const WaitingForConnectionsText = 'ScenarioIntro-WaitingForConnectionsText';
const WaitingForConnectionsTimer = 'ScenarioIntro-WaitingForConnectionsTimer';
const CountdownText = 'ScenarioIntro-CountdownText';
const CountdownTimer = 'ScenarioIntro-CountdownTimer';

const GoText = 'ScenarioIntro-GoText';

const StringIDHUDScenarioIntroBackfill = 'HUDScenarioIntroBackfill';
const StringIDHUDScenarioIntroBackfillLocked = 'HUDScenarioIntroBackfillLocked';
const StringIDHUDScenarioIntroGo = 'HUDScenarioIntroGo';
const StringIDHUDScenarioIntroWaitingForConnections = 'HUDScenarioIntroWaitingForConnections';
const StringIDHUDScenarioIntroCountdown = 'HUDScenarioIntroCountdown';

const ShowGoUntilMS = 5000;

interface ReactProps {}

interface InjectedProps {
  scenarioState: ScenarioRoundState;
  scenarioStateEndTime: number;
  stringTable: Dictionary<StringTableEntryDef>;
}

type Props = ReactProps & InjectedProps;

export interface State {
  animationHandle: ListenerHandle | null;
  message: string;
  prevState: ScenarioRoundState | null;
  showGoUntil: DOMHighResTimeStamp;
}

class AScenarioIntro extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      animationHandle: this.isCountdownState() ? clientAPI.startAnimation(this.animate.bind(this)) : null,
      message: null,
      prevState: ScenarioRoundState.Uninitialized,
      showGoUntil: NaN
    };
  }

  public render() {
    if (isFinite(this.state.showGoUntil)) {
      return (
        <div id='ScenarioIntroContainer_HUD' className={Container}>
          <div className={GoText}>{this.state.message}</div>
        </div>
      );
    }

    const details = this.getRenderDetails();
    if (!details) return null;
    return (
      <div id='ScenarioIntroContainer_HUD' className={Container}>
        <div className={details.className}>
          {getStringTableValue(details.stringID, this.props.stringTable)}
          <div className={details.messageClassName}>{this.state.message}</div>
        </div>
      </div>
    );
  }

  public componentDidUpdate(prevProps: Props): void {
    if (this.shouldAnimate() && !this.state.animationHandle) {
      this.setState({ animationHandle: clientAPI.startAnimation(this.animate.bind(this)) });
    }
  }

  public componentWillUnmount() {
    this.state.animationHandle?.close();
  }

  private animate(data: AnimationData, timestamp: DOMHighResTimeStamp): void {
    if (!this.shouldAnimate()) {
      this.clearState(true);
    }

    let message = '';
    let showGoUntil = NaN;
    let sound: SoundEvents | null = null;

    if (this.isCountdownState()) {
      message = Math.max(1, Math.ceil(this.props.scenarioStateEndTime - data.worldTime)).toFixed(0);
      if (message != this.state.message) {
        switch (message) {
          case '10':
            sound = SoundEvents.PLAY_SCENARIO_START_COUNTDOWN_10;
            break;
          case '9':
            sound = SoundEvents.PLAY_SCENARIO_START_COUNTDOWN_9;
            break;
          case '8':
            sound = SoundEvents.PLAY_SCENARIO_START_COUNTDOWN_8;
            break;
          case '7':
            sound = SoundEvents.PLAY_SCENARIO_START_COUNTDOWN_7;
            break;
          case '6':
            sound = SoundEvents.PLAY_SCENARIO_START_COUNTDOWN_6;
            break;
          case '5':
            sound = SoundEvents.PLAY_SCENARIO_START_COUNTDOWN_5;
            break;
          case '4':
            sound = SoundEvents.PLAY_SCENARIO_START_COUNTDOWN_4;
            break;
          case '3':
            sound = SoundEvents.PLAY_SCENARIO_START_COUNTDOWN_3;
            break;
          case '2':
            sound = SoundEvents.PLAY_SCENARIO_START_COUNTDOWN_2;
            break;
          case '1':
            sound = SoundEvents.PLAY_SCENARIO_START_COUNTDOWN_1;
            break;
        }
      }
    } else if (this.state.prevState == ScenarioRoundState.Countdown) {
      message = getStringTableValue(StringIDHUDScenarioIntroGo, this.props.stringTable);
      sound = SoundEvents.PLAY_SCENARIO_START_COUNTDOWN_GO;
      showGoUntil = timestamp + ShowGoUntilMS;
    } else if (isFinite(this.state.showGoUntil)) {
      if (this.state.showGoUntil > timestamp) {
        return;
      }
      this.clearState(true);
      return;
    }

    if (message !== this.state.message || this.state.prevState != this.props.scenarioState) {
      this.setState({ message, prevState: this.props.scenarioState, showGoUntil });
      if (sound) {
        clientAPI.playGameSound(sound);
      }
    }
  }

  private isCountdownState(): boolean {
    switch (this.props.scenarioState) {
      case ScenarioRoundState.Backfill:
      case ScenarioRoundState.BackfillLocked:
      case ScenarioRoundState.WaitingForConnections:
      case ScenarioRoundState.Countdown:
        return true;
    }
    return false;
  }

  private shouldAnimate(): boolean {
    return (
      this.isCountdownState() ||
      (this.state.message && this.state.prevState === ScenarioRoundState.Countdown) ||
      isFinite(this.state.showGoUntil)
    );
  }

  private clearState(stopAnimation: boolean): void {
    if (!this.state.message && (!stopAnimation || !this.state.animationHandle)) {
      return;
    }

    let animationHandle = this.state.animationHandle;
    if (stopAnimation) {
      animationHandle?.close();
      animationHandle = null;
    }
    this.setState({
      animationHandle,
      message: null,
      prevState: ScenarioRoundState.Uninitialized,
      showGoUntil: NaN
    });
  }

  private getRenderDetails(): { className: string; stringID: string; messageClassName: string } | null {
    switch (this.props.scenarioState) {
      case ScenarioRoundState.Backfill:
        return { className: BackfillText, stringID: StringIDHUDScenarioIntroBackfill, messageClassName: BackfillTimer };
      case ScenarioRoundState.BackfillLocked:
        return {
          className: BackfillLockedText,
          stringID: StringIDHUDScenarioIntroBackfillLocked,
          messageClassName: BackfillLockedTimer
        };
      case ScenarioRoundState.WaitingForConnections:
        return {
          className: WaitingForConnectionsText,
          stringID: StringIDHUDScenarioIntroWaitingForConnections,
          messageClassName: WaitingForConnectionsTimer
        };
      case ScenarioRoundState.Countdown:
        return {
          className: CountdownText,
          stringID: StringIDHUDScenarioIntroCountdown,
          messageClassName: CountdownTimer
        };
      default:
        return null;
    }
  }
}

function mapStateToProps(state: RootState): Props {
  const { scenarioRoundState, scenarioRoundStateEndTime } = state.entities.self;
  return {
    scenarioState: scenarioRoundState,
    scenarioStateEndTime: scenarioRoundStateEndTime,
    stringTable: state.stringTable.stringTable
  };
}

export const ScenarioIntro = connect(mapStateToProps)(AScenarioIntro);
