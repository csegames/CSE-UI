/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';
import { client, PlayerState, Vec3f, utils } from 'camelot-unchained';
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
  myPlayerPosition: Vec3f;
  otherPlayerPosition: Vec3f;
  playerState: PlayerState;
}

class PlayerHealth extends React.Component<PlayerHealthProps, PlayerHealthState> {
  constructor(props: PlayerHealthProps) {
    super(props);
    this.state = {
      myPlayerPosition: { x: 0, y: 0, z: 0 },
      otherPlayerPosition: { x: 0, y: 0, z: 0 },
      playerState: null,
    };
  }

  public render() {
    if (!this.state.playerState || this.state.playerState.type !== 'player') return null;

    const { otherPlayerPosition, myPlayerPosition } = this.state;
    const distanceToTarget = otherPlayerPosition && myPlayerPosition ?
      Number(utils.distanceVec3(otherPlayerPosition, myPlayerPosition).toFixed(1)) : 0;
    return (
      <Container>
        <HealthBar
          type='compact'
          playerState={this.state.playerState}
          distanceToTarget={distanceToTarget}
        />
      </Container>
    );
  }

  public componentDidMount() {
    client.OnFriendlyTargetStateChanged(this.setPlayerState);
    client.OnPlayerStateChanged(this.setMyPlayerPosition);
  }

  public shouldComponentUpdate(nextProps: PlayerHealthProps, nextState: PlayerHealthState) {
    return !_.isEqual(nextState.myPlayerPosition, this.state.myPlayerPosition) ||
      !_.isEqual(nextState.otherPlayerPosition, this.state.otherPlayerPosition) ||
      !_.isEqual(nextState.playerState, this.state.playerState);
  }

  private setPlayerState = (playerState: PlayerState) => {
    if (playerState && playerState.position) {
      this.setState({ otherPlayerPosition: playerState.position });
    }
    this.setState({ playerState });
  }

  private setMyPlayerPosition = (playerState: PlayerState) => {
    if (playerState && playerState.position) {
      this.setState({ myPlayerPosition: playerState.position });
    }
  }
}

export default PlayerHealth;
