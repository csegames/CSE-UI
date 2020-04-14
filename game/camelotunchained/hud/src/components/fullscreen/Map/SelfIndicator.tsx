/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { getCompassFacingData } from 'actions/compass';

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
`;

const Indicator = styled.div`
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 0 5px 15px 5px;
  border-color: transparent transparent #ffffff transparent;
`;

export interface Props {

}

export interface State {
  playerState: SelfPlayerStateModel;
}

export class SelfIndicator extends React.Component<Props, State> {
  private evh: EventHandle;
  constructor(props: Props) {
    super(props);
    this.state = {
      playerState: cloneDeep(camelotunchained.game.selfPlayerState),
    };
  }

  public render() {
    const compassFacingData = getCompassFacingData(this.state.playerState.facing.yaw);
    return (
      <Container style={this.getPosition()}>
        <Indicator style={{ transform: `rotate(${compassFacingData.facingNorth}deg)` }} />
      </Container>
    );
  }

  public componentDidMount() {
    this.evh = camelotunchained.game.selfPlayerState.onUpdated(this.handlePlayerStateUpdate);
  }

  public componentWillUnmount() {
    if (this.evh) {
      this.evh.clear();
    }
  }

  private handlePlayerStateUpdate = () => {
    this.setState({ playerState: cloneDeep(camelotunchained.game.selfPlayerState) });
  }

  private getPosition = () => {
    const scale = game.map.scale || 0.1;
    return {
      marginTop: -1 * this.state.playerState.position.y * scale + game.map.positionOffset.y,
      marginLeft: this.state.playerState.position.x * scale + game.map.positionOffset.x,
    }
  }
}
