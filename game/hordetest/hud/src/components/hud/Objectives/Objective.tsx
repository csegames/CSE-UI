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
import { arc2path, currentMax2circleDegrees } from 'lib/circleHelpers';

const CIRCLE_DIAMETER = 60;
const INDICATOR_DIMENSIONS = 15;

const Container = styled.div`
  display: flex;
  align-items: center;
  margin: 5px 0;

  &.Unstarted {
    opacity: 0.5;
  }
`;

const Circle = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${CIRCLE_DIAMETER}px;
  height: ${CIRCLE_DIAMETER}px;
  border-radius: 50%;
  background-color: rgba(0, 0, 0, 0.8);
  z-index: -2;

  &.Health {
    background-color: #004B0B;
  }

  &.Mana {
    background-color: #5E5000;
  }

  &.danger {
    animation: pulse 0.3s infinite alternate;
  }

  @keyframes pulse {
    from {
      background-color: rgba(240, 0, 0, 0.7);
    }
    to {
      background-color: rgba(0, 0, 0, 0.8);
    }
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
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  color: #5fdfff;
  &.danger {
    color: red;
  }
`;

const ObjectiveIndicator = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: #1A1A1A;
  font-size: 14px;
  font-family: Exo;
  font-weight: bold;
`;

const Info = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  white-space: nowrap;
  padding-top: 80px;
  text-align: center;
  position: absolute;
  width: 60px;
  height: 52px;
  text-shadow: 0px 0px 2px black, 0px 0px 2px black;
  transition: width 0.8s;

  &.Health {
    background: linear-gradient(to right, rgba(0, 75, 11, 0.9),  rgba(0, 75, 11, 0.5));
  }

  &.Mana {
    background: linear-gradient(to right, rgba(94, 80, 0, 0.9), rgba(94, 80, 0, 0.5));
  }

  &.minimized {
    width: 60px;
  }

  &.danger {
  }
`;

const Name = styled.div`
  font-size: 16px;
  font-family: Exo;
  text-transform: uppercase;
  color: white;
  opacity: 1;
  display: none;

  &.minimized {
    display: none;
  }

  &.danger {
    display: none;
  }
`;

const BottomInfo = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  max-height: fit-content;
`;

const DistanceText = styled.div`
  font-size: 14px;
  font-family: Exo;
  text-transform: lowercase;
  color: white;
  margin: auto;
`;

interface ObjectiveProps {
  objective: ObjectiveEntityState;
  viewBearing: number;
  playerPosition: Vec3f;
  indicator: string;
}

export interface State {
  isMinimized: boolean;
  isDanger: boolean;
  entityState: ObjectiveEntityState;
}

class ObjectiveWithInjectedContext extends React.Component<ObjectiveProps, State> {
  private minimizeTimeout: number;
  private dangerTimeout: number;
  private evh: EventHandle;
  constructor(props: ObjectiveProps) {
    super(props);
    this.state = {
      isMinimized: false,
      isDanger: false,
      entityState: props.objective
    };
  }

  public render() {
    const { objective } = this.props;
    const { current, max } = this.state.entityState.objective.progress;
    const minimizedClassName = this.state.isMinimized ? 'minimized' : '';
    const dangerClassName = this.state.isDanger ? 'danger' : '';
    const objectiveType = this.getObjectiveType();

    const SVGCircleDiameter = CIRCLE_DIAMETER - 15;
    const distanceToTarget = this.getDistance();
    const distanceWithRadius = distanceToTarget - this.state.entityState.objective.footprintRadius < 0 ? 0 :
      distanceToTarget - this.state.entityState.objective.footprintRadius;

    return (
      <Container className={ObjectiveState[objective.objective.state]}>
        <Circle className={`${dangerClassName} ${objectiveType}`}>
          {this.state.isMinimized &&
            <DirectionalIndicator style={this.getDirectionIndicator()} className='fas fa-caret-down' />
          }
          <Icon className={`${dangerClassName} ${objective.iconClass}`}>
            <ObjectiveIndicator>{this.props.indicator}</ObjectiveIndicator>
          </Icon>
          <svg height={SVGCircleDiameter * 2} width={SVGCircleDiameter * 2} style={{ position: 'absolute' }}>
            <path
              d={
                arc2path(
                  SVGCircleDiameter,
                  SVGCircleDiameter,
                  SVGCircleDiameter / 2,
                  360 - currentMax2circleDegrees(current, max),
                  360
                )
              }
              strokeWidth='5px'
              stroke={this.state.isDanger ? '#fe0000' : '#ffffff'}
              fill='transparent'
            />
          </svg>
          <svg
            height={SVGCircleDiameter * 2} width={SVGCircleDiameter * 2}
            style={{ position: 'absolute', zIndex: -1 }}>
            <path
              d={
                arc2path(
                  SVGCircleDiameter,
                  SVGCircleDiameter,
                  SVGCircleDiameter / 2,
                  0.1,
                  360
                )
              }
              strokeWidth='2px'
              stroke={'rgba(255, 255, 255, 0.7)'}
              fill='transparent'
            />
          </svg>
        </Circle>
        <Info className={`${minimizedClassName} ${dangerClassName} ${objectiveType}`}>
          <Name className={`${minimizedClassName} ${dangerClassName}`}></Name>
          <BottomInfo>
            <DistanceText>{distanceWithRadius}m</DistanceText>
          </BottomInfo>
        </Info>
      </Container>
    );
  }

  public componentDidMount() {
    this.minimizeTimeout = window.setTimeout(this.handleInitialMinimize, 4000);
    this.evh = hordetest.game.onEntityStateUpdate(this.handleEntityStateUpdate);
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    const distance = this.getDistance();
    if (this.state.isMinimized && distance - this.state.entityState.objective.footprintRadius < 40) {
      this.setState({ isMinimized: false });
    }

    if (!this.state.isMinimized && distance - this.state.entityState.objective.footprintRadius >= 40) {
      this.setState({ isMinimized: true });
    }

    if (prevState.entityState.objective.progress.current > this.state.entityState.objective.progress.current) {
      // If losing progress, expand the widget to show that it's losing progress
      this.showDanger();
    }
  }

  public componentWillUnmount() {
    window.clearTimeout(this.minimizeTimeout);
    this.minimizeTimeout = null;

    this.evh.clear();
  }

  private handleInitialMinimize = () => {
    this.setState({ isMinimized: true });
  }

  private handleEntityStateUpdate = (state: AnyEntityStateModel) => {
    if (state.entityID === this.state.entityState.entityID) {
      const objectiveState = (state as any) as ObjectiveEntityState;
      this.setState({ entityState: cloneDeep(objectiveState) });
    }
  }

  private getObjectiveType = () => {
    const name = this.props.objective.iconClass.toLowerCase();
    if (name.includes('tower')) {
      return 'Tower';
    }

    if (name.includes('health')) {
      return 'Health';
    }

    if (name.includes('mana')) {
      return 'Mana';
    }

    return '';
  }

  private showDanger = () => {
    if (this.dangerTimeout) {
      window.clearTimeout(this.dangerTimeout);
    }

    if (!this.state.isDanger) {
      this.setState({ isDanger: true });
    }

    this.dangerTimeout = window.setTimeout(() => {
      this.setState({ isDanger: false });
    }, 2000);
  }

  private getDistance = () => {
    const distance = Number(utils.distanceVec3(
      this.props.playerPosition,
      this.state.entityState.position,
    ).toFixed(0));
    return distance;
  }

  private getDirectionIndicator = () => {
    const radius = CIRCLE_DIAMETER / 2;

    const { bearingDegrees } = this.props.objective.objective;
    const bearingRadians = (360 - bearingDegrees) * Math.PI / 180;
    const objectiveVector = { x: Math.cos(bearingRadians),y: Math.sin(bearingRadians) };

    let facingBearing = this.props.viewBearing + 90;
    if (facingBearing > 360) {
      facingBearing -= 360;
    }

    const playerRadians = (360 - facingBearing) * Math.PI / 180;
    const playerVector = { x: Math.cos(playerRadians), y: Math.sin(playerRadians) };

    let radians = -(Math.atan2(objectiveVector.y, objectiveVector.x) - Math.atan2(playerVector.y, playerVector.x));

    const x = (radius - 17) * Math.cos(radians) + (radius - INDICATOR_DIMENSIONS / 2);
    const y = (radius - 17) * Math.sin(radians) + (radius - INDICATOR_DIMENSIONS / 2);

    return {
      top: y,
      left: x,
      transform: `rotate(${(radians * 180 / Math.PI) - 90}deg)`,
    };
  }
}

export interface Props {
  objective: ObjectiveEntityState;
  indicator: string;
}

export function Objective(props: Props) {
  const viewBearingContext = useContext(ViewBearingContext);
  const playerPositionContext = useContext(PlayerPositionContext);
  return (
    <ObjectiveWithInjectedContext
      indicator={props.indicator}
      objective={props.objective}
      viewBearing={viewBearingContext.viewBearing}
      playerPosition={playerPositionContext.playerPosition}
    />
  );
}
