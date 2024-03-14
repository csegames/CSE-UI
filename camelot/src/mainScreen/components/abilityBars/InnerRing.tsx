/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dispatch } from '@reduxjs/toolkit';
import * as React from 'react';
import { Ability } from '../../redux/abilitiesSlice';
import { Ring, RingOptions } from './Ring';
import { AbilityStateFlags } from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import { RootState } from '../../redux/store';
import { connect } from 'react-redux';
import { Theme } from '../../themes/themeConstants';
import { game } from '@csegames/library/dist/_baseGame';

// Styles
const ColorOverlay = 'HUD-InnerRing-ColorOverlay';
const CountdownWrapper = 'HUD-InnerRing-CountdownWrapper';

// RING OPTIONS

const innerRingStates =
  AbilityStateFlags.Preparation |
  AbilityStateFlags.Queued |
  AbilityStateFlags.Channel |
  AbilityStateFlags.Recovery |
  AbilityStateFlags.Cooldown |
  AbilityStateFlags.Error |
  AbilityStateFlags.Running | // + type modal => modal on
  AbilityStateFlags.Held;

const timedStates =
  AbilityStateFlags.Preparation | AbilityStateFlags.Channel | AbilityStateFlags.Recovery | AbilityStateFlags.Cooldown;

const colorOverlayStates =
  AbilityStateFlags.Queued |
  AbilityStateFlags.Preparation |
  AbilityStateFlags.Held |
  AbilityStateFlags.Channel |
  AbilityStateFlags.Recovery |
  AbilityStateFlags.Cooldown;

interface State {
  showRing: boolean;
  foreground: RingOptions;
  background: RingOptions;
  color: string;
  overlayColor: string;
  overlayAnimClass: string;

  currentTimer: number;
}

interface ReactProps {
  abilityStatus: Ability;
}

interface InjectedProps {
  currentTheme: Theme;
  dispatch?: Dispatch;
}

type Props = ReactProps & InjectedProps;

class AInnerRing extends React.Component<Props, State> {
  private timerHandle: number;
  constructor(props: Props) {
    super(props);

    const shouldShowRing = this.shouldShowRing(props);
    this.state = {
      showRing: shouldShowRing,
      foreground: this.buildDefaultInnerFGOptions(),
      background: this.buildDefaultInnerBGOptions(),
      color: 'white',
      overlayColor: 'white',
      overlayAnimClass: '',

      currentTimer: shouldShowRing ? this.getCurrentTimer() : 0
    };
  }

  public render() {
    const { display } = this.props.currentTheme.abilityButtons;

    let showCountDown = this.shouldShowCountdown();
    let seconds = '';

    if (showCountDown) {
      const s = this.state.currentTimer;
      seconds = s >= 10 ? s.toFixed(0) : s.toFixed(1);
      if (s <= 0) showCountDown = false;
    }

    const showColorOverlay = (this.props.abilityStatus.state & colorOverlayStates) !== 0;

    return (
      <>
        {showColorOverlay && (
          <div
            className={`${ColorOverlay} ${this.state.overlayAnimClass}`}
            style={{ backgroundColor: this.state.overlayColor }}
          />
        )}
        <Ring
          strokeWidth={display.ringStrokeWidth}
          radius={display.radius}
          centerOffset={display.radius}
          foreground={this.state.foreground}
          background={this.state.background}
        />
        {showCountDown && (
          <div className={CountdownWrapper} style={{ color: this.state.color }}>
            {seconds}
          </div>
        )}
      </>
    );
  }

  public componentDidMount() {
    this.updateRingState(this.getCurrentTimer());
  }

  public componentDidUpdate(prevProps: ReactProps) {
    if (
      prevProps.abilityStatus.state !== this.props.abilityStatus.state ||
      prevProps.abilityStatus.timing.start !== this.props.abilityStatus.timing.start
    ) {
      this.updateRingState(this.getCurrentTimer());

      if (this.shouldShowCountdown()) {
        if (this.timerHandle) {
          window.clearTimeout(this.timerHandle);
          this.timerHandle = null;
        }

        this.runTimer();
      }
    }
  }

  public componentWillUnmount() {
    if (this.timerHandle) {
      window.clearTimeout(this.timerHandle);
      this.timerHandle = null;
    }
  }

  private shouldShowRing = (props: ReactProps) => {
    return (props.abilityStatus.state & innerRingStates) !== 0;
  };

  private shouldShowCountdown = () => {
    return (this.props.abilityStatus.state & timedStates) !== 0;
  };

  private getCurrentTimer = () => {
    return this.props.abilityStatus.timing.duration - (game.worldTime - this.props.abilityStatus.timing.start);
  };

  private getTimerProgress = (currentTimer: number, abilityState: Ability) => {
    const percent = 1 - Number((1 - currentTimer / abilityState.timing.duration).toFixed(3));
    return percent;
  };

  private runTimer = () => {
    const currentTimer = this.getCurrentTimer();

    if (currentTimer <= 0) {
      this.updateRingState(0);
      this.timerHandle = null;
      return;
    }

    this.updateRingState(currentTimer);
    this.timerHandle = window.setTimeout(this.runTimer, 30);
  };

  private updateRingState = (currentTimer: number) => {
    const { abilityStatus: abilityState, currentTheme } = this.props;

    let showRing: boolean = this.shouldShowRing(this.props);
    let foreground = this.buildDefaultInnerFGOptions();
    let background = this.buildDefaultInnerBGOptions();
    let color = 'white';
    let overlayColor = 'white';
    let overlayAnimClass = '';

    if ((abilityState.state & AbilityStateFlags.Preparation) !== 0) {
      const percent = 1 - this.getTimerProgress(currentTimer, abilityState);
      foreground = this.buildPreparationOptions(percent);
      color = currentTheme.abilityButtons.color.preparation;
      overlayColor = currentTheme.abilityButtons.color.preparation;
      overlayAnimClass = 'pulse';
      if (percent >= 1) {
        showRing = false;
      }
    }

    if ((abilityState.state & AbilityStateFlags.Channel) !== 0) {
      const percent = this.getTimerProgress(currentTimer, abilityState);
      foreground = this.buildChannelingOptions(percent);
      background = this.buildPreparationOptions(1);
      color = currentTheme.abilityButtons.color.channelling;
      overlayColor = currentTheme.abilityButtons.color.channelling;
      if (percent >= 1) {
        showRing = false;
      }
    }

    if ((abilityState.state & AbilityStateFlags.Held) !== 0) {
      foreground = this.buildHeldOptions();
      color = currentTheme.abilityButtons.color.active;
      overlayColor = currentTheme.abilityButtons.color.active;
      overlayAnimClass = 'pulse';
    }

    if ((abilityState.state & AbilityStateFlags.Recovery) !== 0) {
      const percent = this.getTimerProgress(currentTimer, abilityState);
      foreground = this.buildRecoveryOptions(percent);
      color = currentTheme.abilityButtons.color.recovery;
      overlayColor = currentTheme.abilityButtons.color.recovery;
      overlayAnimClass = 'pulse';
      if (percent <= 0) {
        showRing = false;
      }
    }

    if ((abilityState.state & AbilityStateFlags.Cooldown) !== 0) {
      const percent = this.getTimerProgress(currentTimer, abilityState);
      foreground = this.buildCooldownOptions(percent);
      color = currentTheme.abilityButtons.color.coolDown;
      overlayColor = 'rgba(0, 0, 0, 0.2)';
      if (percent <= 0) {
        showRing = false;
      }
    }

    if ((abilityState.state & AbilityStateFlags.Queued) !== 0) {
      foreground = this.buildQueuedOptions();
      color = currentTheme.abilityButtons.color.queued;
      overlayColor = currentTheme.abilityButtons.color.queued;
    }

    if ((abilityState.state & AbilityStateFlags.Unusable) !== 0) {
      foreground = this.buildUnavailableOptions();
      color = currentTheme.abilityButtons.color.unavailable;
      overlayColor = currentTheme.abilityButtons.color.unavailable;
    }

    this.setState({ showRing, foreground, background, color, overlayColor, overlayAnimClass, currentTimer });
  };

  private buildDefaultInnerBGOptions(): RingOptions {
    return {
      animation: 'none',
      glow: false,
      color: this.props.currentTheme.abilityButtons.color.bgInnerRing,
      percent: 0.9999
    };
  }

  private buildDefaultInnerFGOptions(): RingOptions {
    return {
      animation: 'none',
      glow: false,
      color: this.props.currentTheme.abilityButtons.color.bgInnerRing,
      percent: 0
    };
  }

  private buildQueuedOptions(): RingOptions {
    return {
      animation: 'pulse',
      glow: true,
      color: this.props.currentTheme.abilityButtons.color.queued,
      percent: 0.9999
    };
  }

  private buildPreparationOptions(percent: number): RingOptions {
    return {
      animation: 'none',
      glow: false,
      color: this.props.currentTheme.abilityButtons.color.preparation,
      percent
    };
  }

  private buildChannelingOptions(percent: number): RingOptions {
    return {
      animation: 'none',
      glow: false,
      color: this.props.currentTheme.abilityButtons.color.channelling,
      percent
    };
  }

  private buildHeldOptions(): RingOptions {
    return {
      animation: 'pulse',
      glow: true,
      color: this.props.currentTheme.abilityButtons.color.active,
      percent: 0.9999
    };
  }

  private buildRecoveryOptions(percent: number): RingOptions {
    return {
      animation: 'none',
      glow: false,
      color: this.props.currentTheme.abilityButtons.color.recovery,
      percent
    };
  }

  private buildCooldownOptions(percent: number): RingOptions {
    return {
      animation: 'none',
      glow: false,
      color: this.props.currentTheme.abilityButtons.color.coolDown,
      percent
    };
  }

  private buildUnavailableOptions(): RingOptions {
    return {
      animation: 'none',
      glow: false,
      color: this.props.currentTheme.abilityButtons.color.unavailable,
      percent: 0.9999
    };
  }
}

function mapStateToProps(state: RootState, ownProps: ReactProps): Props {
  const { currentTheme } = state.themes;
  return {
    ...ownProps,
    currentTheme
  };
}

export const InnerRing = connect(mapStateToProps)(AInnerRing);
