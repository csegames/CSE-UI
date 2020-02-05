/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { ObjectiveState } from './index';
import { arc2path, currentMax2circleDegrees } from '../lib/circleHelpers';

const CIRCLE_DIAMETER = 64;

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const Circle = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${CIRCLE_DIAMETER}px;
  height: ${CIRCLE_DIAMETER}px;
  border-radius: 50%;
  background-color: transparent;

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
      background-color: rgba(255, 0, 0, 0.7);
    }
    to {
      background-color: rgba(0, 0, 0, 0.2);
    }
  }
`;

const Icon = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 26px;
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
  color: black;
  font-size: 18px;
  font-family: Exo;
  font-weight: bold;
`;

export interface Props {
  state: ObjectiveState;
}

export interface State {
  isDanger: boolean;
}

export class Objective extends React.Component<Props, State> {
  private dangerTimeout: number;
  constructor(props: Props) {
    super(props);
    this.state = {
      isDanger: false,
    };
  }

  public render() {
    const { state } = this.props;
    const { current, max } = state.objectiveState.objective.progress;
    const dangerClassName = this.state.isDanger ? 'danger' : '';
    const objectiveType = this.getObjectiveType();

    const SVGCircleDiameter = CIRCLE_DIAMETER - 15;
    return (
      <Container>
        <Circle className={`${dangerClassName} ${objectiveType}`}>
          <Icon className={`${dangerClassName} ${state.objectiveState.iconClass}`}>
            <ObjectiveIndicator>{state.indicator}</ObjectiveIndicator>
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
              strokeWidth='6px'
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
              stroke={'rgba(255, 255, 255, 0.8)'}
              fill='transparent'
            />
          </svg>
        </Circle>
      </Container>
    );
  }

  public componentDidUpdate(prevProps: Props, prevState: State) {
    if (prevProps.state.objectiveState.objective.progress.current >
        this.props.state.objectiveState.objective.progress.current) {
      // If losing progress, expand the widget to show that it's losing progress
      this.showDanger();
    }
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

  private getObjectiveType = () => {
    const name = this.props.state.objectiveState.iconClass.toLowerCase();
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
