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
import { showSelfContextMenu } from 'actions/contextMenu';
import { setPlayerState } from 'actions/player';
import { WarbandContext, WarbandContextState } from 'components/context/WarbandContext';

const PlayerHealthContainer = styled.div`
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
  playerState: ImmutableSelfPlayerState;
}

class PlayerHealthWithInjectedContext extends React.Component<PlayerHealthProps & InjectedProps, PlayerHealthState> {
  private playerUpdateHandle: EventHandle;
  constructor(props: PlayerHealthProps & InjectedProps) {
    super(props);
    this.state = {
      playerState: cloneDeep(camelotunchained.game.selfPlayerState),
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
    this.playerUpdateHandle = camelotunchained.game.selfPlayerState.onUpdated(() => {
      this.setPlayerState(cloneDeep(camelotunchained.game.selfPlayerState));
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

  private handleContextMenu = (event: React.MouseEvent) => {
    if (event.button === 2) {
      showSelfContextMenu(this.state.playerState, this.props.warbandContext, event);
    }
  }
}

export function PlayerHealth(props: PlayerHealthProps) {
  const warbandContext = useContext(WarbandContext);
  return (
    <PlayerHealthWithInjectedContext {...props} warbandContext={warbandContext} />
  );
}
