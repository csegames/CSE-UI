/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';
import { utils } from '@csegames/camelot-unchained';
import { PlayerState } from 'components/HealthBar';

const Container = styled('div')`
  position: absolute;
  left: 198px;
  bottom: -29px;
  z-index: -1;
  font-size: 24px;
  color: white;
  background-color: rgba(0,0,0,0.6);
  width: 100px;
  text-align: center;
`;

export interface DistanceTextProps {
  targetType: 'enemy' | 'friendly';
}

export interface DistanceTextState {
  myPosition: Vec3f;
  theirPosition: Vec3f;
}

class DistanceText extends React.Component<DistanceTextProps, DistanceTextState> {
  private mounted: boolean;
  private eventHandles: EventHandle[] = [];
  constructor(props: DistanceTextProps) {
    super(props);
    this.state = {
      myPosition: { x: 0, y: 0, z: 0 },
      theirPosition: { x: 0, y: 0, z: 0 },
    };
    this.setTheirPosition = _.throttle(this.setTheirPosition, 500);
    this.setMyPosition = _.throttle(this.setMyPosition, 500);
  }

  public render() {
    const distance = Number(utils.distanceVec3(this.state.myPosition, this.state.theirPosition).toFixed(2));
    return (
      <Container>{distance}</Container>
    );
  }

  public componentDidMount() {
    this.mounted = true;
    this.init();
  }

  public shouldComponentUpdate(nextProps: DistanceTextProps, nextState: DistanceTextState) {
    return !this.positionCloseEnough(this.state.myPosition, nextState.myPosition) ||
      !this.positionCloseEnough(this.state.theirPosition, nextState.theirPosition);
  }

  public componentWillUnmount() {
    this.mounted = false;
    this.eventHandles.forEach(eventHandle => eventHandle.clear());
  }

  private init = () => {
    this.eventHandles.push(game.selfPlayerState.onUpdated(
      () => this.setMyPosition(game.selfPlayerState),
    ));
    switch (this.props.targetType) {
      case 'enemy': {
        this.eventHandles.push(game.enemyTargetState.onUpdated(
          () => this.setTheirPosition(game.enemyTargetState),
        ));
        break;
      }
      case 'friendly': {
        this.eventHandles.push(game.friendlyTargetState.onUpdated(
          () => this.setTheirPosition(game.friendlyTargetState),
        ));
        break;
      }
    }
  }

  private setTheirPosition = (playerState: PlayerState) => {
    if (this.mounted && playerState) {
      const { position } = playerState;
      if (position && position.x && position.y && position.z) {
        this.setState({ theirPosition: position });
      }
    }
  }

  private setMyPosition = (playerState: PlayerState) => {
    if (this.mounted && playerState) {
      const { position } = playerState;
      if (position && position.x && position.y && position.z) {
        this.setState({ myPosition: position });
      }
    }
  }

  private positionCloseEnough(positionOne: Vec3f, positionTwo: Vec3f) {
    return utils.numEqualsCloseEnough(positionOne.x, positionTwo.x, 1) &&
    utils.numEqualsCloseEnough(positionOne.y, positionTwo.y, 1) &&
    utils.numEqualsCloseEnough(positionOne.z, positionTwo.z, 1);
  }
}

export default DistanceText;
