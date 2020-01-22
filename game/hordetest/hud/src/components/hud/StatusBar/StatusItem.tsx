/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

import { StatusWithDef } from './index';

const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  transform: skewX(-10deg);
  margin: 0 2.5px;

  &.friendly {
    background-color: rgba(255, 255, 255, 0.0);
    border: 2px solid rgba(255, 255, 255, 0.8);
  }

  &.hostile {
    background-color: rgba(150, 0, 0, 0.0);
    border: 2px solid rgba(150, 0, 0, 0.8);
    color: rgb(255, 205, 217);
  }
`;

const TimerOverlay = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;

  &.friendly {
    background-color: rgba(255, 255, 255, 0.8);
    border-top: 1px solid rgba(255,255, 255, 0.6);
  }

  &.hostile {
    background-color: rgba(150, 0, 0, 0.8);
    border-top: 1px solid rgba(255,255, 255, 0.6);
  }
`;

const Icon = styled.div`
  font-size: 45px;
  color: white;
  transform: skewX(10deg);
  
`;

export interface Props {
  type: 'friendly' | 'hostile';
  status: StatusWithDef;
}

export interface State {
  currentDurationPercent: number;
}

export class StatusItem extends React.Component<Props, State> {
  private timerTickTimeout: number;
  constructor(props: Props) {
    super(props);
    this.state = {
      currentDurationPercent: this.getProgress(props.status.duration, props.status.startTime),
    };
  }

  public render() {
    return (
      <Container className={this.props.type}>
        <TimerOverlay className={this.props.type} style={{ height: `${this.state.currentDurationPercent}%` }} />
        <Icon className={this.props.status.def.iconClass} />
      </Container>
    );
  }

  public componentDidMount() {
    if (this.props.status.duration) {
      this.timerTick();
    }
  }

  public componentWillUnmount() {
    if (this.timerTickTimeout) {
      window.clearTimeout(this.timerTickTimeout);
    }
  }

  private timerTick = () => {
    const progress = this.getProgress(this.props.status.startTime, this.props.status.duration);
    this.setState({ currentDurationPercent: progress });

    if (progress <= 0 ) {
      return;
    }

    this.timerTickTimeout = window.setTimeout(this.timerTick, 66);
  }

  private getProgress = (start: number, fullDuration: number) => {
    const elapsed = game.worldTime - start;
    let current = fullDuration - elapsed;
    if (current < 0) {
      current = 0;
    }

    return ((current / fullDuration) * 100);
  }
}
