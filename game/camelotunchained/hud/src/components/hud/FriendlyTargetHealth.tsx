/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import * as _ from 'lodash';
import { styled } from '@csegames/linaria/react';

import { isEqualPlayerState } from '../../lib/playerStateEqual';
import { UnitFrame } from './UnitFrame';
import { showFriendlyTargetContextMenu } from 'actions/contextMenu';
import { WarbandContext, WarbandContextState } from 'components/context/WarbandContext';

const Container = styled.div`
  pointer-events: auto;
  width: 100%;
  height: 100%;
`;

interface InjectedProps {
  warbandContext: WarbandContextState;
}

export interface PlayerHealthProps {

}

export interface PlayerHealthState {
  playerState: Player;
  showContextMenu: boolean;
}

class PlayerHealthWithInjectedContext extends React.Component<PlayerHealthProps & InjectedProps, PlayerHealthState> {
  private eventHandles: EventHandle[] = [];
  constructor(props: PlayerHealthProps & InjectedProps) {
    super(props);
    this.state = {
      playerState: null,
      showContextMenu: false,
    };
    this.setPlayerState = _.throttle(this.setPlayerState, 100);
  }

  public render() {
    if (!this.state.playerState || !this.state.playerState.entityID) return null;

    return (
      <Container onMouseDown={this.handleContextMenu}>
        <UnitFrame entityState={this.state.playerState as any} target='friendly' />
      </Container>
    );
  }

  public componentDidMount() {
    this.eventHandles.push(camelotunchained.game.friendlyTargetState.onUpdated(() => {
      this.setPlayerState(cloneDeep(camelotunchained.game.friendlyTargetState as Player));
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

  private handleContextMenu = (event: React.MouseEvent) => {
    if (event.button === 2) {
      // Right mouse
      showFriendlyTargetContextMenu(this.state.playerState, this.props.warbandContext, event);
    }
  }
}

export function FriendlyTargetHealth(props: PlayerHealthProps) {
  const warbandContext = useContext(WarbandContext);
  return (
    <PlayerHealthWithInjectedContext {...props} warbandContext={warbandContext} />
  );
}
