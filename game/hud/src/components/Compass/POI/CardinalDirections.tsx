/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';
import { CompassContextConsumer, CompassContext } from '../CompassContext';

const cardinalStyle = css`
  position: absolute;
  margin: 0;
  padding: 0;
  margin-top: 6px;
  color: rgba(255,255,255, .6);
  text-shadow: 2px 2px 4px black;
  font-size: 2em;
  width: 40px;
  text-align: center;
  font-weight: bold;
`;

const Cardinal = styled('div')`
  ${cardinalStyle}
`;

const CardinalDot = styled('div')`
  ${cardinalStyle}
  top: -0.25em;
`;


export default class CardinalDirections extends React.PureComponent<{}, {}> {
  public render() {
    return (
      <CompassContextConsumer>
        {(compass: CompassContext) => (
          <>
            <Cardinal style={compass.getPoiPlacementStyle(0, 20)}>N</Cardinal>
            <CardinalDot style={compass.getPoiPlacementStyle(45, 20)}>.</CardinalDot>
            <Cardinal style={compass.getPoiPlacementStyle(90, 20)}>E</Cardinal>
            <CardinalDot style={compass.getPoiPlacementStyle(135, 20)}>.</CardinalDot>
            <Cardinal style={compass.getPoiPlacementStyle(180, 20)}>S</Cardinal>
            <CardinalDot style={compass.getPoiPlacementStyle(225, 20)}>.</CardinalDot>
            <Cardinal style={compass.getPoiPlacementStyle(270, 20)}>W</Cardinal>
            <CardinalDot style={compass.getPoiPlacementStyle(315, 20)}>.</CardinalDot>
          </>
        )}
      </CompassContextConsumer>
    );
  }
}
