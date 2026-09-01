/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

import { StatusWithDef } from './index';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { AnimationData } from '@csegames/library/dist/_baseGame/GameClientModels/AnimationData';
import { clientAPI } from '@csegames/library/dist/hordetest/MainScreenClientAPI';

const Container = 'StatusBar-StatusItem-Container';
const TimerOverlay = 'StatusBar-StatusItem-TimerOverlay';

const Icon = 'StatusBar-StatusItem-Icon';
const Count = 'StatusBar-StatusItem-Count';

export interface Props extends StatusWithDef {
  type: 'friendly' | 'hostile';
}

export interface State {
  animationHandle: ListenerHandle | null;
  percentRemaining: number;
}

export class StatusItem extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      animationHandle: this.shouldAnimate() ? clientAPI.startAnimation(this.animate.bind(this)) : null,
      percentRemaining: 0
    };
  }

  public render() {
    return (
      <div id={`StatusItemContainer_${this.props.status.id}`} className={`${Container} ${this.props.type}`}>
        {this.state.percentRemaining > 0 && (
          <div className={`${TimerOverlay} ${this.props.type}`} style={{ height: `${this.state.percentRemaining}%` }} />
        )}
        <div className={`${Icon} ${this.props.def.iconClass}`} />
        {this.props.count > 0 && <div className={Count}>{this.props.count}</div>}
      </div>
    );
  }

  public componentWillUnmount() {
    this.state.animationHandle?.close();
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.shouldAnimate() && !this.state.animationHandle) {
      this.setState({ animationHandle: clientAPI.startAnimation(this.animate.bind(this)) });
    }
  }

  public shouldAnimate(): boolean {
    return this.props.status.duration && this.props.status.duration != Infinity;
  }

  public animate(data: AnimationData, _: DOMHighResTimeStamp): void {
    if (!this.shouldAnimate()) {
      this.clearState(true);
      return;
    }
    const elapsed = data.worldTime - this.props.status.startTime;
    const percentRemaining = Math.min(100, Math.ceil(100 * (this.props.status.duration - elapsed) / this.props.status.duration));
    if (percentRemaining <= 0) {
      this.clearState();
      return;
    }

    if (percentRemaining != this.state.percentRemaining) {
      this.setState({ percentRemaining });
    }
  }

  private clearState(stopAnimation?: boolean): void {
    if (!this.state.percentRemaining && (!stopAnimation || !this.state.animationHandle)) {
      return;
    }
    const updated: State = { percentRemaining: 0, animationHandle: this.state.animationHandle };
    if (stopAnimation) {
      this.state.animationHandle?.close();
      updated.animationHandle = null;
    }
    this.setState(updated);
  }
}
