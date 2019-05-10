/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { styled } from '@csegames/linaria/react';
import { utils } from '@csegames/library/lib/_baseGame';
import { HD_SCALE } from 'fullscreen/lib/constants';

// #region Container constants
const CONTAINER_LEFT = 140;
const CONTAINER_BOTTOM = -30;
const CONTAINER_FONT_SIZE = 28;
const CONTAINER_WIDTH = 200;
// #endregion
const Container = styled.div`
  position: absolute;
  left: ${CONTAINER_LEFT}px;
  bottom: ${CONTAINER_BOTTOM}px;
  font-size: ${CONTAINER_FONT_SIZE}px;
  width: ${CONTAINER_WIDTH}px;
  color: white;
  background-color: rgba(0,0,0,0.6);
  text-align: center;
  z-index: -1;

  @media (max-width: 1920px) {
    left: ${CONTAINER_LEFT * HD_SCALE}px;
    bottom: ${CONTAINER_BOTTOM * HD_SCALE}px;
    font-size: ${CONTAINER_FONT_SIZE * HD_SCALE}px;
    width: ${CONTAINER_WIDTH * HD_SCALE}px;
  }
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
  private myPositionCache: Vec3f;
  private theirPositionCache: Vec3f;
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
    return !this.myPositionCache || !this.theirPositionCache ||
      !Vec3fExt.equals(this.myPositionCache, nextState.myPosition) ||
      !Vec3fExt.equals(this.theirPositionCache, nextState.theirPosition);
  }

  public componentDidUpdate() {
    this.myPositionCache = this.state.myPosition;
    this.theirPositionCache = this.state.theirPosition;
  }

  public componentWillUnmount() {
    this.mounted = false;
    this.eventHandles.forEach(eventHandle => eventHandle.clear());
  }

  private init = () => {
    this.eventHandles.push(camelotunchained.game.selfPlayerState.onUpdated(
      () => this.setMyPosition(camelotunchained.game.selfPlayerState),
    ));
    switch (this.props.targetType) {
      case 'enemy': {
        this.eventHandles.push(camelotunchained.game.enemyTargetState.onUpdated(
          () => this.setTheirPosition(camelotunchained.game.enemyTargetState as Player),
        ));
        break;
      }
      case 'friendly': {
        this.eventHandles.push(camelotunchained.game.friendlyTargetState.onUpdated(
          () => this.setTheirPosition(camelotunchained.game.friendlyTargetState as Player),
        ));
        break;
      }
    }
  }

  private setTheirPosition = (playerState: Player) => {
    if (this.mounted && playerState) {
      const { position } = playerState;
      if (position && position.x && position.y && position.z) {
        this.setState({ theirPosition: position });
      }
    }
  }

  private setMyPosition = (playerState: Player) => {
    if (this.mounted && playerState) {
      const { position } = playerState;
      if (position && position.x && position.y && position.z) {
        this.setState({ myPosition: position });
      }
    }
  }
}

export default DistanceText;
