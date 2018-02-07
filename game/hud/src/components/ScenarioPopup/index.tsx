/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';

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
  // Will get rid of this, simulating getting type from client
  type: ScenarioPopupType;
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

  public componentWillReceiveProps(nextProps: ScenarioPopupProps) {
    if (this.props.type !== nextProps.type) {
      this.setState({ type: nextProps.type });
    }
  }
}

export default ScenarioPopup;
