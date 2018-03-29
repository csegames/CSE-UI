/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';
import { client, PlayerState } from 'camelot-unchained';
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
  playerState: PlayerState;
}

class PlayerHealth extends React.Component<PlayerHealthProps, PlayerHealthState> {
  constructor(props: PlayerHealthProps) {
    super(props);
    this.state = {
      playerState: null,
    };
  }

  public render() {
    if (!this.state.playerState || this.state.playerState.type !== 'player') return null;
    return (
      <Container>
        <HealthBar type='compact' playerState={this.state.playerState} />
      </Container>
    );
  }

  public componentDidMount() {
    client.OnPlayerStateChanged(this.setPlayerState);
  }

  public shouldComponentUpdate(nextProps: PlayerHealthProps, nextState: PlayerHealthState) {
    return !_.isEqual(nextState.playerState, this.state.playerState);
  }

  private setPlayerState = (playerState: PlayerState) => {
    this.setState({ playerState });
  }
}

export default PlayerHealth;
