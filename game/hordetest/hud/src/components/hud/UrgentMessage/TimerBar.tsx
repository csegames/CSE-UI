/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React from 'React';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  width: 100%;
  height: 5px;
  background-color: #38393D;
`;

const Bar = styled.div`
  height: 100%;
  background-color: white;
`;

export interface Props {
  // milliseconds
  duration: number;

  // in worldtime
  startTime: number;
}

export interface State {
  progressPercent: number;
}

export class TimerBar extends React.Component<Props, State> {
  private progressCountdownTimeout: number;
  constructor(props: Props) {
    super(props);
    this.state = {
      progressPercent: 0,
    };
  }

  public render() {
    return (
      <Container>
        <Bar style={{ width: `${this.state.progressPercent}%` }} />
      </Container>
    );
  }

  public componentDidMount() {
    this.startProgressCountdown();
  }

  public componentWillUnmount() {
    if (this.progressCountdownTimeout) {
      window.clearTimeout(this.progressCountdownTimeout);
    }
  }

  private startProgressCountdown = () => {
    this.setState({ progressPercent: 100 });
    this.progressCountdownTick();
  }

  private progressCountdownTick = () => {
    const timeLeft = this.props.duration - (game.worldTime - this.props.startTime);
    if (timeLeft <= 0) {
      this.setState({ progressPercent: 0 });
      return;
    }

    this.setState({ progressPercent: (timeLeft / this.props.duration) * 100 });
    this.progressCountdownTimeout = window.setTimeout(this.progressCountdownTick, 66);
  }
}
