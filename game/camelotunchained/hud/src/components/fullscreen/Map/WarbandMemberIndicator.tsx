/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { Tooltip } from 'shared/Tooltip';
import { GroupMemberState } from 'gql/interfaces';

const Container = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  cursor: pointer;
`;

const Circle = styled.div`
  position: relative;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: white;
  box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.5);
`;

const DeadX = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 14px;
  color: red;
`;

export interface Props {
  memberState: GroupMemberState;
}

export class WarbandMemberIndicator extends React.Component<Props> {
  public render() {
    return (
      <Tooltip content={this.props.memberState.name}>
        <Container style={this.getPosition()}>
          <Circle />
          {!this.props.memberState.isAlive && <DeadX className='icon-close' />}
        </Container>
      </Tooltip>
    );
  }

  private getPosition = () => {
    const scale = game.map.scale || 0.085;
    return {
      marginTop: (-1 * this.props.memberState.position.y * scale + game.map.positionOffset.y),
      marginLeft: (this.props.memberState.position.x * scale + game.map.positionOffset.x),
    }
  }
}
