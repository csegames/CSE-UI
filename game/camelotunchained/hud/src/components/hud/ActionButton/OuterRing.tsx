/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { isEqual } from 'lodash';
import { Ring, RingOpts } from 'shared/Ring';
import { ActionBtnProps } from './ActionBtn';

function defaultOuterBG(theme: Theme): RingOpts {
  return {
    animation: 'none',
    glow: false,
    color: theme.actionButtons.color.bgOuterRing,
    percent: 0.9999,
  };
}

function defaultOuterFG(theme: Theme): RingOpts {
  return {
    animation: 'none',
    glow: false,
    color: theme.actionButtons.color.bgOuterRing,
    percent: 0,
  };
}

const outerRingStates = (
  AbilityButtonState.Queued |
  AbilityButtonState.Preparation |
  AbilityButtonState.Running | // Modal On?
  AbilityButtonState.Channel
);

interface Props extends ActionBtnProps {
  abilityState: ImmutableAbilityState;
  uiContext: UIContext;
  isActivating: boolean;
}

interface State {
  foreground: RingOpts;
  background: RingOpts;
  showRing: boolean;
}

// tslint:disable-next-line:function-name
export class OuterRing extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const theme = props.uiContext.currentTheme();
    const showRing = this.shouldShowRing();
    this.state = {
      foreground: defaultOuterFG(theme),
      background: defaultOuterBG(theme),
      showRing: showRing,
    };
  }

  public render() {
    const { uiContext } = this.props;
    const theme = uiContext.currentTheme();
    const display = uiContext.isUHD() ? theme.actionButtons.display.uhd : theme.actionButtons.display.hd;

    if (!this.shouldShowRing()) {
      return null;
    }

    if (this.props.isActivating) {
      console.log('IS ACTIVATING');
    } else {
      console.log('IS NOT ACTIVATING');
    }

    return (
      <Ring
        strokeWidth={display.ringStrokeWidth}
        radius={display.radius + display.ringStrokeWidth}
        centerOffset={display.radius}
        foreground={{
          ...this.state.foreground,
          animation: this.props.isActivating ? 'blink' : this.state.foreground.animation,
          percent: this.props.isActivating ? 0.99 : this.state.foreground.percent,
          color: this.props.isActivating ? 'yellow' : this.state.foreground.color,
        }}
        background={this.state.background}
      />
    );
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.shouldRingUpdate(prevProps)) {
      this.updateRingState();
    }
  }

  private shouldRingUpdate = (prevProps: Props) => {
    return prevProps.abilityState.status !== this.props.abilityState.status ||
      !CurrentMax.equals(prevProps.abilityState.disruption, this.props.abilityState.disruption) ||
      !isEqual(prevProps.abilityState.timing, this.props.abilityState.timing);
  }

  private shouldShowRing = () => {
    return BitFlag.hasBits(this.props.abilityState.status, outerRingStates);
  }

  private updateRingState = () => {
    const { abilityState } = this.props;
    const theme = this.props.uiContext.currentTheme();

    let foreground = defaultOuterFG(theme);
    const background = defaultOuterBG(theme);

    if (abilityState.type === AbilityButtonType.Modal &&
      BitFlag.hasBits(abilityState.status, AbilityButtonState.Running)) {
      foreground = {
        animation: 'none',
        glow: true,
        color: theme.actionButtons.color.modalOn,
        percent: 1,
      };
    }

    if (BitFlag.hasBits(abilityState.status, AbilityButtonState.Queued)) {
      foreground = {
        animation: 'pulse',
        glow: true,
        color: theme.actionButtons.color.queued,
        percent: 1,
      };
    }

    if (abilityState.disruption && abilityState.disruption.current > 0) {
      const percent = Number(CurrentMax.percent(abilityState.disruption).toFixed(3));
      foreground = {
        animation: 'none',
        glow: false,
        color: theme.actionButtons.color.disruption,
        percent,
      };
    }

    this.setState({ foreground, background })
  }
}
