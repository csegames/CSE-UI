/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { throttle } from 'lodash';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { formatTime } from '../../lib/timeHelpers';

const MatchInfoContainer = styled.div`
  display: flex;
  width: 300px;
  justify-content: space-between;
`;

const Icon = styled.span`
  margin-right: 5px;
`;

const Item = styled.div`
  display: flex;
  align-items: center;
  font-family: Exo;
  font-size: 18px;
  color: white;
  text-shadow: 1px 1px 0px rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
`;

const MatchTimerStyle = css`
  width: 90px;
`;

export interface Props {
}

export interface State {
  fps: number;
  roundStartTime: number;
  totalKills: number;
}

export class MatchInfo extends React.Component<Props, State> {
  private updateFPSInterval: number;
  private roundUpdateEVH: EventHandle;
  private playerStateEVH: EventHandle;
  constructor(props: Props) {
    super(props);

    this.handlePlayerStateUpdate = throttle(this.handlePlayerStateUpdate, 1000);

    const playerClone = cloneDeep(hordetest.game.selfPlayerState);
    this.state = {
      fps: Math.round(game.fps),
      roundStartTime: playerClone.scenarioRoundState === ScenarioRoundState.Running ?
        playerClone.scenarioRoundStateStartTime : NaN,
      totalKills: playerClone.totalKills || 0,
    };
  }

  public render() {
    return (
      <MatchInfoContainer>
        <Item>
          <Icon className='fs-icon-misc-kills'></Icon>
          {this.state.totalKills} Kills
        </Item>
        <Item className={MatchTimerStyle}>
          <Icon className='fs-icon-misc-time'></Icon>
          {isFinite(game.worldTime) && isFinite(this.state.roundStartTime) ? formatTime(game.worldTime - this.state.roundStartTime) : "00:00"}
        </Item>
        <Item>
          {this.state.fps} FPS
        </Item>
      </MatchInfoContainer>
    );
  }

  public componentDidMount() {
    this.updateFPSInterval = window.setInterval(this.updateFPS, 500);
    this.roundUpdateEVH = hordetest.game.onScenarioRoundUpdate(this.handleScenarioRoundUpdate);
    this.playerStateEVH = hordetest.game.selfPlayerState.onUpdated(this.handlePlayerStateUpdate);
  }

  public componentWillUnmount() {
    window.clearInterval(this.updateFPSInterval);
    this.roundUpdateEVH.clear();
    this.playerStateEVH.clear();
  }

  private updateFPS = () => {
    this.setState(s => ({ ...s, fps: Math.round(game.fps) }));
    this.forceUpdate();
  }

  private handleScenarioRoundUpdate = (newScenarioState: ScenarioRoundState, newScenarioStateStartTime: number) => {
    this.setState(s => ({
      ...s,
      roundStartTime: newScenarioState === ScenarioRoundState.Running ? newScenarioStateStartTime : NaN,
    }));
  }

  private handlePlayerStateUpdate = () => {
    const playerStateClone = cloneDeep(hordetest.game.selfPlayerState);
    if (playerStateClone) {
      if (typeof playerStateClone.totalKills === 'number' && !playerStateClone.totalKills.floatEquals(this.state.totalKills)) {
        this.setState({ totalKills: playerStateClone.totalKills });
      }

      this.setState({ roundStartTime: playerStateClone.scenarioRoundState === ScenarioRoundState.Running ? playerStateClone.scenarioRoundStateStartTime : NaN });
    }
  }
}
