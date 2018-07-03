/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';
import {
  events,
  client,
  SkillStateProgression,
  SkillStateStatusEnum,
  SkillStateTypeEnum,
} from '@csegames/camelot-unchained';

import SkillButtonView from './SkillButtonView';
import skillStateConnector from './SkillStateConnector';
import {
  getClassNames,
  makeGlowPathFor,
  SkillStateInfo,
  CLASS_NAMES,
} from './lib';
export * from './lib';

export interface SkillButtonProps {
  skillState?: SkillStateInfo;
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
  startCast: boolean;
  hit: boolean;
}

interface RingTimer {
  event: {
    when: number;
    remaining: number;
    direction: number;
    clockwise: boolean;
  };
}

const INNER = 0;
const OUTER = 1;
const CLOCKWISE = true;
const outer = 'M 29.999 6 A 25 25 0 1 0 30 6 Z';
const inner = 'M 29.999 9 A 22 22 0 1 0 30 9 Z';
const x = 30;
const y = 30;
const outerRadius = 25;
const innerRadius = 22;

class SkillButton extends React.Component<SkillButtonProps, SkillButtonState> {
  private rings: RingTimer[] = [undefined, undefined];
  private listener: any;
  private prevEvent: SkillStateInfo;
  private startCastTimeout: any;
  private hitTimeout: any;
  private outerTimeout: any;
  private innerTimeout: any;

  constructor(props: SkillButtonProps) {
    super(props);
    this.state = {
      outer: {
        current: 0,
      },
      inner: {
        current: 0,
      },
      label: '',
      startCast: false,
      hit: false,
    };
  }

  public render() {
    const props = this.props;
    if (props.skillState && props.skillState.info) {
      // extract button state from props
      const { timing, disruption } = props.skillState;
      const classNames: string[] = getClassNames(props.skillState);
      const outerDirection = this.rings[OUTER] && this.rings[OUTER].event.clockwise;
      const innerDirection = this.rings[INNER] && this.rings[INNER].event.clockwise;

      let outerPath;
      let innerPath;

      // Includes a timer, render timer in outer circle
      if (timing) {
        if (!disruption || disruption.current < disruption.end) {
          innerPath = makeGlowPathFor(timing.end, this.state.inner.current, x, y, innerRadius, innerDirection);
        }
      }

      if (disruption) {
        if (disruption.current >= disruption.end) {
          classNames.push(CLASS_NAMES.INTERRUPTED_STATE);
          innerPath = makeGlowPathFor(500, this.state.inner.current, x, y, innerRadius, innerDirection);
        }
        outerPath = makeGlowPathFor(disruption.end, this.state.outer.current || 0, x, y, outerRadius, outerDirection);
      } else {
        if ((props.skillState.status & SkillStateStatusEnum.Held) ||
            (props.skillState.info.type & SkillStateTypeEnum.Modal)) {
          outerPath = makeGlowPathFor(360, 359.9, x, y, outerRadius, outerDirection);
        } else {
          outerPath = makeGlowPathFor(360, 0, x, y, outerRadius, outerDirection);
        }
      }

      if (this.state.hit) {
        outerPath = makeGlowPathFor(360, 359.9, x, y, outerRadius, outerDirection);
        classNames.push(CLASS_NAMES.HIT_STATE);
      } else if (this.hitTimeout && !this.state.hit) {
        clearTimeout(this.hitTimeout);
        this.hitTimeout = null;
      }

      if (this.state.startCast) {
        outerPath = makeGlowPathFor(360, 359.9, x, y, outerRadius, outerDirection);
        classNames.push(CLASS_NAMES.START_CAST_STATE);
      } else if (this.startCastTimeout && !this.state.startCast) {
        clearTimeout(this.startCastTimeout);
        this.startCastTimeout = null;
      }

      // output button
      return (
        <SkillButtonView
          skillState={this.props.skillState}
          name={this.props.name}
          description={this.props.description}
          timer={this.state.label}
          outer={outer}
          outerPath={outerPath || outer}
          inner={inner}
          innerPath={innerPath || inner}
          className={classNames.join(' ')}
          onSkillClick={this.performAbility}
        />
      );
    }

    return null;
  }

  public componentWillReceiveProps(nextProps: SkillButtonProps) {
    if (!this.listener) {
      const { id } = (nextProps.skillState);
      this.listener = events.on('skillsbutton-' + id, (data: SkillStateInfo) => this.processEvent(data));
    }
  }

  public shouldComponentUpdate(nextProps: SkillButtonProps, nextState: SkillButtonState) {
    return nextProps.index !== this.props.index ||
      nextState.label !== this.state.label ||
      nextState.inner.current !== this.state.inner.current ||
      nextState.outer.current !== this.state.outer.current ||
      !_.isEqual(nextProps.skillState, this.props.skillState) ||
      nextState.startCast !== this.state.startCast ||
      nextState.hit !== this.state.hit;
  }

  public componentWillUnmount() {
    if (this.listener) {
      events.off(this.listener);
      this.listener = null;
    }
  }

  private performAbility = () => {
    client.Attack(this.props.skillState.id);
  }

  private setTimerRing = (info: {
    id: number,
    timer: SkillStateProgression,
    clockwise: boolean,
    shouldPlayHit?: boolean,
    overrideCurrentTimer?: boolean,
  }) => {
    const { id, timer, clockwise, shouldPlayHit, overrideCurrentTimer } = info;
    let ring = this.rings[id];

    if (!ring || overrideCurrentTimer) {
      if (id === OUTER) {
        clearTimeout(this.outerTimeout);
        this.outerTimeout = setTimeout(() => this.ringTimerTick(id, shouldPlayHit), 66);
      }
      if (id === INNER) {
        clearTimeout(this.innerTimeout);
        this.innerTimeout = setTimeout(() => this.ringTimerTick(id, shouldPlayHit), 66);
      }
      ring = this.rings[id] = {
        event: { when: Date.now(), remaining: timer.end - timer.current, direction: 1, clockwise },
      };
      this.setRingState(id, timer.end - timer.current);
    }
  }

  private setDisruptionRing = (info: { id: number, disruption: SkillStateProgression, clockwise: boolean }) => {
    const { id, disruption, clockwise } = info;
    let ring = this.rings[id];
    if (!ring) {
      ring = this.rings[id] = {
        event: { when: disruption.current, remaining: disruption.end - disruption.current, direction: 1, clockwise },
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
    if (id === INNER && this.props.skillState.status & SkillStateStatusEnum.Preparation) {
      events.fire(`skill-button-timer-${this.props.skillState.id}`, current);
    }
    this.setState((state, props) => newState as any);
  }

  private ringTimerTick = (id: number, shouldPlayHit?: boolean) => {
    if (this.rings[id]) {
      const now = Date.now();
      const ring = this.rings[id];
      const elapsed = now - ring.event.when;
      let current = ring.event.remaining - elapsed;
      if (current < 0) {
        current = 0;
      }
      this.setRingState(id, current);
      if (current === 0) {
        this.ringStop(id, shouldPlayHit);
      } else {
        if (this.innerTimeout && id === INNER) {
          this.innerTimeout = setTimeout(() => this.ringTimerTick(id, shouldPlayHit), 66);
        }
        if (this.outerTimeout && id === OUTER) {
          this.outerTimeout = setTimeout(() => this.ringTimerTick(id, shouldPlayHit), 66);
        }
      }
    }
  }

  private ringStop = (id: number, shouldPlayHit?: boolean) => {
    this.setState({ label: '' });
    if (id === OUTER && this.outerTimeout) {
      clearTimeout(this.outerTimeout);
      this.outerTimeout = null;
      this.rings[id] = undefined;
    }
    if (id === INNER && this.innerTimeout) {
      clearTimeout(this.innerTimeout);
      this.innerTimeout = null;
      this.rings[id] = undefined;
    }
    if (shouldPlayHit) {
      this.runHitAnimation();
    }
  }

  private runTimerAnimation = (timing: SkillStateProgression,
                              disruption: SkillStateProgression,
                              isClockwise: boolean,
                              shouldPlayHit?: boolean) => {
    if (timing && (!disruption || disruption.current < disruption.end)) {
      this.setTimerRing({ id: INNER, timer: timing, clockwise: isClockwise, shouldPlayHit });
    }

    if (disruption) {
      if (disruption.current >= disruption.end) {
        this.setTimerRing({ id: INNER, timer: { current: 0, end: 500 }, clockwise: !CLOCKWISE, overrideCurrentTimer: true });
      }

      this.setDisruptionRing({ id: OUTER, disruption, clockwise: !CLOCKWISE });
    }
  }

  private runStartCastAnimation = () => {
    this.setState({ startCast: true });
    this.startCastTimeout = setTimeout(() => this.setState({ startCast: false }), 500);
  }

  private runHitAnimation = () => {
    this.setState({ hit: true });
    this.hitTimeout = setTimeout(() => this.setState({ hit: false }), 250);
  }

  private processEvent = (event: SkillStateInfo) => {
    // Recovery
    if (event.status & SkillStateStatusEnum.Recovery) {
      this.runTimerAnimation(event.timing, null, false);
    }

    // Cooldown
    if (event.status & SkillStateStatusEnum.Cooldown) {
      const now = Date.now();
      const ring = this.rings[INNER];
      if (ring) {
        if (this.prevEvent && !_.isEqual(this.prevEvent.timing, event.timing)) {
          this.rings[INNER] && this.ringStop(INNER);
          this.runTimerAnimation(event.timing, null, false);
          return;
        }

        const elapsed = now - ring.event.when;
        const current = Math.floor(ring.event.remaining - elapsed);
        if (current <= 0) {
          this.rings[INNER] && this.ringStop(INNER);
          this.runTimerAnimation(event.timing, null, false);
        }
      } else {
        this.runTimerAnimation(event.timing, null, false);
      }
    }

    // Channel
    if (event.status & SkillStateStatusEnum.Channel) {
      if (!(this.prevEvent && this.prevEvent.status & SkillStateStatusEnum.Channel)) {
        this.runStartCastAnimation();
      }
      this.runTimerAnimation(event.timing, event.disruption, true, true);
    }

    // Preparation
    if (event.status & SkillStateStatusEnum.Preparation) {
      if (!(this.prevEvent && this.prevEvent.status & SkillStateStatusEnum.Preparation)) {
        this.runStartCastAnimation();
      }
      this.runTimerAnimation(event.timing, event.disruption, true, true);
    }

    // Unusable
    if (event.status & SkillStateStatusEnum.Unusable) {
      if (this.rings[INNER]) {
        this.ringStop(INNER);
      }
    }

    this.prevEvent = event;
  }
}

export default skillStateConnector()(SkillButton);
