/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { RootState } from '../../redux/store';
import { connect } from 'react-redux';
import { AbilityWithActivation } from '../../redux/abilitiesSlice';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { AnimationData } from '@csegames/library/dist/_baseGame/GameClientModels/AnimationData';

const OverlayCooldownProgress = 'HUD-AbilityButton-OverlayCooldownProgress';
const OverlayCooldownValue = 'HUD-AbilityButton-OverlayCooldownValue';

interface ReactProps {
  abilityID: number;
}

interface InjectedProps {
  abilityStatus: AbilityWithActivation;
}

type Props = ReactProps & InjectedProps;

type State = {
  // Identifies the active cooldown so we only (re)build the CSS animation when a new one starts.
  cooldownStart: number;
  cooldownDuration: number;
  // Negative offset that seeks the CSS animation to the current point in the cooldown.
  animationDelay: number;
  cooldownTime: string;
};

class ACooldownOverlay extends React.Component<Props, State> {
  private animationHandle: ListenerHandle | null = null;

  constructor(props: Props) {
    super(props);
    this.state = { cooldownStart: 0, cooldownDuration: 0, animationDelay: 0, cooldownTime: '' };
  }

  componentDidMount(): void {
    this.animationHandle = clientAPI.startAnimation(this.animate.bind(this));
  }

  render(): React.ReactNode {
    if (!this.state.cooldownTime) return null;

    const { cooldownStart, cooldownDuration, animationDelay } = this.state;
    const drain: React.CSSProperties = {
      animationDuration: `${cooldownDuration}s`,
      animationDelay: `${animationDelay}s`
    };

    return (
      <>
        {/* Keyed on the cooldown start to restart the drain animation. */}
        <div className={OverlayCooldownProgress} key={cooldownStart} style={drain} />
        <div className={OverlayCooldownValue}>{this.state.cooldownTime}</div>
      </>
    );
  }

  componentWillUnmount(): void {
    this.animationHandle?.close();
  }

  private animate(data: AnimationData, _: DOMHighResTimeStamp): void {
    const cooldownTiming = this.props.abilityStatus?.cooldownTiming;

    if (!cooldownTiming || cooldownTiming.duration <= 0) {
      this.clearCooldown();
      return;
    }

    const { start, duration } = cooldownTiming;
    const elapsed = data.worldTime - start;
    const ratio = elapsed / duration;

    if (ratio < 0 || ratio > 1) {
      this.clearCooldown();
      return;
    }

    const remaining = Math.ceil(10 * (duration - elapsed)) / 10; // tick off tenths of a second, never display 0
    const cooldownTime = remaining.toFixed(remaining >= 10 ? 0 : 1);

    if (start !== this.state.cooldownStart) {
      // New cooldown: hand the drain off to CSS, seeking to the current point with a negative delay.
      this.setState({ cooldownStart: start, cooldownDuration: duration, animationDelay: -elapsed, cooldownTime });
    } else if (cooldownTime !== this.state.cooldownTime) {
      // Same cooldown still running: only the displayed number needs updating.
      this.setState({ cooldownTime });
    }
  }

  private clearCooldown(): void {
    if (this.state.cooldownStart !== 0 || this.state.cooldownTime) {
      this.setState({ cooldownStart: 0, cooldownDuration: 0, animationDelay: 0, cooldownTime: '' });
    }
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const abilityStatus = state.abilities.abilities[ownProps.abilityID];
  return {
    ...ownProps,
    abilityStatus
  };
}

export const CooldownOverlay = connect(mapStateToProps)(ACooldownOverlay);
