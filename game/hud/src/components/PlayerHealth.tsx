/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';

import { isEqualPlayerState } from '../lib/playerStateEqual';
import HealthBar from './HealthBar';
import { showSelfContextMenu } from 'actions/contextMenu';
import { setPlayerState } from 'actions/player';
import { SelfPlayerState, DeepImmutableObject } from '@csegames/camelot-unchained';

const Container = styled('div')`
  transform: scale(0.45);
  -webkit-transform: scale(0.45);
  margin-left: -125px;
  margin-top: -80px;
  pointer-events: auto;
`;

export interface PlayerHealthProps {
}

export interface PlayerHealthState {
  playerState: DeepImmutableObject<SelfPlayerState>;
}

class PlayerHealth extends React.Component<PlayerHealthProps, PlayerHealthState> {
  private eventHandles: EventHandle[] = [];
  constructor(props: PlayerHealthProps) {
    super(props);
    this.state = {
      playerState: null,
    };
    this.setPlayerState = _.throttle(this.setPlayerState, 100);
  }

  public render() {
    if (!this.state.playerState || this.state.playerState.type !== 'player') return null;
    return (
      <Container onContextMenu={this.handleContextMenu}>
        <HealthBar type='compact' playerState={this.state.playerState} />
      </Container>
    );
  }

  public componentDidMount() {
    this.eventHandles.push(game.selfPlayerState.onUpdated(() => {
      this.setPlayerState(game.selfPlayerState);
    }));
  }

  public componentWillUnmount() {
    this.eventHandles.forEach(eventHandle => eventHandle.clear());
  }

  public shouldComponentUpdate(nextProps: PlayerHealthProps, nextState: PlayerHealthState) {
    return !isEqualPlayerState(nextState.playerState, this.state.playerState);
  }

  private setPlayerState = (playerState: DeepImmutableObject<SelfPlayerState>) => {
    setPlayerState(playerState);
    this.setState({ playerState });
  }

  private handleContextMenu = (event: MouseEvent) => {
    event.preventDefault();
    showSelfContextMenu(this.state.playerState, event);
  }
}

export default PlayerHealth;
