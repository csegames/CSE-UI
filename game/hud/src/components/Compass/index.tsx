/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { client } from '@csegames/camelot-unchained';
import * as React from 'react';

export interface CompassProps {
  setVisibility: (vis: boolean) => void;
}

export interface CompassState {
  facing: number;
}

class Compass extends React.Component<CompassProps, CompassState> {
  public name: string = 'Compass';

  private updateSpeed: number = 25; // how often the compass updates
  private intervalId: NodeJS.Timer; // id returned by the setInterval method

  constructor(props: CompassProps) {
    super(props);
    this.state = {
      facing: 0,
    };
  }

  public render() {
    const facing: number = this.state.facing;
    return (
      <div className='Compass'>
        <div className='Compass__Cardinal-direction'>
          <h1 className='Compass__Cardinal' style={this.position(facing, -360) }>E</h1>
          <h1 className='Compass__Cardinal dot' style={this.position(facing, -315) }>.</h1>
          <h1 className='Compass__Cardinal' style={this.position(facing, -270) }>N</h1>
          <h1 className='Compass__Cardinal dot' style={this.position(facing, -225) }>.</h1>
          <h1 className='Compass__Cardinal' style={this.position(facing, -180) }>W</h1>
          <h1 className='Compass__Cardinal dot' style={this.position(facing, -135) }>.</h1>
          <h1 className='Compass__Cardinal' style={this.position(facing, -90) }>S</h1>
          <h1 className='Compass__Cardinal dot' style={this.position(facing, -45) }>.</h1>
          <h1 className='Compass__Cardinal' style={this.position(facing, 0) }>E</h1>
          <h1 className='Compass__Cardinal dot' style={this.position(facing, 45) }>.</h1>
          <h1 className='Compass__Cardinal' style={this.position(facing, 90) }>N</h1>
          <h1 className='Compass__Cardinal dot' style={this.position(facing, 135) }>.</h1>
          <h1 className='Compass__Cardinal' style={this.position(facing, 180) }>W</h1>
          <h1 className='Compass__Cardinal dot' style={this.position(facing, 225) }>.</h1>
          <h1 className='Compass__Cardinal' style={this.position(facing, 270) }>S</h1>
          <h1 className='Compass__Cardinal dot' style={this.position(facing, 315) }>.</h1>
        </div>
      </div>
    );
  }

  public componentWillMount() {
    this.updateFacingFromClient();
  }

  public componentDidMount() {
    this.updateFacingFromClient();
    clearInterval(this.intervalId);
    this.intervalId = setInterval(() => this.updateFacingFromClient(), this.updateSpeed);
  }

  public componentWillUnmount() {
    clearInterval(this.intervalId);
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

  private updateFacingFromClient = () => {
    const facing: number = client.facing;
    if (this.state.facing !== facing) {
      this.setState({ facing } as any);
    }
  }

  private position(facing: number, angle: number) {
    return { left: this.angleToPercentage(facing, angle) + '%' };
  }
}

export default Compass;
