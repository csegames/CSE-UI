/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { SkillStateStatusEnum, SkillStateReasonEnum, SkillStateTypeEnum } from '@csegames/camelot-unchained';
import { css, keyframes } from 'react-emotion';
import { SkillStateInfo } from './index';

export const skillStateColors = {
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

export const blinkStroke = keyframes`
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
  }
`;

export const pulseStroke = keyframes`
  from {
    stroke-opacity: 1;
  }
  to {
    stroke-opacity: 0.25;
  }
`;

export const opacityPulse = keyframes`
  from {
    opacity: 0.3;
  }
  to {
    opacity: 0.1;
  }
`;

export const recoveryBgPulse = keyframes`
  from {
    background: rgba(25, 171, 255, 0.25);
  }
  to {
    background: rgba(25, 171, 255, 0.1);
  }
`;

export const prepBgPulse = keyframes`
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
  box-shadow: inset 5px 5px 1px rgba(255, 255, 255, 0.2), inset 2px 15px 5px rgba(255, 255, 255, 0.2),
    inset -1px -1px 2px rgba(0, 0, 0, 0.5), inset -3px -15px 45px rgba(0, 0, 0, 0.2), 1px 5px 30px -4px rgba(0, 0, 0, 1);
`;

export const pulsingBackground = css`
  ${overlayPseudo}
  background: ${skillStateColors.runningColor};
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
      stroke: ${skillStateColors.readyColor};
      animation: ${blinkStroke} .5s steps(5, end) infinite alternate-reverse;
      -webkit-animation: ${blinkStroke} .5s steps(5, end) infinite alternate-reverse;
    }

    .inner-bg-blur {
      filter: url(#svg-blur);
      stroke: ${skillStateColors.readyColor};
      animation: ${blinkStroke} .5s steps(5, end) infinite alternate-reverse;
      -webkit-animation: ${blinkStroke} .5s steps(5, end) infinite alternate-reverse;
    }
  }
`;

export const StartCastState = css`
  filter: brightness(125%);
  &:active {
    filter: brightness(90%);
  }
  .outer,
  .outer-blur {
    stroke: ${skillStateColors.startCastColor};
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
    background: ${skillStateColors.hitColor};
    opacity: 0.3;
  }
  .outer,
  .outer-blur {
    stroke: ${skillStateColors.hitColor};
    animation: ${blinkStroke} .25s infinite reverse;
    -webkit-animation: ${blinkStroke} .25s infinite reverse;
  }
`;

export const HeldState = css`
  &:before {
    ${pulsingBackground};
  }

  .outer,
  .outer-blur {
    stroke: ${skillStateColors.runningColor};
    animation: ${pulseStroke} .75s infinite alternate-reverse;
    -webkit-animation: ${pulseStroke} .75s infinite alternate-reverse;
  }
`;

export const QueuedState = css`
  .inner,
  .outer,
  .inner-blur,
  .outer-blur {
    stroke: ${skillStateColors.queuedColor};
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
    stroke: ${skillStateColors.runningColor};
    animation: ${blinkStroke} .5s steps(5, end) infinite alternate-reverse;
    -webkit-animation: ${blinkStroke} .5s steps(5, end) infinite alternate-reverse;
  }

  .inner,
  .inner-blur {
    stroke: ${skillStateColors.runningColor};
    filter: url(#svg-blur);
    animation: ${pulseStroke} .75s steps(5, start) infinite alternate;
    -webkit-animation: ${pulseStroke} .75s steps(5, start) infinite alternate;
  }
`;

export const CooldownState = css`
  .inner,
  .inner-blur {
    stroke: ${skillStateColors.cooldownColor};
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
    ${overlayPseudo};
    background: ${skillStateColors.errorColor};
    opacity: 0.3;
  }

  .inner,
  .inner-blur {
    stroke: ${skillStateColors.errorColor};
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
    color: ${skillStateColors.channelColor};
    background: ${skillStateColors.channelColor};
  }

  .inner,
  .inner-blur {
    stroke: ${skillStateColors.channelColor};
  }

  .inner-bg,
  .inner-blur {
    stroke: ${skillStateColors.prepColor};
  }

  .outer,
  .outer-blur {
    stroke: ${skillStateColors.disruptionColor};
  }
`;

export const RecoveryState = css`
  .skill-timing-overlay {
    animation: ${recoveryBgPulse} .75s steps(5, start) infinite alternate;
    -webkit-animation: ${recoveryBgPulse} .75s steps(5, start) infinite alternate;
  }

  .inner,
  .inner-blur {
    stroke: ${skillStateColors.recoveryColor};
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
    stroke: ${skillStateColors.prepColor};
  }

  .inner-bg {
    stroke: #000;
  }

  .outer,
  .outer-blur {
    stroke: ${skillStateColors.disruptionColor};
  }
`;

export const InterruptedState = css`
  &:before {
    ${overlayPseudo};
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
    background:   url(http://i.imgur.com/1WihOuv.png);
    background-size: cover;
    z-index: 3;
    box-shadow: initial;
  }

  .outer {
    stroke: ${skillStateColors.modalColor};
  }

  .inner,
  .inner-blur,
  .outer-blur {
    stroke: ${skillStateColors.modalColor};
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
    ${overlayPseudo};
    background-image: url(''), linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3));
    background-repeat: no-repeat, no-repeat;
    background-position: 50% 10px, center;
    background-size: 70% 70%, cover;
    filter: hue-rotate(-40deg);
  }

  &:hover:before {
    ${overlayPseudo};
    background-image: url(''), linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0));
    background-repeat: no-repeat, no-repeat;
    background-position: 50% 10px, center;
    background-size: 70% 70%, cover;
    filter: hue-rotate(-40deg);
  }

  .inner-bg {
    stroke: ${skillStateColors.unavailableColor};
  }
`;

export const NoAmmoState = css`
  &:before {
    background-image: url('http://i.imgur.com/0cDKwT6.png'),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3));
  }

  &:hover:before {
    background-image: url('http://i.imgur.com/0cDKwT6.png'),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0));
  }
`;

export const NoWeaponState = css`
  &:before {
    background-image: url('http://i.imgur.com/vc171Co.png'),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3));
  }

  &:hover:before {
    background-image: url('http://i.imgur.com/vc171Co.png'),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0));
  }
`;

export const getClassNames = (skillState: SkillStateInfo) => {
  const classNames: string[] = [];
  if (skillState.info.type === SkillStateTypeEnum.Modal) {
    classNames.push(ModalState);
  }
  const status = skillState.status;
  const reason = skillState.reason;
  if (status & SkillStateStatusEnum.Unusable) {
    classNames.push(UnavailableState);
    if (reason & SkillStateReasonEnum.NoAmmo) {
      classNames.push(NoAmmoState);
    }
    if (reason & SkillStateReasonEnum.NoWeapon) {
      classNames.push(NoWeaponState);
    }
  }

  if (status & SkillStateStatusEnum.Ready) {
    classNames.push(ReadyState);
  }

  if (status & SkillStateStatusEnum.Error) {
    classNames.push(ErrorState);
  }

  if (status & SkillStateStatusEnum.Queued) {
    classNames.push(QueuedState);
  }

  if (status & SkillStateStatusEnum.Cooldown) {
    classNames.push(CooldownState);
  }

  if (status & SkillStateStatusEnum.Channel) {
    classNames.push(ChannelState);
  }

  if (status & SkillStateStatusEnum.Recovery) {
    classNames.push(RecoveryState);
  }

  if (status & SkillStateStatusEnum.Preparation) {
    classNames.push(PreparationState);
  }

  if (status & SkillStateStatusEnum.Running ! & SkillStateStatusEnum.Preparation ! & SkillStateStatusEnum.Channel) {
    classNames.push(RunningState);
  }

  if (status & SkillStateStatusEnum.Held) {
    classNames.push(HeldState);
  }

  return classNames;
};
