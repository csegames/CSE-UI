/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import moment from 'moment';
import { styled } from '@csegames/linaria/react';

const MatchInfoContainer = styled.div`
  display: flex;
  width: 300px;
  justify-content: space-between;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  font-weight: bold;
  font-family: Exo;
  font-weight: bold;
  font-size: 20px;
  color: white;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
`;

export interface Props {
}

export interface State {
  fps: number;
  roundStartTime: number;
}

export class MatchInfo extends React.Component<Props, State> {
  private updateFPSInterval: number;
  private roundUpdateHandle: EventHandle;
  constructor(props: Props) {
    super(props);
    this.state = {
      fps: Math.round(game.fps),
      roundStartTime: 0,
    };
  }

  public render() {
    console.log(`render match info: ${game.worldTime - this.state.roundStartTime}`)
    return (
      <MatchInfoContainer>
        <Item>{moment((game.worldTime - this.state.roundStartTime)* 1000).format('h:mm:ss')}</Item>
        <Item>1523 Kills</Item>
        <Item>{this.state.fps} FPS</Item>
      </MatchInfoContainer>
    );
  }

  public componentDidMount() {
    this.updateFPSInterval = window.setInterval(this.updateFPS, 500);
    this.roundUpdateHandle = hordetest.game.onScenarioRoundUpdate(this.handleScenarioRoundUpdate);

  }

  public componentWillUnmount() {
    window.clearInterval(this.updateFPSInterval);
    this.roundUpdateHandle.clear();
  }

  private updateFPS = () => {
    this.setState(s => ({ ...s, fps: Math.round(game.fps) }));
    this.forceUpdate();
  }

  private handleScenarioRoundUpdate = (newScenarioState: ScenarioRoundState, newScenarioStateStartTime: number, newScenarioStateEndTime: number) => {
    this.setState(s => ({
      ...s,
      roundStartTime: newScenarioStateStartTime,
    }));
  }
}
