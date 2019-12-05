/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { ActionButton } from './ActionButton';

export interface Props {
  type: 'weak' | 'strong' | 'ultimate';
  actionIconClass: string;
  keybindText: string;
  keybindIconClass?: string;
  abilityID?: number;
  className?: string;
}

export interface State {
  cooldownTimer: CurrentMax & Timing & { progress: number };
  isReady: boolean;
}

export class AbilityButton extends React.Component<Props, State> {
  private abilityStateHandle: EventHandle;
  constructor(props: Props) {
    super(props);
    this.state = {
      cooldownTimer: { start: 0, duration: 0, current: 0, max: 0, progress: 0 },
      isReady: this.getIsReady(),
    };
  }

  public render() {
    return (
      <ActionButton
        showActiveAnim={this.shouldShowActiveAnim()}
        disabled={!this.state.isReady}
        actionIconClass={this.props.actionIconClass}
        keybindText={this.props.keybindText}
        abilityID={this.props.abilityID}
        className={this.props.className}
        cooldownTimer={this.state.cooldownTimer}
        keybindIconClass={this.props.keybindIconClass}
      />
    );
  }

  public componentDidMount() {
    if (this.props.abilityID) {
      // Do initial check
      this.checkStartCountdown();

      // Check on updated
      this.abilityStateHandle = hordetest.game.abilityStates[this.props.abilityID].onUpdated(() => {
        this.checkStartCountdown();
        this.checkIsReady();
      });
    }
  }

  public componentWillUnmount() {
    this.abilityStateHandle.clear();
  }

  private shouldShowActiveAnim = () => {
    return this.state.cooldownTimer.current === 0;
  }

  private checkStartCountdown = () => {
    const ability = hordetest.game.abilityStates[this.props.abilityID];
    if (ability.status & AbilityButtonState.Cooldown) {
      this.startCountdown(ability.timing)
    }
  }

  private checkIsReady = () => {
    const isReady = this.getIsReady();
    if (isReady !== this.state.isReady) {
      this.setState({ isReady });
    }
  }

  private startCountdown = (cooldown: Timing) => {
    if (cooldown && this.state.cooldownTimer.current === 0) {
      const timer = Math.round(this.getTimingEnd(cooldown) / 1000);
      this.setState({ cooldownTimer: { ...cloneDeep(cooldown), current: timer, max: timer, progress: 100 } });
      window.setTimeout(this.updateProgress, 66);
    }
  }

  private updateProgress = () => {
    const currentProgress = this.getCurrentProgress();

    this.setState({
      cooldownTimer: {
        ...this.state.cooldownTimer,
        current: Number(currentProgress.current.toFixed(0)),
        progress: currentProgress.progress,
      },
    });

    if (currentProgress.current === 0) return;
    window.setTimeout(this.updateProgress, 66);
  }

  private getCurrentProgress = () => {
    const elapsed = game.worldTime - this.state.cooldownTimer.start;
    let current = this.state.cooldownTimer.max - elapsed;
    if (current < 0) {
      current = 0;
    }

    return {
      progress: current / this.state.cooldownTimer.max * 100,
      current,
    };
  }

  private getTimingEnd = (timing: DeepImmutableObject<Timing>) => {
    const timingEnd = ((timing.start + timing.duration) - game.worldTime) * 1000;
    return timingEnd;
  }

  private getIsReady = () => {
    if (!this.props.abilityID) return false;

    const ability = hordetest.game.abilityStates[this.props.abilityID];
    if (ability.status & AbilityButtonState.Unusable) {
      return false;
    } else {
      return true;
    }
  }
}
