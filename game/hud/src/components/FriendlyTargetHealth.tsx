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
import { showFriendlyTargetContextMenu } from 'actions/contextMenu';

const Container = styled('div')`
  pointer-events: auto;
  width: 100%;
  height: 100%;
`;

export interface PlayerHealthProps {
}

export interface PlayerHealthState {
  playerState: Player;
  showContextMenu: boolean;
}

class PlayerHealth extends React.Component<PlayerHealthProps, PlayerHealthState> {
  private eventHandles: EventHandle[] = [];
  constructor(props: PlayerHealthProps) {
    super(props);
    this.state = {
      playerState: null,
      showContextMenu: false,
    };
    this.setPlayerState = _.throttle(this.setPlayerState, 100);
  }

  public render() {
    if (!this.state.playerState ||
      this.state.playerState.type !== 'player' ||
      !this.state.playerState.entityID) return null;

    return (
      <Container onMouseDown={this.handleContextMenu}>
        <UnitFrame entityState={this.state.playerState as any} target='friendly' />
      </Container>
    );
  }

  public componentDidMount() {
    this.eventHandles.push(game.friendlyTargetState.onUpdated(() => {
      this.setPlayerState(cloneDeep(game.friendlyTargetState as Player));
    }));
  }

  public componentWillUnmount() {
    this.eventHandles.forEach(eventHandle => eventHandle.clear());
  }

  public shouldComponentUpdate(nextProps: PlayerHealthProps, nextState: PlayerHealthState) {
    return !isEqualPlayerState(nextState.playerState, this.state.playerState) ||
      nextState.showContextMenu !== this.state.showContextMenu;
  }

  private setPlayerState = (playerState: Player) => {
    this.setState({ playerState });
  }

  private handleContextMenu = (event: MouseEvent) => {
    if (event.button === 2) {
      // Right mouse
      showFriendlyTargetContextMenu(this.state.playerState, event);
    }
  }
}

export default PlayerHealth;
