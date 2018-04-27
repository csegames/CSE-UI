/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';
import { client, PlayerState, Vec3f, utils } from '@csegames/camelot-unchained';
import HealthBar from './HealthBar';

const Container = styled('div')`
  transform: scale(0.45);
  -webkit-transform: scale(0.45);
  margin-left: -125px;
  margin-top: -80px;
`;

export interface PlayerHealthProps {
}

export interface PlayerHealthState {
  distanceToTarget: number;
  playerState: PlayerState;
}

class PlayerHealth extends React.Component<PlayerHealthProps, PlayerHealthState> {
  private myPlayerPosition: Vec3f;
  private otherPlayerPosition: Vec3f;
  constructor(props: PlayerHealthProps) {
    super(props);
    this.state = {
      distanceToTarget: 0,
      playerState: null,
    };
    this.setPlayerState = _.throttle(this.setPlayerState, 300);
    this.setMyPlayerPosition = _.throttle(this.setMyPlayerPosition, 1000);
  }

  public render() {
    if (!this.state.playerState || this.state.playerState.type !== 'player') return null;

    return (
      <Container>
        <HealthBar
          type='compact'
          playerState={this.state.playerState}
          distanceToTarget={this.state.distanceToTarget}
        />
      </Container>
    );
  }

  public componentDidMount() {
    client.OnFriendlyTargetStateChanged(this.setPlayerState);
    client.OnPlayerStateChanged(this.setMyPlayerPosition);
  }

  public shouldComponentUpdate(nextProps: PlayerHealthProps, nextState: PlayerHealthState) {
    return !utils.numEqualsCloseEnough(nextState.distanceToTarget, this.state.distanceToTarget) ||
      !_.isEqual(nextState.playerState, this.state.playerState);
  }

  private setPlayerState = (playerState: PlayerState) => {
    if (playerState && playerState.position) {
      this.otherPlayerPosition = playerState.position;
      const distanceToTarget = this.getDistanceToTarget(this.myPlayerPosition, this.otherPlayerPosition);
      this.setState({ playerState, distanceToTarget });
    } else {
      this.setState({ playerState });
    }
  }

  private setMyPlayerPosition = (playerState: PlayerState) => {
    if (playerState && playerState.position) {
      this.myPlayerPosition = playerState.position;
      const distanceToTarget = this.getDistanceToTarget(this.myPlayerPosition, this.otherPlayerPosition);
      this.setState({ distanceToTarget });
    }
  }

  private getDistanceToTarget = (myPlayerPosition: Vec3f, otherPlayerPosition: Vec3f) => {
    if (otherPlayerPosition && myPlayerPosition) {
      const distanceToTarget = Number(utils.distanceVec3(otherPlayerPosition, myPlayerPosition).toFixed(2));
      return distanceToTarget;
    } else {
      return 0;
    }
  }
}

export default PlayerHealth;
