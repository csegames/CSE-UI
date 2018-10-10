/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { css, keyframes } from 'react-emotion';
import { AbilityButtonInfo } from '../AbilityButtonView';

const MODAL_STATE = 'modalState';
const UNAVAILABLE_STATE = 'unavailableState';
const NO_AMMO_STATE = 'noAmmoState';
const NO_WEAPON_STATE = 'noWeaponState';
const READY_STATE = 'readyState';
const ERROR_STATE = 'errorState';
const QUEUED_STATE = 'queuedState';
const COOLDOWN_STATE = 'cooldownState';
const CHANNEL_STATE = 'channelState';
const RECOVERY_STATE = 'recoveryState';
const PREPARATION_STATE = 'preparationState';
const RUNNING_STATE = 'runningState';
const HELD_STATE = 'heldState';
const START_CAST_STATE = 'startCastState';
const HIT_STATE = 'hitState';
const INTERRUPTED_STATE = 'interruptedState';

export const CLASS_NAMES = {
  MODAL_STATE,
  UNAVAILABLE_STATE,
  NO_AMMO_STATE,
  NO_WEAPON_STATE,
  READY_STATE,
  ERROR_STATE,
  QUEUED_STATE,
  COOLDOWN_STATE,
  CHANNEL_STATE,
  RECOVERY_STATE,
  PREPARATION_STATE,
  RUNNING_STATE,
  HELD_STATE,
  START_CAST_STATE,
  HIT_STATE,
  INTERRUPTED_STATE,
};

export const abilityStateColors = {
  unavailableColor: '#C1000E',
  readyColor: 'cyan',
  startCastColor: '#ffdf00',
  errorColor: 'red',
  activeColor: '#ffdf00',
  queuedColor: '#FF7C24',
  prepColor: '#FF9F19',
  cooldownColor: 'white',
  disruptionColor: '#d700ff',
  recoveryColor: '#19abff',
  hitColor: '#fff570',
  runningColor: '#fff570',
  channelColor: '#C5FFC5',
  modalColor: '#aaa',
};

const blinkStroke = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

const pulseStroke = keyframes`
  from {
    stroke-opacity: 1;
  }
  to {
    stroke-opacity: 0.25;
  }
`;

const opacityPulse = keyframes`
  from {
    opacity: 0.3;
  }
  to {
    opacity: 0.1;
  }
`;

const recoveryBgPulse = keyframes`
  from {
    background: rgba(25, 171, 255, 0.25);
  }
  to {
    background: rgba(25, 171, 255, 0.1);
  }
`;

const prepBgPulse = keyframes`
  from {
    background: rgba(255, 159, 25, 0.25);
  }
  to {
    background: rgba(255, 159, 25, 0.1);
  }
`;

export const overlayPseudo = css`
  content: "";
  border-radius: 100%;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  box-shadow: inset 5px 5px 1px rgba(255, 255, 255, 0.2),
    inset 2px 15px 5px rgba(255, 255, 255, 0.2),
    inset -1px -1px 2px rgba(0, 0, 0, 0.5),
    inset -3px -15px 45px rgba(0, 0, 0, 0.2),
    1px 5px 30px -4px rgba(0, 0, 0, 1);
`;

const pulsingBackground = css`
  ${overlayPseudo};
  background: $runningColor;
  animation: ${opacityPulse} .75s steps(5, start) infinite alternate;
  -webkit-animation: ${opacityPulse} .75s steps(5, start) infinite alternate;
`;

export const ReadyState = css`
  &:hover {
    filter: brightness(130%);
  }
  &:active {
    filter: brightness(90%);

    .inner-bg {
      stroke: ${abilityStateColors.readyColor};
      animation: ${blinkStroke} .5s steps(5, end) infinite alternate-reverse;
      -webkit-animation: ${blinkStroke} .5s steps(5, end) infinite alternate-reverse;
    }

    .inner-bg-blur {
      filter: url(#svg-blur);
      stroke: ${abilityStateColors.readyColor};
      animation: ${blinkStroke} .5s steps(5, end) infinite alternate-reverse;
      -webkit-animation: ${blinkStroke} .5s steps(5, end) infinite alternate-reverse;
    }
  }
`;

export const HeldState = css`
  &:before {
    ${pulsingBackground}
  }

  .outer,
  .outer-blur {
    stroke: ${abilityStateColors.runningColor};
    animation: ${pulseStroke} .75s infinite alternate-reverse;
    -webkit-animation: ${pulseStroke} .75s infinite alternate-reverse;
  }
`;

export const QueuedState = css`
  .inner,
  .outer,
  .inner-blur,
  .outer-blur {
    stroke: ${abilityStateColors.queuedColor};
    animation: ${pulseStroke} .75s steps(2, start) infinite alternate-reverse;
    -webkit-animation: ${pulseStroke} .75s steps(2, start) infinite alternate-reverse;
  }
`;

export const RunningState = css`
  filter: brightness(125%);
  &:before {
    ${pulsingBackground}
  }
  .inner-bg {
    stroke: $runningColor;
    animation: blinkStroke .5s steps(5, end) infinite alternate-reverse;
    -webkit-animation: blinkStroke .5s steps(5, end) infinite alternate-reverse;
  }

  .inner,
  .inner-blur {
    stroke: ${abilityStateColors.runningColor};
    filter: url(#svg-blur);
    animation: ${pulseStroke} .75s steps(5, start) infinite alternate;
    -webkit-animation: ${pulseStroke} .75s steps(5, start) infinite alternate;
  }
`;

export const CooldownState = css`
  .inner,
  .inner-blur {
    stroke: ${abilityStateColors.cooldownColor};
    opacity: .5;
  }
  .skill-timing-overlay {
    background: rgba(0, 0, 0, 0.6);
  }
  &.hold:before {
    ${pulsingBackground}
  }
`;

export const ErrorState = css`
  &:before {
    ${overlayPseudo}
    background: $errorColor;
    opacity: 0.3;
  }

  .inner,
  .inner-blur {
    stroke: ${abilityStateColors.errorColor};
    animation: ${blinkStroke} .25s infinite;
    -webkit-animation: ${blinkStroke} .25s infinite;
  }

  .inner-blur {
    filter: url(#svg-blur);
  }
`;

export const ChannelState = css`
  filter: brightness(125%);
  .skill-timing-overlay {
    color: ${abilityStateColors.channelColor};
    background: ${abilityStateColors.channelColor};
  }

  .inner,
  .inner-blur {
    stroke: ${abilityStateColors.channelColor};
  }

  .inner-bg,
  .inner-blur {
    stroke: ${abilityStateColors.prepColor};
  }

  .outer,
  .outer-blur {
    stroke: ${abilityStateColors.disruptionColor};
  }
`;

export const RecoveryState = css`
  .skill-timing-overlay {
    animation: ${recoveryBgPulse} .75s steps(5, start) infinite alternate;
    -webkit-animation: ${recoveryBgPulse} .75s steps(5, start) infinite alternate;
  }

  .inner,
  .inner-blur {
    stroke: ${abilityStateColors.recoveryColor};
  }

  .inner-bg {
    stroke: #000;
  }
`;

export const PreparationState = css`
  filter: brightness(125%);
  .skill-timing-overlay {
    animation: ${prepBgPulse} .75s steps(5, start) infinite alternate;
    -webkit-animation: ${prepBgPulse} .75s steps(5, start) infinite alternate;
  }

  .inner,
  .inner-blur {
    stroke: ${abilityStateColors.prepColor};
  }

  .inner-bg {
    stroke: #000;
  }

  .outer,
  .outer-blur {
    stroke: ${abilityStateColors.disruptionColor};
  }
`;

export const StartCastState = css`
  filter: brightness(125%);
  &:active {
    filter: brightness(90%);
  }
  .outer,
  .outer-blur {
    stroke: ${abilityStateColors.startCastColor};
    animation: ${blinkStroke} .25s infinite reverse;
    -webkit-animation: ${blinkStroke} .25s infinite reverse;
  }
`;

export const HitState = css`
  filter: brightness(125%);
  &:active {
    filter: brightness(90%);
  }
  &:before {
    background: ${abilityStateColors.hitColor};
    opacity: 0.3;
  }
  .outer,
  .outer-blur {
    stroke: ${abilityStateColors.hitColor};
    animation: ${blinkStroke} .25s infinite reverse;
    -webkit-animation: ${blinkStroke} .25s infinite reverse;
  }
`;

export const InterruptedState = css`
  &:before {
    ${overlayPseudo}
    background-color: rgba(255, 0, 0, 0.2);
  }
`;

export const ModalState = css`
  &:before {
    content: "";
    position: absolute;
    top: -5px;
    left: -3px;
    width: 110%;
    height: 110%;
    background: url(images/skills/queued-tick.png);
    background-size: cover;
    z-index: 3;
    box-shadow: initial;
  }

  .outer {
    stroke: ${abilityStateColors.modalColor};
  }

  .inner,
  .inner-blur,
  .outer-blur {
    stroke: ${abilityStateColors.modalColor};
    animation: ${pulseStroke} .75s steps(5, start) infinite alternate;
    -webkit-animation: ${pulseStroke} .75s steps(5, start) infinite alternate;
    filter: url(#svg-blur);
  }
`;

export const UnavailableState = css`
  filter: brightness(70%);
  &:hover {
    filter: brightness(90%);
    cursor: not-allowed;
  }

  &:before {
    ${overlayPseudo}
    background-image: url(''), linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3));
    background-repeat: no-repeat, no-repeat;
    background-position: 50% 10px, center;
    background-size: 70% 70%, cover;
    filter: hue-rotate(-40deg);
  }

  &:hover:before {
    ${overlayPseudo}
    background-image: url(''), linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0));
    background-repeat: no-repeat, no-repeat;
    background-position: 50% 10px, center;
    background-size: 70% 70%, cover;
    filter: hue-rotate(-40deg);
  }

  .inner-bg {
    stroke: ${abilityStateColors.unavailableColor};
  }
`;

export const NoAmmoState = css`
  &:before {
    background-image: url(images/skills/no-arrow.png),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3));
  }

  &:hover:before {
    background-image: url(images/skills/no-arrow.png),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0));
  }
`;

export const NoWeaponState = css`
  &:before {
    background-image: url(images/skills/no-weapon.png),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3));
  }

  &:hover:before {
    background-image: url(images/skills/no-weapon.png),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0));
  }
`;

export const getClassNames = (abilityState: AbilityButtonInfo) => {
  const classNames: string[] = [];
  if (abilityState.type === AbilityButtonType.Modal) {
    classNames.push(MODAL_STATE);
  }
  const status = abilityState.status;
  const reason = abilityState.error;
  if (status & AbilityButtonState.Unusable) {
    classNames.push(UNAVAILABLE_STATE);
    if (reason & AbilityButtonErrorFlag.NoAmmo) {
      classNames.push(NO_AMMO_STATE);
    }
    if (reason & AbilityButtonErrorFlag.NoWeapon) {
      classNames.push(NO_WEAPON_STATE);
    }
  }

  if (status & AbilityButtonState.Ready) {
    classNames.push(READY_STATE);
  }

  if (status & AbilityButtonState.Error) {
    classNames.push(ERROR_STATE);
  }

  if (status & AbilityButtonState.Queued) {
    classNames.push(QUEUED_STATE);
  }

  if (status & AbilityButtonState.Cooldown) {
    classNames.push(COOLDOWN_STATE);
  }

  if (status & AbilityButtonState.Channel) {
    classNames.push(CHANNEL_STATE);
  }

  if (status & AbilityButtonState.Recovery) {
    classNames.push(RECOVERY_STATE);
  }

  if (status & AbilityButtonState.Preparation) {
    classNames.push(PREPARATION_STATE);
  }

  if (status & AbilityButtonState.Running ! & AbilityButtonState.Preparation ! & AbilityButtonState.Channel) {
    classNames.push(RUNNING_STATE);
  }

  if (status & AbilityButtonState.Held) {
    classNames.push(HELD_STATE);
  }

  return classNames;
};
