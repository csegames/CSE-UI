
/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import { events, client, Tooltip } from 'camelot-unchained';
import styled, { css, keyframes, cx } from 'react-emotion';

import { SkillState, Progress, skillStateColors } from './skillState';
import withOldSkillButton from './OldSkillButton';
export * from './skillState';

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

const bgPulse = keyframes`
  from {
    background-color: rgba(${skillStateColors.channelColor}, 0.8);
  }
  to {
    background-color: rgba(${skillStateColors.channelColor}, 0.25);
  }
`;

const prepBgPulse = keyframes`
  from {
    background-color: rgba(${skillStateColors.channelColor}, 0.25);
  }
  to {
    background-color: rgba(${skillStateColors.channelColor}, 0.1);
  }
`;

const overlayPseudo = css`
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

const pulsingBackground = css`
  ${overlayPseudo}
  background: ${skillStateColors.holdColor};
  animation: ${opacityPulse} .75s steps(5, start) infinite alternate;
  -webkit-animation: ${opacityPulse} .75s steps(5, start) infinite alternate;
`;

const timingPseudo = css`
  ${overlayPseudo};
  content: attr(data-timer);
  display: flex;
  justify-content: center;
  font-size: 1em;
  line-height: 2em;
  text-shadow: -1px -1px 1px #000, 1px -1px 1px #000, -1px 1px 1px #000, 1px 1px 1px #000;
  color: white;
  filter: brightness(120%);
`;

const ReadyState = css`
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

const StartCastState = css`
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

const QueuedState = css`
  .inner,
  .outer,
  .inner-blur,
  .outer-blur {
    stroke: ${skillStateColors.queuedColor};
    animation: ${pulseStroke} .75s steps(2, start) infinite alternate-reverse;
    -webkit-animation: ${pulseStroke} .75s steps(2, start) infinite alternate-reverse;
  }

  &:before {
    content: "";
    position: absolute;
    top: -2px;
    left: -2px;
    width: 120%;
    height: 120%;
    background: url(http://i.imgur.com/U4GWSJN.png);
    background-size: cover;
    z-index: 3;
    border-radius: 0;
    box-shadow: initial;
  }
`;

const HoldState = css`
  filter: brightness(125%);
  &:before {
    ${pulsingBackground}
  }
  .inner-bg {
    stroke: ${skillStateColors.holdColor};
    animation: ${blinkStroke} .5s steps(5, end) infinite alternate-reverse;
    -webkit-animation: ${blinkStroke} .5s steps(5, end) infinite alternate-reverse;
  }

  .inner,
  .inner-blur {
    stroke: ${skillStateColors.holdColor};
    filter: url(#svg-blur);
    animation: ${pulseStroke} .75s steps(5, start) infinite alternate;
    -webkit-animation: ${pulseStroke} .75s steps(5, start) infinite alternate;
  }
`;

const CooldownState = css`
  .inner,
  .inner-blur {
    stroke: ${skillStateColors.cooldownColor};
    opacity: .5;
  }
  &:before {
    ${timingPseudo};
    background: rgba(0, 0, 0, 0.6);
  }
  &.hold:before {
    ${pulsingBackground}
  }
`;

const ErrorState = css`
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

const ChannelState = css`
  filter: brightness(125%);
  &:before {
    ${timingPseudo}
    color: ${skillStateColors.channelColor};
    animation: ${bgPulse} .75s steps(5, start) infinite alternate;
    -webkit-animation: ${bgPulse} .75s steps(5, start) infinite alternate;
  }

  .inner,
  .inner-blur {
    stroke: ${skillStateColors.channelColor};
  }

  .inner-bg {
    stroke: #000;
  }

  .outer,
  .outer-blur {
    stroke: ${skillStateColors.disruptionColor};
  }
`;

const RecoveryState = css`
  &:before {
    ${timingPseudo};
    color: ${skillStateColors.recoveryColor};
    animation: ${bgPulse} .75s steps(5, start) infinite alternate;
    -webkit-animation: ${bgPulse} .75s steps(5, start) infinite alternate;
  }

  .inner,
  .inner-blur {
    stroke: ${skillStateColors.recoveryColor};
  }

  .inner-bg {
    stroke: #000;
  }
`;

const PreparationState = css`
  filter: brightness(125%);
  &:before {
    ${timingPseudo};
    color: ${skillStateColors.prepColor};
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

const InterruptedState = css`
  ${overlayPseudo};
  background-color: rgba(255, 0, 0, 0.2);
`;

const ModalState = css`
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

const UnavailableState = css`
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

const NoAmmoState = css`
  &:before {
    background-image: url('http://i.imgur.com/0cDKwT6.png'),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3));
  }

  &:hover:before {
    background-image: url('http://i.imgur.com/0cDKwT6.png'),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0));
  }
`;

const NoWeaponState = css`
  &:before {
    background-image: url('http://i.imgur.com/vc171Co.png'),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.3));
  }

  &:hover:before {
    background-image: url('http://i.imgur.com/vc171Co.png'),
      linear-gradient(to bottom, rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0));
  }
`;

const Button = styled('div')`
  position: relative;
  width: 50px;
  height: 50px;
  flex-grow: 0;
  flex-shrink: 0;
  border: 1px solid #111;
  border-radius: 100%;
  background-size: contain;
  pointer-events: all;
  cursor: pointer;

  &:hover,
  &:active {
    border: 1px solid rgba(0, 0, 0, 0.8);
    box-shadow: 0 0 10px 1px rgba(0, 0, 0, 0.5);
  }

  &:after {
    content: attr(data-keybind);
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
    padding-bottom: 5px;
    background: linear-gradient(to top, rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0) 30px, rgba(0, 0, 0, 0) 30px);
    border-radius: 0 0 600% 600%;
    font-weight: 600;
    text-shadow: -2px -2px 2px #000, 2px -2px 2px #000, -2px 2px 2px #000, 2px 2px 2px #000;
    font-size: 0.6em;
  }

  .inner-bg {
    stroke: transparent;
    transition: all 0.2s ease-in-out;
    -webkit-transition: all 0.2s ease-in-out;
  }

  .outer-bg {
    stroke: #111;
  }

  svg {
    position: absolute;
    left: -5px;
    top: -5px;
    z-index: 1;
    pointer-events: none;
  }
`;

const TooltipHeader = styled('header')`
  font-size: 22px;
  font-weight: 700;
`;

// Arc logic
const PIo180 = Math.PI / 180;

function getRadius(d: number) {
  return d * PIo180;
}

function p2c(x: number, y: number, radius: number, angle: number) {
  const radians = getRadius(angle - 90);
  return {
    x: x + (radius * Math.cos(radians)),
    y: y + (radius * Math.sin(radians)),
  };
}

function time2circleDegrees(current: number, end: number) {
  return current / end * 360;
}

function arc2path(x: number, y: number, radius: number, startAngle: number, endAngle: number) {
  endAngle -= 0.0001;
  const end = p2c(x, y, radius, startAngle);
  const start = p2c(x, y, radius, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return ['M', start.x, start.y, 'A', radius, radius, 0, large, 0, end.x, end.y].join(' ');
}

function makeGlowPathFor(layer: 'outer' | 'inner',
                          end: number,
                          current: number,
                          x: number,
                          y: number,
                          radius: number,
                          clockwise: boolean) {
  // generate outerPath for percent curve
  const degrees = time2circleDegrees(current, end);
  const path = arc2path(x, y, radius, 0, clockwise ? 360 - degrees : degrees);
  return path;
}

// Skill Button Component

export interface SkillButtonProps {
  skillState?: SkillState;
  children?: React.ReactNode;
  name: string;
  description: any;
  index: number;
}

interface RingState {
  current: number;
}

export interface SkillButtonState {
  outer: RingState;
  inner: RingState;
  label: string;
}

interface RingTimer {
  event: {
    when: number;
    remaining: number;
    direction: number;
    clockwise: boolean;
  };
  timer: any;
}

const INNER = 0;
const OUTER = 1;
const CLOCKWISE = true;

class SkillButton extends React.PureComponent<SkillButtonProps, SkillButtonState> {

  private rings: RingTimer[] = [undefined, undefined];
  private listener: any;

  constructor(props: SkillButtonProps) {
    super(props);
    this.state = this.initialState();
  }

  public render() {

    const props = this.props;
    if (props.skillState && props.skillState.info) {
      // extract button state from props
      const { id, info } = props.skillState;
      const { icon, type, /* track, */ keybind } = info;
      const { status } = props.skillState;

      // Why 'as any'?? Because they don't exist on every skillState. We check later down if these exist.
      const { reason, timing, disruption } = props.skillState as any;

      const custom = { backgroundImage: 'url(' + icon + ')' };

      const outer = 'M 29.999 6 A 25 25 0 1 0 30 6 Z';
      const inner = 'M 29.999 9 A 22 22 0 1 0 30 9 Z';

      const classNames: string[] = [type, ...this.getClassNames(props.skillState)];
      switch (status) {
        case 'unusable':
          classNames.push(reason);
          break;
      }

      const x = 30;
      const y = 30;
      const outerRadius = 25;
      const innerRadius = 22;
      const outerDirection = this.rings[OUTER] && this.rings[OUTER].event.clockwise;
      const innerDirection = this.rings[INNER] && this.rings[INNER].event.clockwise;

      let outerPath;
      let innerPath;

      // Includes a timer, render timer in outer circle
      if (timing) {
        if (!disruption || disruption.current < disruption.end) {
          innerPath = makeGlowPathFor('inner', timing.end, this.state.inner.current, x, y, innerRadius, innerDirection);
        }
      }
      if (disruption) {
        if (disruption.current >= disruption.end) {
          classNames.push('interrupted');
          innerPath = makeGlowPathFor('inner', 500, this.state.inner.current, x, y, innerRadius, innerDirection);
        }
        outerPath = makeGlowPathFor('outer', disruption.end, this.state.outer.current, x, y, outerRadius, outerDirection);
      }
      // output button
      return (
        <Tooltip
          styles={{
            Tooltip: {
              margin: '5px',
            },
            tooltip: {
              backgroundColor: 'rgba(0,0,0,0.9)',
              minWidth: '200px',
              maxWidth: '300px',
              maxHeight: '750px',
              whiteSpace: 'wrap',
            },
          }}
          content={() => (
            <div>
              <TooltipHeader>{this.props.name}</TooltipHeader>
              <div dangerouslySetInnerHTML={{ __html: this.props.description }} />
            </div>
          )}
        >
          <Button
            id={id}
            className={cx(classNames)}
            style={custom}
            data-keybind={keybind}
            data-timer={this.state.label}
            onClick={this.performAbility}
          >
            <svg width='100' height='100'>
              <path d={outer} fill='none' strokeWidth='3px' className='outer-bg-blur'></path>
              <path d={outer} fill='none' strokeWidth='3px' className='outer-bg'></path>
              <path d={outerPath || outer} fill='none' strokeWidth='3px' className='outer-blur'></path>
              <path d={outerPath || outer} fill='none' strokeWidth='3px' className='outer'></path>
              <path d={inner} fill='none' strokeWidth='3px' className='inner-bg-blur'></path>
              <path d={inner} fill='none' strokeWidth='3px' className='inner-bg'></path>
              <path d={innerPath || inner} fill='none' strokeWidth='3px' className='inner-blur'></path>
              <path d={innerPath || inner} fill='none' strokeWidth='3px' className='inner'></path>
            </svg>
          </Button>
        </Tooltip>
      );
    }

    return null;
  }

  public componentWillReceiveProps(nextProps: SkillButtonProps) {
    if (!this.listener) {
      const { id } = (nextProps.skillState);
      this.listener = events.on('skillsbutton-' + id, (data: SkillState) => this.processEvent(data));
    }
  }

  public componentWillUnmount() {
    if (this.listener) {
      events.off(this.listener);
      this.listener = null;
    }
  }

  private initialState() {
    return {
      outer: {
        current: 0,
      },
      inner: {
        current: 0,
      },
      label: '',
    };
  }

  private performAbility = () => {
    const hexId = parseInt(this.props.skillState.id, 10).toString(16);
    client.Attack(hexId);
  }

  private setTimerRing = (id: number, timer: Progress, clockwise: boolean) => {
    // console.log('SKILLBUTTON: INIT: RING ' + id + ' TIMER ' + JSON.stringify(timer));
    let ring = this.rings[id];
    if (!ring) {
      ring = this.rings[id] = {
        event: { when: Date.now(), remaining: timer.end - timer.current, direction: 1, clockwise },
        timer: setInterval(() => this.ringTimerTick(id), 66),
      };
    } else {
      ring.event = { when: Date.now(), remaining: timer.current, direction: 1, clockwise };
    }
    this.setRingState(id, timer.current);
  }

  private setDisruptionRing = (id: number, disruption: Progress, clockwise: boolean) => {
    let ring = this.rings[id];
    if (!ring) {
      ring = this.rings[id] = {
        event: { when: disruption.current, remaining: disruption.end - disruption.current, direction: 1, clockwise },
        timer: disruption.end - disruption.current,
      };
    } else {
      ring.event = { when: Date.now(), remaining: disruption.current, direction: 1, clockwise };
    }
    this.setRingState(id, disruption.current);
  }

  private setRingState = (id: number, current: number) => {
    const currentTimeLeft = (((current / 100) | 0) / 10);
    const label = currentTimeLeft >= 10 ? currentTimeLeft.toFixed(0) : currentTimeLeft.toFixed(1);
    const newState = {
      label,
      [id === INNER ? 'inner' : 'outer']: { current },
    };
    this.setState((state, props) => newState as any);
  }

  private ringTimerTick = (id: number) => {
    const now = Date.now();
    const ring = this.rings[id];
    const elapsed = now - ring.event.when;
    let current = ring.event.remaining - elapsed;
    if (current < 0) current = 0;
    this.setRingState(id, current);
    if (current === 0) this.ringStop(id);
  }

  private ringStop = (id: number) => {
    const ring = this.rings[id];
    clearInterval(ring.timer);
    ring.timer = null;
    this.rings[id] = undefined;
  }

  private onStatusChange = (timing: Progress, disruption: Progress, isClockwise: boolean) => {
    if (timing && (!disruption || disruption.current < disruption.end)) {
      this.setTimerRing(INNER, timing, isClockwise);
    }

    if (disruption) {
      if (disruption.current >= disruption.end) {
        this.ringStop(INNER);
        this.setTimerRing(INNER, { current: 0, end: 500 }, !CLOCKWISE);
      }

      this.setDisruptionRing(OUTER, disruption, !CLOCKWISE);
    }
  }

  private processEvent = (event: any) => {
    if (_.includes(event.status, 'cooldown')) {
      const now = Date.now();
      const ring = this.rings[INNER];
      if (ring) {
        const elapsed = now - ring.event.when;
        const current = Math.floor(ring.event.remaining - elapsed);
        if (current <= 0) {
          this.rings[INNER] && this.ringStop(INNER);
          this.onStatusChange(event.timing, null, false);
        }
      } else {
        this.onStatusChange(event.timing, null, false);
      }
    }

    switch (event.status) {
      case 'channel': {
        this.onStatusChange(event.timing, event.disruption, true);
        break;
      }

      case 'preparation': {
        this.onStatusChange(event.timing, event.disruption, true);
        break;
      }

      case 'recovery': {
        this.onStatusChange(event.timing, null, false);
        break;
      }

      default: break;
    }
  }

  private getClassNames = (skillState: any) => {
    const classNames = [];
    if (skillState.info.type === 'modal') {
      classNames.push(ModalState);
    }

    const status = skillState.status.toLowerCase();
    if (_.includes(status, 'unavailabe')) {
      classNames.push(UnavailableState);
      if (skillState.reason === 'noammo') {
        classNames.push(NoAmmoState);
      }
      if (skillState.reason === 'noweapon') {
        classNames.push(NoWeaponState);
      }
    }

    if (_.includes(status, 'ready')) {
      classNames.push(ReadyState);
    }

    if (_.includes(status, 'error')) {
      classNames.push(ErrorState);
    }

    if (_.includes(status, 'queued')) {
      classNames.push(QueuedState);
    }

    if (_.includes(status, 'cooldown')) {
      classNames.push(CooldownState);
    }

    if (_.includes(status, 'hold')) {
      classNames.push(HoldState);
    }

    if (_.includes(status, 'channel')) {
      classNames.push(ChannelState);
    }

    if (_.includes(status, 'interrupted')) {
      classNames.push(InterruptedState);
    }

    if (_.includes(status, 'recovery')) {
      classNames.push(RecoveryState);
    }

    if (_.includes(status, 'preparation')) {
      classNames.push(PreparationState);
    }

    if (_.includes(status, 'startcast')) {
      classNames.push(StartCastState);
    }

    return classNames;
  }
}

export default withOldSkillButton()(SkillButton);
