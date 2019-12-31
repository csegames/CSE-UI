/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { ObjectivesContext, ObjectiveState as ObjectiveEntity } from 'components/context/ObjectivesContext';

const Container = styled.div`
  position: relative;
  height: 100%;
  width: 100%;
  font-family: Exo;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(to right, transparent 10%, black 30%, black 70%, transparent 90%)
`;

const TopBorder = styled.div`
  position: absolute;
  top: 25px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: white;
`;

const GradientBackground = styled.div`
  position: absolute;
  top: 25px;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.3), transparent);
`;

const IndicatorContainer = styled.div`
  position: absolute;
  top: 0px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const IndicatorNumber = styled.div`
  font-family: Exo;
  font-weight: bold;
  font-size: 20px;
  color: white;
`;

const Indicator = styled.div`
  width: 11px;
  height: 11px;
  margin-top: -3px;
  border: 2px solid white;
  border-top-width: 0px;
  border-left-width: 0px;
  transform: rotate(45deg);
`;

const Cardinal = styled.div`
  position: absolute;
  margin: 0;
  padding: 0;
  top: 25px;
  margin-top: 10px;
  color: white;
  width: 30px;
  text-align: center;
  transform: translateX(-50%);
  line-height: 35px;
  font-size: 14px;

  &.direction {
    font-size: 29px;
    margin-top: 12px
  }
`;

const Objective = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  margin: 0;
  padding: 0;
  top: 20px;
  font-size: 26px;
  transform: translateX(-50%);
  color: white;

  &:before {
    text-shadow: 2px 2px 5px rgba(0, 0, 0, 0.7);
    -webkit-text-stroke-width: 8px;
    -webkit-text-stroke-color: black;
  }

  &.Health:before {
    text-shadow: 2px 2px 5px rgba(0, 75, 11, 0.7);
    -webkit-text-stroke-width: 8px;
    -webkit-text-stroke-color: rgba(0, 75, 11, 0.7);
    color: rgba(0, 75, 11, 1);
  }

  &.Mana:before {
    text-shadow: 2px 2px 5px rgba(94, 80, 0, 0.7);
    -webkit-text-stroke-width: 8px;
    -webkit-text-stroke-color: rgba(94, 80, 0, 0.7);
    color: rgba(94, 80, 0, 1);
  }

  &.Unstarted {
    opacity: 0.5;
  }
`;

const ObjectiveIndicator = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  color: black;
  font-size: 16px;
  font-family: Exo;
  font-weight: bold;
`;

export interface Props {
}

export interface State {
  facing: number;
}

export class Compass extends React.Component<Props, State> {
  public name: string = 'Compass';
  private playerStateEVH: EventHandle;

  constructor(props: Props) {
    super(props);
    this.state = {
      facing: hordetest.game.selfPlayerState.viewBearing,
    };
  }

  public render() {
    const facing: number = this.state.facing;
    return (
      <ObjectivesContext.Consumer>
        {(objectivesContext) => (
          <Container>
            <TopBorder />
            <GradientBackground />
            <IndicatorContainer>
              <IndicatorNumber>{Math.round(facing)}</IndicatorNumber>
              <Indicator />
            </IndicatorContainer>
            <Cardinal className='direction' style={this.position(facing, 0)}>N</Cardinal>
            <Cardinal style={this.position(facing, 15)}>15</Cardinal>
            <Cardinal style={this.position(facing, 30)}>30</Cardinal>
            <Cardinal style={this.position(facing, 45)}>NE</Cardinal>
            <Cardinal style={this.position(facing, 60)}>60</Cardinal>
            <Cardinal style={this.position(facing, 75)}>75</Cardinal>
            <Cardinal className='direction' style={this.position(facing, 90)}>E</Cardinal>
            <Cardinal style={this.position(facing, 105)}>105</Cardinal>
            <Cardinal style={this.position(facing, 120)}>120</Cardinal>
            <Cardinal style={this.position(facing, 135)}>SE</Cardinal>
            <Cardinal style={this.position(facing, 150)}>150</Cardinal>
            <Cardinal style={this.position(facing, 165)}>165</Cardinal>
            <Cardinal className='direction' style={this.position(facing, 180)}>S</Cardinal>
            <Cardinal style={this.position(facing, 195)}>195</Cardinal>
            <Cardinal style={this.position(facing, 210)}>210</Cardinal>
            <Cardinal style={this.position(facing, 225)}>SW</Cardinal>
            <Cardinal style={this.position(facing, 240)}>240</Cardinal>
            <Cardinal style={this.position(facing, 255)}>255</Cardinal>
            <Cardinal className='direction' style={this.position(facing, 270)}>W</Cardinal>
            <Cardinal style={this.position(facing, 285)}>285</Cardinal>
            <Cardinal style={this.position(facing, 300)}>300</Cardinal>
            <Cardinal style={this.position(facing, 315)}>NW</Cardinal>
            <Cardinal style={this.position(facing, 330)}>330</Cardinal>
            <Cardinal style={this.position(facing, 345)}>345</Cardinal>
            {this.getCompassObjectives(objectivesContext.objectives).map((entity) => {
              const stateClassName = ObjectiveState[entity.objective.state];
              return (
                <Objective
                  style={this.position(facing, entity.objective.bearingDegrees)}
                  className={`${entity.iconClass} ${stateClassName} ${this.getObjectiveType(entity)}`}>
                  <ObjectiveIndicator>{this.getObjectiveIndicator(entity)}</ObjectiveIndicator>
                </Objective>
              );
            })}
          </Container>
        )}
      </ObjectivesContext.Consumer>
    );
  }

  public componentDidMount() {
    this.playerStateEVH = hordetest.game.selfPlayerState.onUpdated(this.handleSelfPlayerUpdate);
  }

  public componentWillUnmount() {
    this.playerStateEVH.clear();
  }

  private getCompassObjectives = (allObjectives: ObjectiveEntity[]) => {
    return allObjectives.filter((entity) => entity.objective.visibility & ObjectiveUIVisibility.Compass);
  }

  private convertToMinusAngle = (angle: number) => {
    if (angle <= 360 && angle >= 180) {
      return -180 + (angle - 180);
    } else {
      return angle;
    }
  }

  private angleToPercentage = (facing: number, angle: number): number => {
    const percentPerDegree = 100 / 150;
    const facingAdjustment = Math.round((360 - facing) % 360);
    const adjustedAngle = this.convertToMinusAngle((facingAdjustment + angle) % 360);
    const leftPosition = (adjustedAngle * percentPerDegree) + 50;

    return leftPosition;
  }

  private handleSelfPlayerUpdate = () => {
    this.setState({ facing: hordetest.game.selfPlayerState.viewBearing });
  }

  private position(facing: number, angle: number) {
    return {left: this.angleToPercentage(facing, angle) + '%'};
  }

  private getObjectiveIndicator = (objective: ObjectiveEntity) => {
    return objective.indicator;
  }

  private getObjectiveType = (objective: ObjectiveEntityState) => {
    const name = objective.iconClass.toLowerCase();
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
}
