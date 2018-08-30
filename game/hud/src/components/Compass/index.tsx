/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import CompassPOIManager, { CompassContext } from './CompassPOIManager';
import CardinalDirectionsPoiProvider from './POI/CardinalDirectionsPoiProvider';
import WarbandMembersPoiProvider from './POI/WarbandMembersPoiProvider';
import FriendlyTargetPoiProvider from './POI/FriendlyTargetPoiProvider';
import MapPoiProvider from './POI/MapPoiProvider';

export interface CompassProps {}

export interface CompassState {}

const CompassContainer = styled('div')`
  font-family: TitilliumBold;
  position: absolute;
  height: 100%;
  width: 100%;
  overflow: hidden;
  pointer-events: none;
  user-select: none;
`;

const CompassTrack = styled('div')`
  position: relative;
  top: 0px;
  height: 38px;
  border: 1px solid rgba(255,255,255,0.3);
  border-radius: 2px;
  /* background: rgba(0,0,0,0.1); */
  box-sizing: border-box !important;
  pointer-events: none;
  user-select: none;
  &:before, &:after {
    left: 50%;
    border: solid transparent;
    content: " ";
    height: 0;
    width: 0;
    position: absolute;
    pointer-events: none;
    user-select: none;
  }
  &:before {
    border-color: rgba(194, 225, 245, 0);
    border-top-color: rgba(255,255,255,0.3);
    border-width: 2px;
	  margin-left: -2px;
  }
  &:after {
    border-color: rgba(136, 183, 213, 0);
    border-top-color: rgba(255,255,255,0.3);
    border-width: 3px;
	  margin-left: -3px;
  }
`;

class Compass extends React.PureComponent<CompassProps, CompassState> {
  public name: string = 'Compass';

  public render() {
    return (
      <CompassPOIManager degreesToShow={135}>
        {(compass: CompassContext) => {
          return (
            <CompassContainer>
              <CompassTrack>
                <CardinalDirectionsPoiProvider
                  compass={compass}
                  pois={compass.convertToArray('cardinal', compass.poiList)}
                />
                <MapPoiProvider
                  compass={compass}
                  pois={compass.convertToArray('map', compass.poiList)}
                />
                <WarbandMembersPoiProvider
                  compass={compass}
                  pois={compass.convertToArray('warband', compass.poiList)}
                />
                <FriendlyTargetPoiProvider
                  compass={compass}
                  pois={compass.convertToArray('friendly', compass.poiList)}
                />
              </CompassTrack>
            </CompassContainer>
          );
        }}
      </CompassPOIManager>
    );
  }
}

export default Compass;
