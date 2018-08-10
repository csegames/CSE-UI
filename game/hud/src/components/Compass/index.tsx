/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';
import { CompassContextProvider } from './CompassContext';
import CardinalDirections from './POI/CardinalDirections';
import WarbandMembers from './POI/WarbandMembers';

export interface CompassProps {}

export interface CompassState {}

function compassContainerLineStyle(r: number, g: number, b: number) {
  return css`
    display: block;
    width: 100%;
    height: 2px;
    line-height: 1px;
    position: absolute;
    content: linear-gradient(to right,
      rgba(${r}, ${g}, ${b}, 0) 0%,
      rgba(${r}, ${g}, ${b},.5) 50%,
      rgba(${r}, ${g}, ${b}, 0) 100%);
  `;
}

const CompassContainer = styled('div')`
  font-family: TitilliumBold;
  position: absolute;
  height: 100%;
  width: 100%;
  overflow: hidden;
  &:before {
    top: 2px;
    ${compassContainerLineStyle(0, 0, 0)}
  }
  &:after {
    bottom: 0px;
    ${compassContainerLineStyle(200, 200, 200)}
  }
`;

const CompassTrack = styled('div')`
  position: relative;
  height: 38px;
  line-height: 30px;
  &:before {
    top: 0px;
    ${compassContainerLineStyle(200, 200, 200)}
  }
  &:after {
    bottom: 2px;
    ${compassContainerLineStyle(0, 0, 0)}
  }
`;

class Compass extends React.PureComponent<CompassProps, CompassState> {
  public name: string = 'Compass';

  public render() {
    return (
      <CompassContextProvider degreesToShow={90}>
        <CompassContainer>
          <CompassTrack>
            <CardinalDirections />
            <WarbandMembers />
          </CompassTrack>
        </CompassContainer>
      </CompassContextProvider>
    );
  }
}

export default Compass;
