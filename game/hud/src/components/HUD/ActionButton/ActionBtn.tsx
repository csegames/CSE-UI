/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState, useEffect } from 'react';
import { styled } from '@csegames/linaria/react';
import { VelocityComponent } from 'velocity-react';

import { Ring, RingOpts } from './Ring';
import { Ability } from 'gql/interfaces';

type ContainerProps = { radius: number; acceptInput: boolean; } & React.HTMLProps<HTMLDivElement>;
const Container = styled.div`
  pointer-events: ${(props: ContainerProps) => props.acceptInput ? 'all' : 'none'};
  position: absolute;
  border-radius: 50%;
  background-color: #ccc;
  width: ${(props: ContainerProps) => props.radius * 2}px;
  height: ${(props: ContainerProps) => props.radius * 2}px;
  left: 0;
  top: 0;
`;

const Icon = styled.img`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 100%;
`;

const OverlayShadow = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  border-radius: 100%;
  box-shadow: inset 5px 5px 1px rgba(255, 255, 255, 0.2),
    inset 2px 15px 5px rgba(255, 255, 255, 0.2),
    inset -1px -1px 2px rgba(0, 0, 0, 0.5),
    inset -3px -15px 45px rgba(0, 0, 0, 0.2),
    1px 5px 30px -4px rgba(0, 0, 0, 1);
`;

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

const KeybindInfo = styled.div`
  position: absolute;
  bottom: 0;
  left: 0;
  height: 100%;
  width: 100%;
  color: #ececec;
  text-align: center;
  display: flex;
  align-items: flex-end;
  justify-content: center;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0) 30px, rgba(0, 0, 0, 0) 30px);
  border-radius: 0 0 600% 600%;
  font-weight: 600;
  text-shadow: -2px -2px 2px #000, 2px -2px 2px #000, -2px 2px 2px #000, 2px 2px 2px #000;
  font-size: 0.5em;
  line-height: 1em;
  padding-bottom: 0.5em;
`;

const QueuedStateTick = styled.div`
  position: absolute;
  top: -2px;
  left: -2px;
  width: 120%;
  height: 120%;
  z-index: 3;
  border-radius: 0;
  box-shadow: initial;
  background: url(../images/skills/queued-tick.png) no-repeat;
  background-size: 90%;
`;

const ColorOverlay = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  border-radius: 50%;
  background-color: ${(props: {color: string} & React.HTMLProps<HTMLDivElement>) => props.color};
`;

// RING OPTIONS

function defaultInnerBG(theme: Theme): RingOpts {
  return {
    animation: 'none',
    glow: false,
    color: theme.actionButtons.color.bgInnerRing,
    percent: 0,
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

function defaultOuterBG(theme: Theme): RingOpts {
  return {
    animation: 'none',
    glow: false,
    color: theme.actionButtons.color.bgOuterRing,
    percent: 100,
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

function queued_opts(theme: Theme): RingOpts {
  return {
    animation: 'pulse',
    glow: true,
    color: theme.actionButtons.color.queued,
    percent: 100,
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
    percent: 100,
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
    percent: 100,
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

// tslint:disable-next-line:function-name
export function InnerRing(props: ActionBtnProps) {
  const ui = React.useContext(UIContext);
  const theme = ui.currentTheme();
  const display = ui.isUHD() ? theme.actionButtons.display.uhd : theme.actionButtons.display.hd;

  let showRing = BitFlag.hasBits(props.current.status, innerRingStates);

  const [current, setCurrent] = useState(showRing ?
    (props.current.timing.duration - (Date.now() - props.current.timing.start)) : 0);

  useEffect(() => {
    if (current > 0) {
      const timeout = Math.min(current, 100);
      const handle = setTimeout(() => setCurrent(current - timeout), timeout);
      return () => {
        clearTimeout(handle);
      };
    }
  });

  if (!showRing) {
    return null;
  }

  let foreground = defaultInnerFG(theme);
  let background = defaultInnerBG(theme);
  let color = 'white';
  let overlayColor = 'white';
  let overlayAnim = {};

  if (BitFlag.hasBits(props.current.status, AbilityButtonState.Preparation)) {
    const percent = Number((1 - (current / props.current.timing.duration)).toFixed(3));
    foreground = prep_opts(percent, theme);
    color = theme.actionButtons.color.preparation;
    overlayColor = theme.actionButtons.color.preparation;
    overlayAnim = pulseOverlayAnim;
    if (percent >= 1) {
      showRing = false;
    }
  }

  if (BitFlag.hasBits(props.current.status, AbilityButtonState.Channel)) {
    const percent = Number((1 - (current / props.current.timing.duration)).toFixed(3));
    foreground = channel_opts(percent, theme);
    background = prep_opts(100, theme);
    color = theme.actionButtons.color.channelling;
    overlayColor = theme.actionButtons.color.channelling;
    if (percent >= 1) {
      showRing = false;
    }
  }

  if (BitFlag.hasBits(props.current.status, AbilityButtonState.Held)) {
    foreground = held_opts(theme);
    color = theme.actionButtons.color.active;
    overlayColor = theme.actionButtons.color.active;
    overlayAnim = pulseOverlayAnim;
  }

  if (BitFlag.hasBits(props.current.status, AbilityButtonState.Recovery)) {
    const percent = Number(((current / props.current.timing.duration)).toFixed(3));
    foreground = recovery_opts(percent, theme);
    color = theme.actionButtons.color.recovery;
    overlayColor = theme.actionButtons.color.recovery;
    overlayAnim = pulseOverlayAnim;
    if (percent <= 0) {
      showRing = false;
    }
  }

  if (BitFlag.hasBits(props.current.status, AbilityButtonState.Cooldown)) {
    const percent = Number(((current / props.current.timing.duration)).toFixed(3));
    foreground = cd_opts(percent, theme);
    color = theme.actionButtons.color.coolDown;
    overlayColor = 'rgba(0, 0, 0, 0.2)';
    if (percent <= 0) {
      showRing = false;
    }
  }

  if (BitFlag.hasBits(props.current.status, AbilityButtonState.Unusable)) {
    foreground = unavailable_opts(theme);
    color = theme.actionButtons.color.unavailable;
    overlayColor = theme.actionButtons.color.unavailable;
  }

  if (BitFlag.hasBits(props.current.status, AbilityButtonState.Queued)) {
    foreground = queued_opts(theme);
    color = theme.actionButtons.color.queued;
    overlayColor = theme.actionButtons.color.queued;
  }

  if (props.current.type === AbilityButtonType.Modal &&
    BitFlag.hasBits(props.current.status, AbilityButtonState.Running)) {
    foreground = {
      animation: 'pulse',
      glow: true,
      color: theme.actionButtons.color.modalOn,
      percent: 1,
    };
  }

  if (!showRing) {
    return null;
  }

  let showCountDown = BitFlag.hasBits(props.current.status, timedStates);
  let seconds = '';

  if (showCountDown) {
    const s = current / 1000;
    seconds = s >= 10 ? s.toFixed(0) : s.toFixed(1);
    if (s <= 0) showCountDown = false;
  }

  const showColorOverlay = BitFlag.hasBits(props.current.status, colorOverlayStates);

  return (
    <>
      {
        showColorOverlay &&
          <VelocityComponent {...overlayAnim}>
            <ColorOverlay color={overlayColor} />
          </VelocityComponent>
      }
      <Ring
        strokeWidth={display.ringStrokeWidth}
        radius={display.radius - display.ringStrokeWidth}
        centerOffset={display.radius}
        foreground={foreground}
        background={background}
      />
      {
        showCountDown &&
        <CountdownWrapper color={color}>
          {seconds}
        </CountdownWrapper>
      }
    </>
  );
}

const outerRingStates = (
  AbilityButtonState.Queued |
  AbilityButtonState.Preparation |
  AbilityButtonState.Running | // Modal On?
  AbilityButtonState.Channel
);

// tslint:disable-next-line:function-name
export function OuterRing(props: ActionBtnProps) {
  const ui = React.useContext(UIContext);
  const theme = ui.currentTheme();
  const display = ui.isUHD() ? theme.actionButtons.display.uhd : theme.actionButtons.display.hd;

  const showRing = BitFlag.hasBits(props.current.status, outerRingStates);

  const [current, setCurrent] = useState(showRing ?
    (props.current.timing.duration - (Date.now() - props.current.timing.start)) : 0);

  useEffect(() => {
    if (current > 0) {
      const timeout = Math.min(current, 100);
      const handle = setTimeout(() => setCurrent(current - timeout), timeout);
      return () => {
        clearTimeout(handle);
      };
    }
  });

  if (!showRing) {
    return null;
  }

  let foreground = defaultOuterFG(theme);
  const background = defaultOuterBG(theme);

  if (props.current.type === AbilityButtonType.Modal &&
    BitFlag.hasBits(props.current.status, AbilityButtonState.Running)) {
    foreground = {
      animation: 'none',
      glow: true,
      color: theme.actionButtons.color.modalOn,
      percent: 1,
    };
  }

  if (BitFlag.hasBits(props.current.status, AbilityButtonState.Queued)) {
    foreground = {
      animation: 'pulse',
      glow: true,
      color: theme.actionButtons.color.queued,
      percent: 1,
    };
  }

  if (props.current.disruption && props.current.disruption.current > 0) {
    const percent = Number(CurrentMax.percent(props.current.disruption).toFixed(3));
    foreground = {
      animation: 'none',
      glow: false,
      color: theme.actionButtons.color.disruption,
      percent,
    };
  }

  return (
    <Ring
      strokeWidth={display.ringStrokeWidth}
      radius={display.radius - display.ringStrokeWidth}
      centerOffset={display.radius}
      foreground={foreground}
      background={background}
    />
  );
}


export interface ActionBtnProps extends Ability {
  current: ImmutableAbilityState;
  keybind: string;
  additionalStyles?: React.CSSProperties;
  disableInteractions?: boolean;
}

// tslint:disable-next-line:function-name
export function ActionBtn(props: ActionBtnProps) {
  const ui = React.useContext(UIContext);
  const theme = ui.currentTheme();
  const display = ui.isUHD() ? theme.actionButtons.display.uhd : theme.actionButtons.display.hd;

  const queued = (props.current.status & AbilityButtonState.Queued) !== 0;

  return (
    <Container
      {...display}
      acceptInput={!props.disableInteractions}
      onMouseDown={() => {
        if (props.disableInteractions) return;
        console.log('click ability ' + props.id);
      }}
      style={props.additionalStyles}
    >
      <Icon src={props.icon} />
      <OverlayShadow />
      <KeybindInfo>{props.keybind}</KeybindInfo>
      <InnerRing {...props} />
      <OuterRing {...props} />
      {queued && <QueuedStateTick />}
    </Container>
  );
}

