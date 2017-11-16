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

export interface PlayerHealthState extends PlayerState {
}

class PlayerHealth extends React.Component<PlayerHealthProps, PlayerHealthState> {
  constructor(props: PlayerHealthProps) {
    super(props);
  }

  public render() {
    if (!this.state) return null;
    return (
      <Container>
        <PlayerStatusComponent
          containerClass='TargetHealth'
          playerState={this.state}
        />
      </Container>
    );
  }

  public componentDidMount() {
    client.OnFriendlyTargetStateChanged(this.setPlayerState);
  }

  public shouldComponentUpdate(nextProps: PlayerHealthProps, nextState: PlayerHealthState) {
    return true;
  }

  private setPlayerState = (state: PlayerState) => {
    this.setState(state);
  }
}

export default PlayerHealth;
