/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
// import { throttle } from 'lodash';
import { styled } from '@csegames/linaria/react';
import { PlayerTracker } from './PlayerTracker';

const PlayerTrackersContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: -1;
`;

export interface Props {
}

export interface State {
  playerDirections: PlayerDirection[];
}

export class PlayerTrackers extends React.Component<Props, State> {
  private evh: EventHandle;
  constructor(props: Props) {
    super(props);
    this.state = {
      playerDirections: [],
    };

    // this.handlePlayerDirectionUpdate = throttle(this.handlePlayerDirectionUpdate, 50);
  }

  public render() {
    return (
      <PlayerTrackersContainer>
        {Object.values(this.state.playerDirections).map((pt, i) => (
          <PlayerTracker
            key={i}
            index={i}
            degrees={pt.angle}
            screenPos={pt.screenPos}
            scale={pt.scale}
          />
        ))}
      </PlayerTrackersContainer>
    );
  }

  public componentDidMount() {
    this.evh = hordetest.game.onPlayerDirectionUpdate(this.handlePlayerDirectionUpdate);
  }

  public componentWillUnmount() {
    this.evh.clear();
  }

  private handlePlayerDirectionUpdate = (playerDirections: PlayerDirection[]) => {
    if (!playerDirections) {
      console.error(`Player directions are coming in with a falsy value from the client.
        Default should be an empty array. VALUE: ${playerDirections}`);

      this.setState({ playerDirections: [] });
      return;
    }

    this.setState({ playerDirections: playerDirections.slice(0, 9) });
  }
}
