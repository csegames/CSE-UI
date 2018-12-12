/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';

import { isEqualPlayerState } from '../lib/playerStateEqual';
import { UnitFrame } from './UnitFrame';
import { showSelfContextMenu } from 'actions/contextMenu';
import { setPlayerState } from 'actions/player';

const PlayerHealthContainer = styled('div')`
  pointer-events: auto;
  width: 100%;
  height: 100%;
`;

export interface PlayerHealthProps {
}

export interface PlayerHealthState {
  playerState: ImmutableSelfPlayerState;
}

class PlayerHealth extends React.Component<PlayerHealthProps, PlayerHealthState> {
  private playerUpdateHandle: EventHandle;
  constructor(props: PlayerHealthProps) {
    super(props);
    this.state = {
      playerState: cloneDeep(game.selfPlayerState),
    };
    this.setPlayerState = _.throttle(this.setPlayerState, 100);
  }

  public render() {
    if (!this.state.playerState ||
      this.state.playerState.type !== 'player' ||
      this.state.playerState.name === '_offline_') {
      return null;
    }
    return (
      <PlayerHealthContainer onMouseDown={this.handleContextMenu}>
        <UnitFrame entityState={this.state.playerState} />
      </PlayerHealthContainer>
    );
  }

  public componentDidMount() {
    this.playerUpdateHandle = game.selfPlayerState.onUpdated(() => {
      this.setPlayerState(cloneDeep(game.selfPlayerState));
    });
  }

  public componentWillUnmount() {
    this.playerUpdateHandle.clear();
  }

  public shouldComponentUpdate(nextProps: PlayerHealthProps, nextState: PlayerHealthState) {
    return !isEqualPlayerState(nextState.playerState, this.state.playerState);
  }

  private setPlayerState = (playerState: ImmutableSelfPlayerState) => {
    setPlayerState(playerState);
    this.setState({ playerState });
  }

  private handleContextMenu = (event: MouseEvent) => {
    if (event.button === 2) {
      showSelfContextMenu(this.state.playerState, event);
    }
  }
}

export default PlayerHealth;
