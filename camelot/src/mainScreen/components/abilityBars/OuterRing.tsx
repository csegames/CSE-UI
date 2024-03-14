/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { connect } from 'react-redux';
import { RootState } from '../../redux/store';
import { Ring, RingOptions } from './Ring';
import { AbilityStateFlags } from '@csegames/library/dist/_baseGame/types/AbilityTypes';
import { Ability } from '../../redux/abilitiesSlice';
import { Theme } from '../../themes/themeConstants';

const outerRingStates =
  AbilityStateFlags.Queued |
  AbilityStateFlags.Preparation |
  AbilityStateFlags.Running | // Modal On?
  AbilityStateFlags.Channel;

interface State {
  foreground: RingOptions;
  background: RingOptions;
  showRing: boolean;
  isActivating: boolean;
}

interface ReactProps {
  abilityStatus: Ability;
}

interface InjectedProps {
  currentTheme: Theme;
}

type Props = ReactProps & InjectedProps;

class AOuterRing extends React.Component<Props, State> {
  private isActivatedTimeout: number;

  constructor(props: Props) {
    super(props);

    const showRing = this.shouldShowRing();
    this.state = {
      foreground: this.buildDefaultOuterFGOptions(),
      background: this.buildDefaultOuterBGOptions(),
      showRing: showRing,
      isActivating: false
    };
  }

  public render() {
    const { display } = this.props.currentTheme.abilityButtons;

    if (!this.shouldShowRing()) {
      return null;
    }

    return (
      <Ring
        strokeWidth={display.ringStrokeWidth}
        radius={display.radius + display.ringStrokeWidth}
        centerOffset={display.radius}
        foreground={{
          ...this.state.foreground,
          animation: this.state.isActivating ? 'blink' : this.state.foreground.animation,
          percent: this.state.isActivating ? 0.99 : this.state.foreground.percent,
          color: this.state.isActivating ? 'yellow' : this.state.foreground.color
        }}
        background={this.state.background}
      />
    );
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.shouldRingUpdate(prevProps)) {
      this.updateRingState();
    }

    const { lastActivated } = this.props.abilityStatus;
    if (lastActivated && lastActivated !== prevProps.abilityStatus.lastActivated) {
      // If there was an old timeout, stop it.
      if (this.isActivatedTimeout) {
        window.clearTimeout(this.isActivatedTimeout);
        this.setState({ isActivating: false });
      }
      const now = new Date().getTime();
      const expiry = lastActivated.getTime() + 500;
      if (now < expiry) {
        // The ability is considered to be "activating" for the first 500ms after its lastActivated timestamp.
        this.setState({ isActivating: true });
        this.isActivatedTimeout = window.setTimeout(() => this.setState({ isActivating: false }), expiry - now);
      }
    }
  }

  private shouldRingUpdate = (prevProps: Props) => {
    const { state, disruption, timing } = this.props.abilityStatus;
    const { state: prevState, disruption: prevDisruption, timing: prevTiming } = prevProps.abilityStatus;
    return (
      state !== prevState ||
      disruption.current !== prevDisruption.current ||
      disruption.max !== prevDisruption.max ||
      timing.duration !== prevTiming.duration ||
      timing.start !== prevTiming.start
    );
  };

  private shouldShowRing = () => {
    return (this.props.abilityStatus.state & outerRingStates) !== 0;
  };

  private updateRingState = () => {
    const { abilityStatus } = this.props;

    let foreground = this.buildDefaultOuterFGOptions();
    const background = this.buildDefaultOuterBGOptions();

    if ((abilityStatus.state & AbilityStateFlags.Queued) !== 0) {
      foreground = {
        animation: 'pulse',
        glow: true,
        color: this.props.currentTheme.abilityButtons.color.queued,
        percent: 1
      };
    }

    if (abilityStatus.disruption?.current > 0) {
      const percent = Number((abilityStatus.disruption.current / abilityStatus.disruption.max).toFixed(3));
      foreground = {
        animation: 'none',
        glow: false,
        color: this.props.currentTheme.abilityButtons.color.disruption,
        percent
      };
    }

    this.setState({ foreground, background });
  };

  private buildDefaultOuterBGOptions(): RingOptions {
    return {
      animation: 'none',
      glow: false,
      color: this.props.currentTheme.abilityButtons.color.bgOuterRing,
      percent: 0.9999
    };
  }

  private buildDefaultOuterFGOptions(): RingOptions {
    return {
      animation: 'none',
      glow: false,
      color: this.props.currentTheme.abilityButtons.color.bgOuterRing,
      percent: 0
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

export const OuterRing = connect(mapStateToProps)(AOuterRing);
