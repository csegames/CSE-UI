/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { client, PlayerState } from 'camelot-unchained';
import styled from 'react-emotion';

const Container = styled('div')`
  width: 415px;
  height: 248.3px;
`;

import PlayerStatusComponent from './PlayerStatusComponent';

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
    if (!this.state.playerState) return null;
    return (
      <Container>
        <PlayerStatusComponent
          containerClass='PlayerHealth'
          playerState={this.state.playerState}
        />
      </Container>
    );
  }

  public componentDidMount() {
    client.OnPlayerStateChanged(this.setPlayerState);
  }

  public shouldComponentUpdate(nextProps: PlayerHealthProps, nextState: PlayerHealthState) {
    return true;
  }

  private setPlayerState = (playerState: PlayerState) => {
    this.setState({ playerState });
  }
}

export default PlayerHealth;
