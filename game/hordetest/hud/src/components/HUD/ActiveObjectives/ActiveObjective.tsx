/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';
import * as utils from '@csegames/library/lib/_baseGame/utils';
import { ViewBearingContext } from 'components/context/ViewBearingContext';
import { PlayerPositionContext } from 'components/context/PlayerPositionContext';

const CIRCLE_DIAMETER = 60;
const INDICATOR_DIMENSIONS = 20;

const Container = styled.div`
  display: flex;
  align-items: center;
  margin: 10px 0;
`;

const Circle = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${CIRCLE_DIAMETER}px;
  height: ${CIRCLE_DIAMETER}px;
  border-radius: 50%;
  background-color: #1A1A1A;

  &:before {
    content: '';
    position: absolute;
    top: 3px;
    right: 3px;
    bottom: 3px;
    left: 3px;
    border-radius: 50%;
    border: 2px solid #fe0000;
  }
`;

const DirectionalIndicator = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${INDICATOR_DIMENSIONS}px;
  height: ${INDICATOR_DIMENSIONS}px;
  font-size: ${INDICATOR_DIMENSIONS}px;
  color: white;
  transform: translate(-50%, 50%);
`;

const Icon = styled.div`
  font-size: 26px;
  color: #29BFE0;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  white-space: nowrap;
  padding-left: 50px;
  padding-right: 20px;
  margin-left: -40px;
  width: 200px;
  height: 40px;
  background: linear-gradient(to right, rgba(26, 26, 26, 0.9), rgba(26, 26, 26, 0.5));
  transition: width 0.8s;

  &.minimized {
    width: 30px;
  }
`;

const Name = styled.div`
  font-size: 16px;
  text-transform: uppercase;
  color: white;
  opacity: 1;

  &.minimized {
    display: none;
  }
`;

const BottomInfo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
`;

const DistanceText = styled.div`
  font-size: 14px;
  text-transform: uppercase;
  color: white;
  margin-right: 5px;
`;

const ProgressBarContainer = styled.div`
  position: relative;
  flex: 1;
  height: 3px;
  border: 1px solid white;

  &.minimized {
    display: none;
  }
`;

const ProgressBar = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: white;
`;

interface ActiveObjectiveProps {
  activeObjective: ActiveObjective;
  viewBearing: number;
  playerPosition: Vec3f;
}

export interface State {
  minimized: boolean;
}

class ActiveObjectiveWithInjectedContext extends React.Component<ActiveObjectiveProps, State> {
  private minimizeTimeout: number;
  constructor(props: ActiveObjectiveProps) {
    super(props);
    this.state = {
      minimized: false,
    };
  }

  public render() {
    const { activeObjective } = this.props;
    const minimizedClassName = this.state.minimized ? 'minimized' : '';
    return (
      <Container>
        <Circle>
          <DirectionalIndicator style={this.getDirectionIndicator()} className='fas fa-caret-down' />
          <Icon className={activeObjective.entityState.iconClass} />
        </Circle>
        <Info className={minimizedClassName}>
          <Name className={minimizedClassName}>{activeObjective.entityState.name}</Name>
          <BottomInfo>
            <DistanceText>{this.getDistance()}m</DistanceText>
            <ProgressBarContainer className={minimizedClassName}>
              <ProgressBar style={{ width: `${this.getCaptureProgress()}%` }} />
            </ProgressBarContainer>
          </BottomInfo>
        </Info>
      </Container>
    );
  }

  public componentDidMount() {
    this.minimizeTimeout = window.setTimeout(this.handleInitialMinimize, 4000);
  }

  public componentDidUpdate() {
    const distance = this.getDistance();
    if (this.state.minimized && distance < 20) {
      this.setState({ minimized: false });
    }

    if (!this.state.minimized && distance >= 20) {
      this.setState({ minimized: true });
    }
  }

  public componentWillUnmount() {
    window.clearTimeout(this.minimizeTimeout);
    this.minimizeTimeout = null;
  }

  private handleInitialMinimize = () => {
    this.setState({ minimized: true });
  }

  private getCaptureProgress = () => {
    const { current, max } = this.props.activeObjective.entityState.objectiveProgress;
    return (current / max) * 100;
  }

  private getDistance = () => {
    const distance = Number(utils.distanceVec3(
      this.props.playerPosition,
      this.props.activeObjective.entityState.position,
    ).toFixed(0));
    return distance;
  }

  private getDirectionIndicator = () => {
    const radius = CIRCLE_DIAMETER / 2;

    const { bearingDegrees } = this.props.activeObjective;
    const bearingRadians = (360 - bearingDegrees) * Math.PI / 180;
    const objectiveVector = { x: Math.cos(bearingRadians),y: Math.sin(bearingRadians) };

    let facingBearing = this.props.viewBearing + 90;
    if (facingBearing > 360) {
      facingBearing -= 360;
    }

    const playerRadians = (360 - facingBearing) * Math.PI / 180;
    const playerVector = { x: Math.cos(playerRadians), y: Math.sin(playerRadians) };

    let radians = -(Math.atan2(objectiveVector.y, objectiveVector.x) - Math.atan2(playerVector.y, playerVector.x));

    const x = (radius - 5) * Math.cos(radians) + (radius - INDICATOR_DIMENSIONS / 2);
    const y = (radius - 5) * Math.sin(radians) + (radius - INDICATOR_DIMENSIONS / 2);

    return {
      top: y,
      left: x,
      transform: `rotate(${(radians * 180 / Math.PI) - 90}deg)`,
    };
  }
}

export interface Props {
  activeObjective: ActiveObjective;
}

export function ActiveObjective(props: Props) {
  const viewBearingContext = useContext(ViewBearingContext);
  const playerPositionContext = useContext(PlayerPositionContext);
  return (
    <ActiveObjectiveWithInjectedContext
      activeObjective={props.activeObjective}
      viewBearing={viewBearingContext.viewBearing}
      playerPosition={playerPositionContext.playerPosition}
    />
  );
}
