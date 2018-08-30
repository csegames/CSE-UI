/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';
import {
  CompassPOIProviderProps,
  CompassPOIPartial,
  withCompassPOIPartialDefaults,
} from 'components/Compass/CompassPOIManager';

const cardinalStyle = css`
  position: absolute;
  margin: 0;
  padding: 0;
  color: rgba(255,255,255, .8);
  text-shadow: 2px 2px 4px black;
  font-size: 2em;
  width: 40px;
  text-align: center;
  font-weight: bold;
  transition: left linear .1s;
  pointer-events: none;
  user-select: none;
`;

const Cardinal = styled('div')`
  ${cardinalStyle}
`;

const CardinalDot = styled('div')`
  ${cardinalStyle}
  top: -0.25em;
`;

interface CardinalPOIData {
  title: string;
  isDot: boolean;
}

export default class CardinalDirectionsPoiProvider extends React.Component<CompassPOIProviderProps<CardinalPOIData>, {}> {
  public render() {
    return (
      <>
        {this.props.pois.map((poi) => {
          if (poi.data.isDot) {
            return <CardinalDot key={poi.id} style={poi.placementStyle}>{poi.data.title}</CardinalDot>;
          } else {
            return <Cardinal key={poi.id} style={poi.placementStyle}>{poi.data.title}</Cardinal>;
          }
        })}
      </>
    );
  }

  public shouldComponentUpdate(nextProps: CompassPOIProviderProps<CardinalPOIData>, nextState: {}) {
    if (nextProps.compass.renderTimestamp !== this.props.compass.renderTimestamp) {
      return true;
    }
    return false;
  }

  public componentDidMount() {
    this.props.compass.addPOI('cardinal', [
      this.createCardinalPOI(0, 'N', false),
      this.createCardinalPOI(45, '.', true),
      this.createCardinalPOI(90, 'E', false),
      this.createCardinalPOI(135, '.', true),
      this.createCardinalPOI(180, 'S', false),
      this.createCardinalPOI(225, '.', true),
      this.createCardinalPOI(270, 'W', false),
      this.createCardinalPOI(315, '.', true),
    ]);
  }

  private createCardinalPOI(degrees: number, title: string, isDot: boolean): CompassPOIPartial<CardinalPOIData> {
    return withCompassPOIPartialDefaults({
      id: `cardinal-${degrees}`,
      type: 'cardinal',
      data: {
        title,
        isDot,
      },
      offset: 20,
      degrees,
    });
  }
}
