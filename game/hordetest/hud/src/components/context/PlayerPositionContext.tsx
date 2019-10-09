/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';

export interface PlayerPositionContextState {
  playerPosition: Vec3f;
}

const getDefaultPlayerPositionContextState = (): PlayerPositionContextState => ({
  playerPosition: { x: 0, y:  0, z: 0 },
});

export const PlayerPositionContext = React.createContext(getDefaultPlayerPositionContextState());

export class PlayerPositionContextProvider extends React.Component<{}, PlayerPositionContextState> {
  private eventHandle: EventHandle;
  constructor(props: {}) {
    super(props);

    this.state = getDefaultPlayerPositionContextState();
  }

  public render() {
    return (
      <PlayerPositionContext.Provider value={this.state}>
        {this.props.children}
      </PlayerPositionContext.Provider>
    );
  }

  public componentDidMount() {
    this.eventHandle = hordetest.game.selfPlayerState.onUpdated(this.handleSelfPlayerStateUpdate);
  }

  public componentWillUnmount() {
    this.eventHandle.clear();
  }

  private handleSelfPlayerStateUpdate = () => {
    if (!this.state.playerPosition.x.floatEquals(hordetest.game.selfPlayerState.position.x) ||
        !this.state.playerPosition.y.floatEquals(hordetest.game.selfPlayerState.position.y) ||
        !this.state.playerPosition.z.floatEquals(hordetest.game.selfPlayerState.position.z)) {
      this.setState({ playerPosition: hordetest.game.selfPlayerState.position });
    }
  }
}
