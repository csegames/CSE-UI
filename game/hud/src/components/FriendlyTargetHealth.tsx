/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';

import { isEqualPlayerState } from '../lib/playerStateEqual';
import { client, PlayerState } from '@csegames/camelot-unchained';
import HealthBar from './HealthBar';
import { showFriendlyTargetContextMenu } from '../services/actions/contextMenu';

const Container = styled('div')`
  cursor: pointer;
  pointer-events: all;
  transform: scale(0.45);
  -webkit-transform: scale(0.45);
  margin-left: -125px;
  margin-top: -80px;
  pointer-events: auto;
`;

export interface PlayerHealthProps {
}

export interface PlayerHealthState {
  playerState: PlayerState;
  showContextMenu: boolean;
}

class PlayerHealth extends React.Component<PlayerHealthProps, PlayerHealthState> {
  constructor(props: PlayerHealthProps) {
    super(props);
    this.state = {
      playerState: null,
      showContextMenu: false,
    };
    this.setPlayerState = _.throttle(this.setPlayerState, 100);
  }

  public render() {
    if (!this.state.playerState || this.state.playerState.type !== 'player') return null;

    return (
      <Container onContextMenu={this.handleContextMenu}>
        <HealthBar type='compact' target='friendly' playerState={this.state.playerState} />
      </Container>
    );
  }

  public componentDidMount() {
    client.OnFriendlyTargetStateChanged(this.setPlayerState);
  }

  public shouldComponentUpdate(nextProps: PlayerHealthProps, nextState: PlayerHealthState) {
    return !isEqualPlayerState(nextState.playerState, this.state.playerState) ||
      nextState.showContextMenu !== this.state.showContextMenu;
  }

  private setPlayerState = (playerState: PlayerState) => {
    this.setState({ playerState });
  }

  private handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    showFriendlyTargetContextMenu(this.state.playerState, event);
  }
}

export default PlayerHealth;
