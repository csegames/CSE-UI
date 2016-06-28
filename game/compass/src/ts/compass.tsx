/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import {client, restAPI} from 'camelot-unchained';
import {Promise} from 'es6-promise';
import * as React from 'react';
import vec2 from './vec2'

export interface CompassState {
  facing: number;
}

export interface CompassProps { }

class Compass extends React.Component<CompassProps, CompassState> {

  private updateSpeed: number = 100;
  private intervalId: NodeJS.Timer; //id returned by the setInterval method

  constructor(props: CompassProps) {
    super(props);
  }

  angleToPercentage = (facing: number, angle: number): number => {
    let diff: number = angle - facing;
    const fit = 0.75;
    const half = 50;
    if (angle >= facing) {
      return half - diff * fit;
    } else {
      const d2: number = facing - 360 - angle;
      diff = facing - angle;
      return Math.abs(d2) < diff ? half + d2 * fit : half + diff * fit;
    }
  }

  updateFacingFromClient() {
    const facing: number = client.facing;
    if (this.state.facing != facing) {
      this.setState({ facing: facing });
    };
  }

  componentWillMount() {
    this.setState({ facing: 0 });
  }

  componentDidMount() {
    this.updateFacingFromClient();

    //clear the interval one has already been set
    clearInterval(this.intervalId);
    this.intervalId = setInterval(() => this.updateFacingFromClient(), this.updateSpeed);
  }
  
  componentWillUnmount() {
    clearInterval(this.intervalId);
  }

  position(facing: number, angle: number) {
    return { left: this.angleToPercentage(facing, angle) + '%' };
  }

  render() {
    let facing: number = this.state.facing;

    return (
      <div className="compass">
        <div className="cardinal-direction">
          <h1 className="cardinal" style={this.position(facing, 0) }>E</h1>
          <h1 className="cardinal dot" style={this.position(facing, 45) }>.</h1>
          <h1 className="cardinal" style={this.position(facing, 90) }>N</h1>
          <h1 className="cardinal dot" style={this.position(facing, 135) }>.</h1>
          <h1 className="cardinal" style={this.position(facing, 180) }>W</h1>
          <h1 className="cardinal dot" style={this.position(facing, 225) }>.</h1>
          <h1 className="cardinal" style={this.position(facing, 270) }>S</h1>
          <h1 className="cardinal dot" style={this.position(facing, 315) }>.</h1>
        </div>
      </div>
    );
  }
}

export default Compass
