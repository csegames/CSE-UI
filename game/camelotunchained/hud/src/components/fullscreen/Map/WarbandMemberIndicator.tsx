/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { getViewportSize } from 'hudlib/viewport';

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
`;

const Circle = styled.div`
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: white;
`;

const DeadX = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  font-size: 14px;
  color: red;
`;

export interface Props {
  memberState: GroupMemberState;
}

export class WarbandMemberIndicator extends React.Component<Props> {
  public render() {
    return (
      <Container style={this.getPosition()}>
        <Circle />
        {!this.props.memberState.isAlive && <DeadX className='icon-close' />}
      </Container>
    );
  }

  private getPosition = () => {
    const scale = game.map.scale || 0.1;
    const viewportSize = getViewportSize();
    const heightScale = viewportSize.height / 1217;
    const widthScale = viewportSize.width / 1367;
    return {
      marginTop: (-1 * this.props.memberState.position.y * scale + game.map.positionOffset.y) * heightScale,
      marginLeft: (this.props.memberState.position.x * scale + game.map.positionOffset.x) * widthScale,
    }
  }
}
