/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { getJobContext } from '../../lib/utils';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region Container constants
const CONTAINER_HEIGHT = 800;
// #endregion
const Container = styled.div`
  position: relative;
  height: ${CONTAINER_HEIGHT}px;
  width: 100%;

  @media (max-width: 2560px) {
    height: ${CONTAINER_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    height: ${CONTAINER_HEIGHT * HD_SCALE}px;
  }
`;

// #region Frame constants
const FRAME_WIDTH = 1250;
const FRAME_HEIGHT = 800;
// #endregion
const Frame = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: ${FRAME_WIDTH}px;
  height: ${FRAME_HEIGHT}px;
  background-image: url(../images/crafting/uhd/status-frame-off.png);
  background-repeat: no-repeat;
  background-position: center 0%;
  background-size: cover;
  -webkit-transition: background 0.2s;
  transition: background 0.2s;
  overflow: hidden;
  &.active {
    background-image: url(../images/crafting/uhd/status-frame.png);
  }

  @media (max-width: 2560px) {
    width: ${FRAME_WIDTH * MID_SCALE}px;
    height: ${FRAME_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${FRAME_WIDTH * HD_SCALE}px;
    height: ${FRAME_HEIGHT * HD_SCALE}px;
    background-image: url(../images/crafting/hd/status-frame-off.png);

    &.active {
      background-image: url(../images/crafting/hd/status-frame.png);
    }
  }
`;

// #region Orb constants
const ORB_DIMENSIONS = 266;
const ORB_TOP = 278;
// #endregion
const Orb = styled.div`
  position: absolute;
  width: ${ORB_DIMENSIONS}px;
  height: ${ORB_DIMENSIONS}px;
  top: ${ORB_TOP}px;
  left: 0;
  right: 0;
  margin: auto;
  cursor: pointer;
  pointer-events: all;
  transition: filter 0.2s ease-in-out;
  background-image: url(../images/crafting/uhd/orb-off.png);
  background-repeat: no-repeat;
  background-size: contain;
  &.active {
    background-image: url(../images/crafting/uhd/orb-on.png);
  }

  @media (max-width: 2560px) {
    width: ${ORB_DIMENSIONS * MID_SCALE}px;
    height: ${ORB_DIMENSIONS * MID_SCALE}px;
    top: ${ORB_TOP * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${ORB_DIMENSIONS * HD_SCALE}px;
    height: ${ORB_DIMENSIONS * HD_SCALE}px;
    top: ${ORB_TOP * HD_SCALE}px;
    background-image: url(../images/crafting/hd/orb-off.png);
    &.active {
      background-image: url(../images/crafting/hd/orb-on.png);
    }
  }

  &:hover {
    filter: brightness(150%);
    -webkit-filter: brightness(150%);
  }
`;

// #region Glow constants
const GLOW_WIDTH = 834;
const GLOW_HEIGHT = 482;
// #endregion
const Glow = styled.div`
  position: absolute;
  background-image: url(../images/crafting/uhd/orb-glow.png);
  background-size: cover;
  width: ${GLOW_WIDTH}px;
  height: ${GLOW_HEIGHT}px;
  left: 0;
  right: 0;
  margin: auto;
  top: 0px;
  opacity: 0;
  transition: opacity 0.3s ease-in-out;
  -webkit-transition: opacity 0.3s ease-in-out;
  pointer-events: none;
  &.active {
    opacity: 1;
  }

  @media (max-width: 2560px) {
    width: ${GLOW_WIDTH * MID_SCALE}px;
    height: ${GLOW_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${GLOW_WIDTH * HD_SCALE}px;
    height: ${GLOW_HEIGHT * HD_SCALE}px;
    background-image: url(../images/crafting/hd/orb-glow.png);
  }
`;

export interface ComponentProps {
  jobNumber: number;
  canStart: boolean;
}

export interface InjectedProps {
  onStartJob: () => void;
}

export type Props = ComponentProps & InjectedProps;

class StartJob extends React.PureComponent<Props> {
  public render() {
    const className = this.props.canStart ? 'active' : '';
    return (
      <Container className={className}>
        <Frame className={className}>
          <Orb className={className} onClick={this.onOrbClick} />
          <Glow className={className} />
        </Frame>
      </Container>
    );
  }

  private onOrbClick = () => {
    if (this.props.canStart) {
      this.props.onStartJob();
    }
  }
}

class StartJobWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    const JobContext = getJobContext(this.props.jobNumber);
    return (
      <JobContext.Consumer>
        {({ onStartJob }) => (
          <StartJob {...this.props} onStartJob={onStartJob} />
        )}
      </JobContext.Consumer>
    );
  }
}

export default StartJobWithInjectedContext;
