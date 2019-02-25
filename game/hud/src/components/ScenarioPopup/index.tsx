/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from 'linaria/react';

import Victory from './components/Victory';
import Defeat from './components/Defeat';
import RoundOver from './components/RoundOver';
import HUDZOrder from 'services/session/HUDZOrder';

const PopupContainer = styled.div`
  display: block;
  position: fixed;
  top: 20%;
  left: 0;
  right: 0;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  pointer-events: none;
  z-index: ${HUDZOrder.ScenarioPopup};
`;

export enum ScenarioPopupType {
  None = 0,
  Victory = 1,
  Defeat = 2,
  RoundOver = 3,
}

export interface ScenarioPopupProps {
}

export interface ScenarioPopupState {
  type: ScenarioPopupType;
  roundResultMessage: string;
  scenarioResultMessage: string;
}

class ScenarioPopup extends React.Component<ScenarioPopupProps, ScenarioPopupState> {
  private eventHandles: EventHandle[] = [];
  private timeouts: NodeJS.Timer[] = [];

  constructor(props: ScenarioPopupProps) {
    super(props);
    this.state = {
      type: ScenarioPopupType.None,
      roundResultMessage: '',
      scenarioResultMessage: '',
    };
  }

  public render() {
    const { type } = this.state;
    switch (type) {
      case ScenarioPopupType.Victory: {
        return (
          <PopupContainer>
            <Victory scenarioResultMessage={this.state.scenarioResultMessage} />
          </PopupContainer>
        );
      }
      case ScenarioPopupType.Defeat: {
        return (
          <PopupContainer>
            <Defeat scenarioResultMessage={this.state.scenarioResultMessage} />
          </PopupContainer>
        );
      }
      case ScenarioPopupType.RoundOver: {
        return (
          <PopupContainer>
            <RoundOver roundResultMessage={this.state.roundResultMessage} />
          </PopupContainer>
        );
      }
      default: return null;
    }
  }

  public componentDidMount() {
    this.eventHandles.push(game.onScenarioRoundEnded(
      (scenarioID: string, roundID: string, scenarioEnded: boolean, didWin: boolean,
        roundResultMessage: string, scenarioResultMessage: string) => {
        this.handleScenarioType(scenarioEnded, didWin, roundResultMessage, scenarioResultMessage);
      },
    ));
  }

  public componentWillUnmount() {
    this.eventHandles.forEach(eventHandle => eventHandle.clear());
    this.timeouts.forEach(timeout => clearTimeout(timeout));
  }

  private handleScenarioType = (scenarioEnded: boolean, didWin: boolean, roundMsg: string, scenarioMsg: string) => {
    if (scenarioEnded) {
      // Play round over popup, then play either Victory or Defeat
      this.playRoundOverPopup(roundMsg);
      if (didWin) {
        this.timeouts.push(setTimeout(() => this.playVictoryPopup(scenarioMsg), 4500));
      } else {
        this.timeouts.push(setTimeout(() => this.playDefeatPopup(scenarioMsg), 4500));
      }
    } else {
      // Just show round over
      this.playRoundOverPopup(roundMsg);
    }
  }

  private playVictoryPopup = (scenarioMsg: string) => {
    this.playSound('victory');
    // Add delay so widget can match up with music
    this.setState({ type: ScenarioPopupType.Victory, scenarioResultMessage: scenarioMsg });
    this.timeouts.push(setTimeout(() => this.setState({ type: ScenarioPopupType.None, scenarioResultMessage: '' }), 4500));
  }

  private playDefeatPopup = (scenarioMsg: string) => {
    this.playSound('defeat');
    // Add delay so widget can match up with music
    this.setState({ type: ScenarioPopupType.Defeat, scenarioResultMessage: scenarioMsg });
    this.timeouts.push(setTimeout(() => this.setState({ type: ScenarioPopupType.None, scenarioResultMessage: '' }), 4500));
  }

  private playRoundOverPopup = (roundMsg: string) => {
    // Just show round over
    this.playSound('roundover');
    this.setState({ type: ScenarioPopupType.RoundOver, roundResultMessage: roundMsg });
    this.timeouts.push(setTimeout(() => this.setState({ type: ScenarioPopupType.None, roundResultMessage: '' }), 4500));
  }

  private playSound = (sound: 'victory' | 'defeat' | 'roundover') => {
    switch (sound) {
      case 'victory': {
        game.playGameSound(SoundEvent.PLAY_SCENARIO_MUSIC_VICTORY);
        break;
      }
      case 'defeat': {
        game.playGameSound(SoundEvent.PLAY_SCENARIO_MUSIC_DEFEAT);
        break;
      }
      case 'roundover': {
        game.playGameSound(SoundEvent.PLAY_SCENARIO_UI_WIDGET_ROUNDOVER);
        break;
      }
      default: break;
    }
  }
}

export default ScenarioPopup;
