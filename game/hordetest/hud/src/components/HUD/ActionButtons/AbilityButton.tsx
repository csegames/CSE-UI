/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { ActionButton } from './ActionButton';

export interface Props {
  actionIconClass: string;
  keybindText: string;
  abilityID?: number;
  className?: string;
}

export interface State {
  cooldownTimer: number;
}

export class AbilityButton extends React.Component<Props, State> {
  private abilityStateHandle: EventHandle;
  constructor(props: Props) {
    super(props);
    this.state = {
      cooldownTimer: 0,
    };
  }

  public render() {
    return (
      <ActionButton
        actionIconClass={this.props.actionIconClass}
        keybindText={this.props.keybindText}
        abilityID={this.props.abilityID}
        className={this.props.className}
        cooldownTimer={this.state.cooldownTimer}
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
      });
    }
  }

  public componentWillUnmount() {
    this.abilityStateHandle.clear();
  }

  private checkStartCountdown = () => {
    const ability = hordetest.game.abilityStates[this.props.abilityID];
    if (ability.status & AbilityButtonState.Cooldown) {
      this.startCountdown(ability.timing)
    }
  }

  private startCountdown = (cooldown: Timing) => {
    if (cooldown && this.state.cooldownTimer === 0) {
      this.setState({ cooldownTimer: Math.round(this.getTimingEnd(cooldown) / 1000) });
      window.setTimeout(this.decrementCountdown, 1000);
    }
  }

  private decrementCountdown = () => {
    if (!this.state.cooldownTimer) return;
    this.setState({ cooldownTimer: this.state.cooldownTimer - 1 });
    window.setTimeout(this.decrementCountdown, 1000);
  }

  private getTimingEnd = (timing: DeepImmutableObject<Timing>) => {
    const timingEnd = ((timing.start + timing.duration) - game.worldTime) * 1000;
    return timingEnd;
  }
}
