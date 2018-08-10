/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { Vec2f, Vec3f } from '@csegames/camelot-unchained';
import { CompassContextConsumer } from './CompassContext';

export interface CompassElevationSwitchProps {
  target: Vec3f | Vec2f;
  bufferZone?: number;
  children: (isLevel: boolean, isAbove: boolean, isBelow: boolean) => any;
}

export interface CompassElevationSwitchState {}

class CompassElevationSwitch extends React.PureComponent<CompassElevationSwitchProps, CompassElevationSwitchState> {

  public static defaultProps: Partial<CompassElevationSwitchProps> = {
    bufferZone: 0,
  };

  public render() {
    return (
      <CompassContextConsumer>
        {compass => (
          <>
            {this.props.children(
              compass.isTargetLevel(this.props.target, this.props.bufferZone),
              compass.isTargetAbove(this.props.target, this.props.bufferZone),
              compass.isTargetBelow(this.props.target, this.props.bufferZone),
            )}
          </>
        )}
      </CompassContextConsumer>
    );
  }
}

export default CompassElevationSwitch;
