/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from 'linaria/react';

import { Ring } from './Ring';
import { CountDown } from './CountDown';
import { Skill } from 'gql/interfaces';

const Container = styled.div`
  position: absolute;
  border-radius: 50%;
  background-color: #ccc;
  ${(props: any) => {
    return `
      width: ${props.radius * 2}px;
      height: ${props.radius * 2}px;
    `;
  }};
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

  color: white;
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
  background: url(/hud-new/images/skills/queued-tick.png) no-repeat;
  background-size: 90%;
`;


export interface AbilityBtnProps extends Skill {
  current: ImmutableAbilityState;
  keybind: string;
  additionalStyles?: React.CSSProperties;
  disableInteractions?: boolean;
}

// tslint:disable-next-line:function-name
export function AbilityBtn(props: AbilityBtnProps) {
  const ui = React.useContext(UIContext); // for some reason this hook doesn't work
  const theme = ui.currentTheme();
  const display = ui.isUHD() ? theme.abilityButtons.display.uhd : theme.abilityButtons.display.hd;

  const queued = (props.current.status & AbilityButtonState.Queued) !== 0;
  const onCD = (props.current.status & AbilityButtonState.Cooldown) !== 0;

  return (
    <Container
      {...display}
      onMouseDown={() => {
        if (props.disableInteractions) return;
        console.log('click ability ' + props.id);
      }}
      style={props.additionalStyles}
    >
      <Icon src={props.icon} />
      <OverlayShadow />

      <KeybindInfo>{props.keybind}</KeybindInfo>

      {queued && <QueuedStateTick />}

      {/* Outer Ring */}
      <Ring
        strokeWidth={display.ringStrokeWidth}
        radius={display.radius}
        centerOffset={display.radius}
        foreground={{
          percent: .5,
          color: 'red',
          animation: 'pulse',
          blur: true,
        }}
        background={{
          percent: 1,
          color: theme.abilityButtons.color.bgOuterRing,
          animation: 'solid',
          blur: false,
        }}
      />

      {/* Inner Ring */}
      <Ring
        strokeWidth={display.ringStrokeWidth}
        radius={display.radius - display.ringStrokeWidth}
        centerOffset={display.radius}
        foreground={{
          percent: .5,
          color: 'yellow',
          animation: 'blink',
          blur: true,
        }}
      />

      {
        onCD && (
          <CountdownWrapper>
            <CountDown
              start={props.current.timing.start}
              duration={props.current.timing.duration}
              hideWhenZero
            />
          </CountdownWrapper>
        )
      }
    </Container>
  );
}

