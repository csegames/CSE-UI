/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { StatusWithDef } from './index';
import { game } from '@csegames/library/dist/_baseGame';

const Container = 'StatusBar-StatusItem-Container';
const TimerOverlay = 'StatusBar-StatusItem-TimerOverlay';

const Icon = 'StatusBar-StatusItem-Icon';
const Count = 'StatusBar-StatusItem-Count';

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
      currentDurationPercent: this.getProgress(props.status.status.duration, props.status.status.startTime)
    };
  }

  public render() {
    return (
      <div id={`StatusItemContainer_${this.props.status.status.id}`} className={`${Container} ${this.props.type}`}>
        <div
          className={`${TimerOverlay} ${this.props.type}`}
          style={{ height: `${this.state.currentDurationPercent}%` }}
        />
        <div className={`${Icon} ${this.props.status.def.displayInfoIconClass}`} />
        {this.getStatusCountIcon()}
      </div>
    );
  }

  private getStatusCountIcon(): JSX.Element {
    if (this.props.status.count > 1) {
      return <div className={Count}>{this.props.status.count}</div>;
    }
  }

  public componentDidMount() {
    if (this.props.status.status.duration && this.props.status.status.duration != Infinity) {
      this.timerTick();
      this.timerTickTimeout = window.setInterval(this.timerTick, 66);
    }
  }

  public componentWillUnmount() {
    if (this.timerTickTimeout) {
      window.clearInterval(this.timerTickTimeout);
      this.timerTickTimeout = 0;
    }
  }

  public componentDidUpdate(prevProps: Props) {
    const statusHasDuration = this.props.status.status.duration && this.props.status.status.duration != Infinity;

    if (statusHasDuration && !this.timerTickTimeout) {
      // this status has a duration and we're not already ticking down, so start
      this.timerTickTimeout = window.setInterval(this.timerTick, 66);
    } else if (!statusHasDuration && this.timerTickTimeout) {
      // this status has an infinite duraton, stop the current ticking timeout if one exists
      this.setState({ currentDurationPercent: 0 });
      window.clearInterval(this.timerTickTimeout);
      this.timerTickTimeout = 0;
    }
  }

  private timerTick = () => {
    const progress = this.getProgress(this.props.status.status.startTime, this.props.status.status.duration);
    this.setState({ currentDurationPercent: progress });

    if (progress <= 0 && this.timerTickTimeout) {
      window.clearInterval(this.timerTickTimeout);
      this.timerTickTimeout = 0;
      return;
    }
  };

  private getProgress = (start: number, fullDuration: number) => {
    if (this.props.status.status.duration == Infinity) {
      return 0;
    }

    const elapsed = game.worldTime - start;
    let current = fullDuration - elapsed;
    if (current < 0) {
      current = 0;
    }

    return (current / fullDuration) * 100;
  };
}
