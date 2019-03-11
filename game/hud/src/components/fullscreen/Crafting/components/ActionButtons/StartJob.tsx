/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { getJobContext } from '../../lib/utils';
import { MediaBreakpoints } from 'fullscreen/Crafting/lib/MediaBreakpoints';

// const Spin = keyframes`
//   0% {
//     -webkit-transform: rotate(0deg);
//     transform: rotate(0deg);
//   }
//   100% {
//     -webkit-transform: rotate(360deg);
//     transform:rotate(360deg);
//   }
// `;

const Container = styled.div`
  position: relative;
  height: 400px;
  width: 100%;

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    height: 630px;
  }
`;

const Frame = styled.div`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 625px;
  height: 400px;
  background: url(../images/crafting/1080/status-frame-off.png) no-repeat;
  background-position: center 0%;
  background-size: cover;
  -webkit-transition: background 0.2s;
  transition: background 0.2s;
  overflow: hidden;
  &.active {
    background: url(../images/crafting/1080/status-frame.png) no-repeat;
    background-position: center 0%;
    background-size: cover;
  }

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    width: 812px;
    height: 520px;
    background: url(../images/crafting/4k/status-frame-off.png) no-repeat;
    background-position: center 0%;
    background-size: cover;

    &.active {
      background: url(../images/crafting/4k/status-frame.png) no-repeat;
      background-position: center 0%;
      background-size: cover;
    }
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    width: 1250px;
    height: 800px;
    background: url(../images/crafting/4k/status-frame-off.png) no-repeat;
    background-position: center 0%;
    background-size: cover;

    &.active {
      background: url(../images/crafting/4k/status-frame.png) no-repeat;
      background-position: center 0%;
      background-size: cover;
    }
  }
`;

const Orb = styled.div`
  position: absolute;
  width: 133px;
  height: 133px;
  top: 139px;
  left: 0;
  right: 0;
  margin: auto;
  cursor: pointer;
  pointer-events: all;
  transition: filter 0.2s ease-in-out;
  background: url(../images/crafting/1080/orb-off.png);
  &.active {
    background: url(../images/crafting/1080/orb-on.png);
  }

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    top: 181px;
    width: 173px;
    height: 173px;
    background: url(../images/crafting/4k/orb-off.png) no-repeat;
    background-size: contain;
    &.active {
      background: url(../images/crafting/4k/orb-on.png) no-repeat;
      background-size: contain;
    }
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    top: 280px;
    width: 318px;
    height: 318px;
    background: url(../images/crafting/4k/orb-off.png);
    &.active {
      background: url(../images/crafting/4k/orb-on.png);
    }
  }

  &:hover {
    filter: brightness(150%);
    -webkit-filter: brightness(150%);
  }
`;

const Glow = styled.div`
  position: absolute;
  background: url(../images/crafting/1080/orb-glow.png);
  width: 417px;
  height: 241px;
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

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    width: 542px;
    height: 313px;
    background: url(../images/crafting/4k/orb-glow.png) no-repeat;
    background-size: cover;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    width: 998px;
    height: 833px;
    background: url(../images/crafting/4k/orb-glow.png);
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
