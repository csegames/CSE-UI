/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  font-family: TitilliumBold;
  position: relative;
  height: 100%;
  width: 100%;
  overflow: hidden;

  &:before {
    display: block;
    width: 100%;
    height: 2px;
    line-height: 1px;
    position: absolute;
    content: linear-gradient(to right,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, .5) 50%,
      rgba(0, 0, 0, 0) 100%);
    top: 2px;
  }

  &:after {
    display: block;
    width: 100%;
    height: 2px;
    line-height: 1px;
    position: absolute;
    content: linear-gradient(to right,
      rgba(200, 200, 200, 0) 0%,
      rgba(200, 200, 200, .5) 50%,
      rgba(200, 200, 200, 0) 100%);
    bottom: 0px;
  }
`;

const Cardinal = styled.div`
  position: absolute;
  margin: 0;
  padding: 0;
  margin-top: 6px;
  color: rgba(255,255,255, .6);
  text-shadow: 2px 2px 4px black;
`;

const Dot = css`
  margin-left: -0.25em;
  top: -0.25em;
`;

const CardinalDirection = styled.div`
  position: relative;
  height: 38px;
  line-height: 30px;
  font-size: 26px;

  &:before {
    display: block;
    width: 100%;
    height: 2px;
    line-height: 1px;
    position: absolute;
    content: linear-gradient(to right,
      rgba(200, 200, 200, 0) 0%,
      rgba(200, 200, 200, .5) 50%,
      rgba(200, 200, 200, 0) 100%);
    top: 0px;
  }

  &:after {
    display: block;
    width: 100%;
    height: 2px;
    line-height: 1px;
    position: absolute;
    content: linear-gradient(to right,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, .5) 50%,
      rgba(0, 0, 0, 0) 100%);
    bottom: 2px;
  }
`;

export interface CompassProps {
}

export interface CompassState {
  facing: number;
}

export class Compass extends React.Component<CompassProps, CompassState> {
  public name: string = 'Compass';
  private evh: EventHandle;

  constructor(props: CompassProps) {
    super(props);
    this.state = {
      facing: hordetest.game.selfPlayerState.facing.yaw,
    };
  }

  public render() {
    const facing: number = this.state.facing;
    return (
      <Container>
        <CardinalDirection>
          <Cardinal style={this.position(facing, -360) }>E</Cardinal>
          <Cardinal className={Dot} style={this.position(facing, -315) }>.</Cardinal>
          <Cardinal style={this.position(facing, -270) }>N</Cardinal>
          <Cardinal className={Dot} style={this.position(facing, -225) }>.</Cardinal>
          <Cardinal style={this.position(facing, -180) }>W</Cardinal>
          <Cardinal className={Dot} style={this.position(facing, -135) }>.</Cardinal>
          <Cardinal style={this.position(facing, -90) }>S</Cardinal>
          <Cardinal className={Dot} style={this.position(facing, -45) }>.</Cardinal>
          <Cardinal style={this.position(facing, 0) }>E</Cardinal>
          <Cardinal className={Dot} style={this.position(facing, 45) }>.</Cardinal>
          <Cardinal style={this.position(facing, 90) }>N</Cardinal>
          <Cardinal className={Dot} style={this.position(facing, 135) }>.</Cardinal>
          <Cardinal style={this.position(facing, 180) }>W</Cardinal>
          <Cardinal className={Dot} style={this.position(facing, 225) }>.</Cardinal>
          <Cardinal style={this.position(facing, 270) }>S</Cardinal>
          <Cardinal className={Dot} style={this.position(facing, 315) }>.</Cardinal>
        </CardinalDirection>
      </Container>
    );
  }

  public componentDidMount() {
    this.evh = hordetest.game.selfPlayerState.onUpdated(this.handleSelfPlayerUpdate);
  }

  public componentWillUnmount() {
    this.evh.clear();
  }

  private angleToPercentage = (facing: number, angle: number): number => {
    let diff: number = angle - (facing % 360);
    const fit = 0.75;
    const half = 50;
    if (angle >= facing) {
      return half - diff * fit;
    } else {
      const d2: number = (facing % 360) - 360 - angle;
      diff = (facing % 360) - angle;
      return Math.abs(d2) < diff ? half + d2 * fit : half + diff * fit;
    }
  }

  private handleSelfPlayerUpdate = () => {
    this.setState({ facing: hordetest.game.selfPlayerState.facing.yaw });
  }

  private position(facing: number, angle: number) {
    return {left: this.angleToPercentage(facing, angle) + '%'};
  }
}
