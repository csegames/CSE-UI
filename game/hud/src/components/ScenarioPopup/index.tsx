/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { client, soundEvents } from '@csegames/camelot-unchained';

import Victory from './components/Victory';
import Defeat from './components/Defeat';
import RoundOver from './components/RoundOver';

const PopupContainer = styled('div')`
  display: block;
  position: fixed;
  top: 20%;
  left: 0;
  right: 0;
  margin: 0 auto;
  display: flex;
  justify-content: center;
  pointer-events: none;
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
}

class ScenarioPopup extends React.Component<ScenarioPopupProps, ScenarioPopupState> {
  private scenarioNoneTimeout: any;
  private visibilityTimeout: any;
  constructor(props: ScenarioPopupProps) {
    super(props);
    this.state = {
      type: ScenarioPopupType.None,
    };
  }

  public render() {
    const { type } = this.state;
    switch (type) {
      case ScenarioPopupType.Victory: {
        return (
          <PopupContainer>
            <Victory />
          </PopupContainer>
        );
      }
      case ScenarioPopupType.Defeat: {
        return (
          <PopupContainer>
            <Defeat />
          </PopupContainer>
        );
      }
      case ScenarioPopupType.RoundOver: {
        return (
          <PopupContainer>
            <RoundOver />
          </PopupContainer>
        );
      }
      default: return null;
    }
  }

  public componentDidMount() {
    client.ScenarioRoundEnded((scenarioID: string, roundID: string, scenarioEnded: boolean, didWin: boolean) => {
      this.handleScenarioType(scenarioEnded, didWin);
    });
  }

  public componentWillUnmount() {
    if (this.visibilityTimeout) {
      clearTimeout(this.visibilityTimeout);
      this.visibilityTimeout = null;
    }

    if (this.scenarioNoneTimeout) {
      clearTimeout(this.scenarioNoneTimeout);
      this.scenarioNoneTimeout = null;
    }
  }

  private handleScenarioType = (scenarioEnded: boolean, didWin: boolean) => {
    if (scenarioEnded) {
      // Show either Victory or Defeat
      if (didWin) {
        this.playSound('victory');
        // Add delay so widget can match up with music
        this.visibilityTimeout = setTimeout(() => this.setState({ type: ScenarioPopupType.Victory }), 2000);
      } else {
        this.playSound('defeat');
        // Add delay so widget can match up with music
        this.visibilityTimeout = setTimeout(() => this.setState({ type: ScenarioPopupType.Defeat }), 2000);
      }
    } else {
      // Just show round over
      client.ReleaseInputOwnership();
      this.playSound('roundover');
      this.setState({ type: ScenarioPopupType.RoundOver });
    }

    this.scenarioNoneTimeout = setTimeout(() => this.setState({ type: ScenarioPopupType.None }), 4500);
  }

  private playSound = (sound: 'victory' | 'defeat' | 'roundover') => {
    switch (sound) {
      case 'victory': {
        client.PlaySoundEvent(soundEvents.PLAY_MUSIC_SCENARIO_VICTORY);
        break;
      }
      case 'defeat': {
        client.PlaySoundEvent(soundEvents.PLAY_MUSIC_SCENARIO_DEFEAT);
        break;
      }
      case 'roundover': {
        client.PlaySoundEvent(soundEvents.PLAY_SCENARIO_UI_WIDGET_ROUNDOVER);
        break;
      }
      default: break;
    }
  }
}

export default ScenarioPopup;
