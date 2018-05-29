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

  private handleScenarioType = (scenarioEnded: boolean, didWin: boolean) => {
    if (scenarioEnded) {
      // Show either Victory or Defeat
      if (didWin) {
        this.setState({ type: ScenarioPopupType.Victory });
      } else {
        this.setState({ type: ScenarioPopupType.Defeat });
      }
    } else {
      // Just show round over
      client.ReleaseInputOwnership();
      client.PlaySoundEvent(soundEvents.PLAY_SCENARIO_UI_WIDGET_ROUNDOVER);
      this.setState({ type: ScenarioPopupType.RoundOver });
    }

    setTimeout(() => this.setState({ type: ScenarioPopupType.None }), 4500);
  }
}

export default ScenarioPopup;
