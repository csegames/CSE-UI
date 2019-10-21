/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { Counter } from './Counter';

const COMBO_NUMBER_TO_SHOW = 3;

export interface KillStreakCounterData {
  newCount: number;
  newTimerStart: number;
  newTimerMax: number;
}

export interface State {
  killStreakCounter: KillStreakCounterData;
}

export class  KillStreakCounter extends React.Component<{}, State> {
  private evh: EventHandle;
  constructor(props: {}) {
    super(props);
    this.state = {
      killStreakCounter: {
        newCount: 0,
        newTimerStart: 0,
        newTimerMax: 0,
      },
    };
  }

  public render() {
    return this.state.killStreakCounter.newCount > COMBO_NUMBER_TO_SHOW && (
      <Counter killStreakCounter={this.state.killStreakCounter} onTimerFinish={this.clearKillStreakCounter} />
    );
  }

  public componentDidMount() {
    this.evh = hordetest.game.onKillStreakUpdate(this.handleKillStreakUpdate);
  }

  public componentWillUnmount() {
    this.evh.clear();
  }

  private handleKillStreakUpdate = (newCount: number, newTimerStart: number, newTimerDuration: number) => {
    const killStreakCounter = {
      newCount,
      newTimerStart: newTimerStart,
      newTimerMax: newTimerDuration,
    };
    this.setState({ killStreakCounter });
  }

  private clearKillStreakCounter = () => {
    this.setState({
      killStreakCounter: {
        newCount: 0,
        newTimerStart: 0,
        newTimerMax: 0,
      },
    });
  }
}
