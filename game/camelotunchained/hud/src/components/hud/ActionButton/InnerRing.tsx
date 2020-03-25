/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { VelocityComponent } from 'velocity-react';
import { styled } from '@csegames/linaria/react';
import { Ring, RingOpts } from 'shared/Ring';
import { ActionBtnProps } from './ActionBtn';

const CountdownWrapper = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;

  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: .5em;

  color: ${(props: {color: string} & React.HTMLProps<HTMLDivElement>) => props.color};
  font-size: 1em;
  line-height: 2em;
  text-shadow: -1px -1px 1px #000, 1px -1px 1px #000, -1px 1px 1px #000, 1px 1px 1px #000;
  filter: brightness(120%);
`;

const ColorOverlay = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background-color: ${(props: {color: string} & React.HTMLProps<HTMLDivElement>) => props.color};
  opacity: 0;
  z-index: 0;
`;

// RING OPTIONS

function defaultInnerBG(theme: Theme): RingOpts {
  return {
    animation: 'none',
    glow: false,
    color: theme.actionButtons.color.bgInnerRing,
    percent: 0.9999,
  };
}

function defaultInnerFG(theme: Theme): RingOpts {
  return {
    animation: 'none',
    glow: false,
    color: theme.actionButtons.color.bgInnerRing,
    percent: 0,
  };
}

function queued_opts(theme: Theme): RingOpts {
  return {
    animation: 'pulse',
    glow: true,
    color: theme.actionButtons.color.queued,
    percent: 0.9999,
  };
}

function prep_opts(percent: number, theme: Theme): RingOpts {
  return {
    animation: 'none',
    glow: false,
    color: theme.actionButtons.color.preparation,
    percent,
  };
}

function channel_opts(percent: number, theme: Theme): RingOpts {
  return {
    animation: 'none',
    glow: false,
    color: theme.actionButtons.color.channelling,
    percent,
  };
}

function held_opts(theme: Theme): RingOpts {
  return {
    animation: 'pulse',
    glow: true,
    color: theme.actionButtons.color.active,
    percent: 0.9999,
  };
}

function recovery_opts(percent: number, theme: Theme): RingOpts {
  return {
    animation: 'none',
    glow: false,
    color: theme.actionButtons.color.recovery,
    percent,
  };
}

function cd_opts(percent: number, theme: Theme): RingOpts {
  return {
    animation: 'none',
    glow: false,
    color: theme.actionButtons.color.coolDown,
    percent,
  };
}

function unavailable_opts(theme: Theme): RingOpts {
  return {
    animation: 'none',
    glow: false,
    color: theme.actionButtons.color.unavailable,
    percent: 0.9999,
  };
}

const pulseOverlayAnim = {
  animation: { opacity: [0.1, 0.3] },
  duration: 750,
  runOnMount: true,
  loop: true,
};

const innerRingStates = (
  AbilityButtonState.Preparation |
  AbilityButtonState.Queued |
  AbilityButtonState.Channel |
  AbilityButtonState.Recovery |
  AbilityButtonState.Cooldown |
  AbilityButtonState.Error |
  AbilityButtonState.Running | // + type modal => modal on
  AbilityButtonState.Held
);

const timedStates = (
  AbilityButtonState.Preparation |
  AbilityButtonState.Channel |
  AbilityButtonState.Recovery |
  AbilityButtonState.Cooldown
);

const colorOverlayStates = (
  AbilityButtonState.Queued |
  AbilityButtonState.Preparation |
  AbilityButtonState.Held |
  AbilityButtonState.Channel |
  AbilityButtonState.Recovery |
  AbilityButtonState.Cooldown
);

interface RingProps extends ActionBtnProps {
  abilityState: ImmutableAbilityState;
  uiContext: UIContext;
}

interface InnerRingState {
  showRing: boolean;
  foreground: RingOpts;
  background: RingOpts;
  color: string;
  overlayColor: string;
  overlayAnim: {
    animation: { opacity: number[] };
    duration: number;
    runOnMount: boolean;
    loop: boolean;
  } | {};

  currentTimer: number;
}

// tslint:disable-next-line:function-name
export class InnerRing extends React.Component<RingProps, InnerRingState> {
  private timerHandle: number;
  constructor(props: RingProps) {
    super(props);

    const theme = props.uiContext.currentTheme();
    const shouldShowRing = this.shouldShowRing(props);
    this.state = {
      showRing: shouldShowRing,
      foreground: defaultInnerFG(theme),
      background: defaultInnerBG(theme),
      color: 'white',
      overlayColor: 'white',
      overlayAnim: {},

      currentTimer: shouldShowRing ? this.getCurrentTimer() : 0,
    };
  }
  public render() {
    const theme = this.props.uiContext.currentTheme();
    const display = this.props.uiContext.isUHD() ? theme.actionButtons.display.uhd : theme.actionButtons.display.hd;

    let showCountDown = this.shouldShowCountdown();
    let seconds = '';

    if (showCountDown) {
      const s = this.state.currentTimer;
      seconds = s >= 10 ? s.toFixed(0) : s.toFixed(1);
      if (s <= 0) showCountDown = false;
    }

    const showColorOverlay = BitFlag.hasBits(this.props.abilityState.status, colorOverlayStates);

    return (
      <>
        {
          showColorOverlay &&
            <VelocityComponent {...this.state.overlayAnim}>
              <ColorOverlay color={this.state.overlayColor} />
            </VelocityComponent>
        }
        <Ring
          strokeWidth={display.ringStrokeWidth}
          radius={display.radius}
          centerOffset={display.radius}
          foreground={this.state.foreground}
          background={this.state.background}
        />
        {
          showCountDown &&
          <CountdownWrapper color={this.state.color}>
            {seconds}
          </CountdownWrapper>
        }
      </>
    );
  }

  public componentDidMount() {
    this.updateRingState(this.getCurrentTimer());
  }

  public componentDidUpdate(prevProps: RingProps) {
    if (prevProps.abilityState.status !== this.props.abilityState.status) {
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

  private shouldShowRing = (props: RingProps) => {
    return BitFlag.hasBits(props.abilityState.status, innerRingStates);
  }

  private shouldShowCountdown = () => {
    return BitFlag.hasBits(this.props.abilityState.status, timedStates);
  }

  private getCurrentTimer = () => {
    return (this.props.abilityState.timing.duration - (game.worldTime - this.props.abilityState.timing.start));
  }

  private getTimerProgress = (currentTimer: number, abilityState: ImmutableAbilityState) => {
    const percent = 1 - Number((1 - (currentTimer / abilityState.timing.duration)).toFixed(3));
    return percent;
  }

  private runTimer = () => {
    const currentTimer = this.getCurrentTimer();

    if (currentTimer <= 0) {
      this.updateRingState(0);
      this.timerHandle = null;
      return;
    }

    this.updateRingState(currentTimer);
    this.timerHandle = window.setTimeout(this.runTimer, 30);
  }

  private updateRingState = (currentTimer: number) => {
    const { abilityState, uiContext } = this.props;
    const theme = uiContext.currentTheme();

    let showRing: boolean = this.shouldShowRing(this.props);
    let foreground = defaultInnerFG(theme);
    let background = defaultInnerBG(theme);
    let color = 'white';
    let overlayColor = 'white';
    let overlayAnim = {};

    if (BitFlag.hasBits(abilityState.status, AbilityButtonState.Preparation)) {
      const percent = 1 - this.getTimerProgress(currentTimer, abilityState);
      foreground = prep_opts(percent, theme);
      color = theme.actionButtons.color.preparation;
      overlayColor = theme.actionButtons.color.preparation;
      overlayAnim = pulseOverlayAnim;
      if (percent >= 1) {
        showRing = false;
      }
    }

    if (BitFlag.hasBits(abilityState.status, AbilityButtonState.Channel)) {
      const percent = this.getTimerProgress(currentTimer, abilityState);
      foreground = channel_opts(percent, theme);
      background = prep_opts(1, theme);
      color = theme.actionButtons.color.channelling;
      overlayColor = theme.actionButtons.color.channelling;
      if (percent >= 1) {
        showRing = false;
      }
    }

    if (BitFlag.hasBits(abilityState.status, AbilityButtonState.Held)) {
      foreground = held_opts(theme);
      color = theme.actionButtons.color.active;
      overlayColor = theme.actionButtons.color.active;
      overlayAnim = pulseOverlayAnim;
    }

    if (BitFlag.hasBits(abilityState.status, AbilityButtonState.Recovery)) {
      const percent = this.getTimerProgress(currentTimer, abilityState);
      foreground = recovery_opts(percent, theme);
      color = theme.actionButtons.color.recovery;
      overlayColor = theme.actionButtons.color.recovery;
      overlayAnim = pulseOverlayAnim;
      if (percent <= 0) {
        showRing = false;
      }
    }

    if (BitFlag.hasBits(abilityState.status, AbilityButtonState.Cooldown)) {
      const percent = this.getTimerProgress(currentTimer, abilityState);
      foreground = cd_opts(percent, theme);
      color = theme.actionButtons.color.coolDown;
      overlayColor = 'rgba(0, 0, 0, 0.2)';
      if (percent <= 0) {
        showRing = false;
      }
    }

    if (BitFlag.hasBits(abilityState.status, AbilityButtonState.Queued)) {
      foreground = queued_opts(theme);
      color = theme.actionButtons.color.queued;
      overlayColor = theme.actionButtons.color.queued;
    }

    if (abilityState.type === AbilityButtonType.Modal &&
      BitFlag.hasBits(abilityState.status, AbilityButtonState.Running)) {
      foreground = {
        animation: 'pulse',
        glow: true,
        color: theme.actionButtons.color.modalOn,
        percent: 1,
      };
    }

    if (BitFlag.hasBits(abilityState.status, AbilityButtonState.Unusable)) {
      foreground = unavailable_opts(theme);
      color = theme.actionButtons.color.unavailable;
      overlayColor = theme.actionButtons.color.unavailable;
    }

    this.setState({ showRing, foreground, background, color, overlayColor, overlayAnim, currentTimer });
  }
}
