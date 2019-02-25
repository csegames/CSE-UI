/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { styled } from 'linaria/react';
import { utils } from '@csegames/camelot-unchained';

const Container = styled.div`
  position: absolute;
  left: 200px;
  bottom: -41px;
  z-index: -1;
  font-size: 24px;
  @media(max-width: 1920px) {
    font-size: 14px;
    left: 70px;
    bottom: -29px;
  }
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
      !Vec3f.equals(this.myPositionCache, nextState.myPosition) ||
      !Vec3f.equals(this.theirPositionCache, nextState.theirPosition);
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
    this.eventHandles.push(game.selfPlayerState.onUpdated(
      () => this.setMyPosition(game.selfPlayerState),
    ));
    switch (this.props.targetType) {
      case 'enemy': {
        this.eventHandles.push(game.enemyTargetState.onUpdated(
          () => this.setTheirPosition(game.enemyTargetState as Player),
        ));
        break;
      }
      case 'friendly': {
        this.eventHandles.push(game.friendlyTargetState.onUpdated(
          () => this.setTheirPosition(game.friendlyTargetState as Player),
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
