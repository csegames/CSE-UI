/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Vec2f, Vec3f } from '@csegames/camelot-unchained';
import {
  getCompassData,
  CompassData,
  calculateBearing,
  calculateDistance,
  convertToMinusAngle,
  calculateElevation,
} from 'actions/compass';

export interface CompassContext extends CompassData {
  getBearing: (target: Vec2f | Vec3f) => number;
  getDistance: (target: Vec2f | Vec3f) => number;
  getElevation: (target: Vec2f | Vec3f) => number;
  isTargetAbove: (target: Vec2f | Vec3f, byAtLeast?: number) => boolean;
  isTargetBelow: (target: Vec2f | Vec3f, byAtLeast?: number) => boolean;
  isTargetLevel: (target: Vec2f | Vec3f, buffer?: number) => boolean;
  getPoiPlacement: (angleOrLocation: number | Vec2f | Vec3f) => number;
  getPoiPlacementStyle: (angleOrLocation: number | Vec2f | Vec3f, offset?: number) => React.CSSProperties;
}

const { Provider, Consumer } = React.createContext<CompassContext>({} as CompassContext);

export interface CompassContextProviderProps {
  degreesToShow: number;
}

export interface CompassContextProviderState extends CompassData {}

export class CompassContextProvider extends React.Component<CompassContextProviderProps, CompassContextProviderState> {
  private updateSpeed: number = 25;
  private intervalId: NodeJS.Timer;

  public state = {
    facing: 0,
    facingNorth: 0,
    position: {
      x: 0,
      y: 0,
      z: 0,
    },
  };

  public render() {
    return (
      <Provider
        value={{
          facing: this.state.facing,
          facingNorth: this.state.facingNorth,
          position: this.state.position,
          getBearing: this.getBearing,
          getDistance: this.getDistance,
          getElevation: this.getElevation,
          isTargetAbove: this.isTargetAbove,
          isTargetBelow: this.isTargetBelow,
          isTargetLevel: this.isTargetLevel,
          getPoiPlacement: this.getPoiPlacement,
          getPoiPlacementStyle: this.getPoiPlacementStyle,
        }}
      >
        {this.props.children}
      </Provider>
    );
  }

  public componentWillMount() {
    this.updateCompassData();
  }

  public componentDidMount() {
    this.updateCompassData();
    clearInterval(this.intervalId);
    this.intervalId = setInterval(() => this.updateCompassData(), this.updateSpeed);
  }

  public componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  public shouldComponentUpdate(nextProps: CompassContextProviderProps, nextState: CompassContextProviderState) {
    if (this.state.facing !== nextState.facing) {
      return true;
    }
    if (this.state.facingNorth !== nextState.facingNorth) {
      return true;
    }
    if (
      nextState.position.x !== this.state.position.x ||
      nextState.position.y !== this.state.position.y ||
      nextState.position.z !== this.state.position.z
    ) {
      return true;
    }
    return false;
  }

  private updateCompassData = () => {
    this.setState(getCompassData());
  }

  private getBearing = (target: Vec2f | Vec3f) => {
    return calculateBearing(this.state.position, target);
  }

  private getDistance = (target: Vec2f | Vec3f) => {
    return calculateDistance(this.state.position, target);
  }

  private getElevation = (target: Vec2f | Vec3f) => {
    return calculateElevation(this.state.position, target);
  }

  private isTargetAbove = (target: Vec2f | Vec3f, byAtLeast: number = 0) => {
    return (this.getElevation(target) - byAtLeast) > 0;
  }

  private isTargetBelow = (target: Vec2f | Vec3f, byAtLeast: number = 0) => {
    return (this.getElevation(target) + byAtLeast)  < 0;
  }

  private isTargetLevel = (target: Vec2f | Vec3f, buffer: number = 0) => {
    return this.getElevation(target) <= buffer &&  this.getElevation(target) >= (0 - buffer);
  }

  private getPoiPlacement = (angleOrPosition: number | Vec3f | Vec2f): number => {
    let angle;
    if (typeof angleOrPosition === 'number') {
      angle = angleOrPosition;
    } else {
      angle = this.getBearing(angleOrPosition);
    }
    angle = angle % 360;
    const facingAdjustment = 360 - this.state.facingNorth;
    const percentPerDegree = 100 / this.props.degreesToShow;
    const adjustedAngle = convertToMinusAngle((angle + facingAdjustment) % 360);
    const leftPosition = (adjustedAngle * percentPerDegree) + 50;
    return leftPosition;
  }

  private getPoiPlacementStyle = (angleOrPosition: number | Vec3f | Vec2f, offset: number = 0): React.CSSProperties => {
    const leftPosition = this.getPoiPlacement(angleOrPosition);
    return {
      left: `calc(${leftPosition}% - ${offset}px)`,
    };
  }
}

export const CompassContextConsumer = Consumer;
