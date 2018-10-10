/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';

import AbilityButtonView, { AbilityButtonInfo } from './AbilityButtonView';
import AbilityStateConnector from './AbilityStateConnector';
import {
  getTimingEnd,
  getDisruptionEnd,
  getClassNames,
  makeGlowPathFor,
  CLASS_NAMES,
} from './lib';
export * from './lib';

export interface AbilityButtonProps {
  ability?: AbilityButtonInfo;
  children?: React.ReactNode;
  name: string;
  description: any;
  index: number;
}

interface RingState {
  current: number;
}

export interface AbilityButtonState {
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

class AbilityButton extends React.Component<AbilityButtonProps, AbilityButtonState> {
  private rings: RingTimer[] = [undefined, undefined];
  private listener: any;
  private prevEvent: AbilityButtonInfo;
  private startCastTimeout: any;
  private hitTimeout: any;
  private outerTimeout: any;
  private innerTimeout: any;

  constructor(props: AbilityButtonProps) {
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
    if (props.ability && props.ability.icon) {
      // extract button state from props
      const { timing, disruption } = props.ability;
      const classNames: string[] = getClassNames(props.ability);
      const outerDirection = this.rings[OUTER] && this.rings[OUTER].event.clockwise;
      const innerDirection = this.rings[INNER] && this.rings[INNER].event.clockwise;

      let outerPath;
      let innerPath;

      // Includes a timer, render timer in outer circle
      const disruptionEnd = getDisruptionEnd(disruption);
      if (timing) {
        if (!disruption || disruption.start < disruptionEnd) {
          // Set timer ring
          innerPath = makeGlowPathFor(getTimingEnd(timing), this.state.inner.current, x, y, innerRadius, innerDirection);
        }
      }

      if (disruption) {
        // Ability has been disrupted, override inner ring with disruption ring and show outer ring effect
        if (disruption.start >= disruptionEnd) {
          classNames.push(CLASS_NAMES.INTERRUPTED_STATE);
          innerPath = makeGlowPathFor(500, this.state.inner.current, x, y, innerRadius, innerDirection);
        }
        outerPath = makeGlowPathFor(disruptionEnd, this.state.outer.current || 0, x, y, outerRadius, outerDirection);
      } else {
        if ((props.ability.status & AbilityButtonState.Held) ||
            (props.ability.type & AbilityButtonType.Modal)) {
          outerPath = makeGlowPathFor(360, 359.9, x, y, outerRadius, outerDirection);
        } else {
          outerPath = makeGlowPathFor(360, 0, x, y, outerRadius, outerDirection);
        }
      }

      if (this.state.hit) {
        // Play hit effect
        outerPath = makeGlowPathFor(360, 359.9, x, y, outerRadius, outerDirection);
        classNames.push(CLASS_NAMES.HIT_STATE);
      } else if (this.hitTimeout && !this.state.hit) {
        clearTimeout(this.hitTimeout);
        this.hitTimeout = null;
      }

      if (this.state.startCast) {
        // Play start cast effect
        outerPath = makeGlowPathFor(360, 359.9, x, y, outerRadius, outerDirection);
        classNames.push(CLASS_NAMES.START_CAST_STATE);
      } else if (this.startCastTimeout && !this.state.startCast) {
        clearTimeout(this.startCastTimeout);
        this.startCastTimeout = null;
      }

      // output button
      return (
        <AbilityButtonView
          ability={this.props.ability}
          name={this.props.name}
          description={this.props.description}
          timer={this.state.label}
          outer={outer}
          outerPath={outerPath || outer}
          inner={inner}
          innerPath={innerPath || inner}
          className={classNames.join(' ')}
          onAbilityClick={this.performAbility}
        />
      );
    }

    return null;
  }

  public componentWillReceiveProps(nextProps: AbilityButtonProps) {
    if (!this.listener) {
      const { id } = (nextProps.ability);
      this.listener = game.on('abilitybutton-' + id, (data: AbilityButtonInfo) => this.processEvent(data));
    }
  }

  public shouldComponentUpdate(nextProps: AbilityButtonProps, nextState: AbilityButtonState) {
    return nextProps.index !== this.props.index ||
      nextState.label !== this.state.label ||
      nextState.inner.current !== this.state.inner.current ||
      nextState.outer.current !== this.state.outer.current ||
      !_.isEqual(nextProps.ability, this.props.ability) ||
      nextState.startCast !== this.state.startCast ||
      nextState.hit !== this.state.hit;
  }

  public componentWillUnmount() {
    if (this.listener) {
      game.off(this.listener);
      this.listener = null;
    }
  }

  private performAbility = () => {
    game.triggerKeyAction(this.props.ability.keybind);
  }

  private setTimerRing = (info: {
    id: number,
    timer: Timing,
    clockwise: boolean,
    shouldPlayHit?: boolean,
    overrideCurrentTimer?: boolean,
  }) => {
    const { id, timer, clockwise, shouldPlayHit, overrideCurrentTimer } = info;
    let ring = this.rings[id];
    const timerEnd = getTimingEnd(timer);

    // Begin a new timer ring animation. If overrideCurrentTimer, then stop current timer, and begin new one.
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
        event: { when: Date.now(), remaining: timerEnd - timer.start, direction: 1, clockwise },
      };
      this.setRingState(id, timerEnd - timer.start);
    }
  }

  private setDisruptionRing = (info: { id: number, disruption: Timing, clockwise: boolean }) => {
    const { id, disruption, clockwise } = info;
    let ring = this.rings[id];
    const disruptionEnd = getDisruptionEnd(disruption);

    // Update disruption ring
    if (!ring) {
      ring = this.rings[id] = {
        event: { when: disruption.start, remaining: disruptionEnd - disruption.start, direction: 1, clockwise },
      };
    } else {
      ring.event = { when: Date.now(), remaining: disruption.start, direction: 1, clockwise };
    }
    this.setRingState(id, disruption.start);
  }

  private setRingState = (id: number, current: number) => {
    const currentTimeLeft = (((current / 100) | 0) / 10);
    const label = currentTimeLeft >= 10 ? currentTimeLeft.toFixed(0) : currentTimeLeft.toFixed(1);

    // Update ring effect data
    const newState = {
      label,
      [id === INNER ? 'inner' : 'outer']: { current },
    };
    this.setState((state, props) => newState as any);

    if (id === INNER && this.props.ability.status & AbilityButtonState.Preparation) {
      // Fire off event for skill queue UI
      game.trigger(`ability-button-timer-${this.props.ability.id}`, current);
    }
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
        // Stop timerTick if no more time left
        this.ringStop(id, shouldPlayHit);
      } else {
        // Recursively run timerTick again
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

  private runTimerAnimation = (timing: Timing,
                              disruption: Timing,
                              isClockwise: boolean,
                              shouldPlayHit?: boolean) => {
    const disruptionEnd = getDisruptionEnd(disruption);
    if (timing && (!disruption || disruption.start < disruptionEnd)) {
      // Run timer animation, skill has not been disrupted
      this.setTimerRing({ id: INNER, timer: timing, clockwise: isClockwise, shouldPlayHit });
    }

    if (disruption) {
      if (disruption.start >= disruptionEnd) {
        // Skill has been disrupted, override the inner ring data with disrupted effect
        this.setTimerRing({ id: INNER, timer: { start: 0, duration: 500 },
          clockwise: !CLOCKWISE, overrideCurrentTimer: true });
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

  private processEvent = (event: AbilityButtonInfo) => {
    // Recovery
    if (event.status & AbilityButtonState.Recovery) {
      this.runTimerAnimation(event.timing, null, false);
    }

    // Cooldown
    if (event.status & AbilityButtonState.Cooldown) {
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
    if (event.status & AbilityButtonState.Channel) {
      if (!(this.prevEvent && this.prevEvent.status & AbilityButtonState.Channel)) {
        this.runStartCastAnimation();
      }
      this.runTimerAnimation(event.timing, event.disruption, true, true);
    }

    // Preparation
    if (event.status & AbilityButtonState.Preparation) {
      if (!(this.prevEvent && this.prevEvent.status & AbilityButtonState.Preparation)) {
        this.runStartCastAnimation();
      }
      this.runTimerAnimation(event.timing, event.disruption, true, true);
    }

    // Unusable
    if (event.status & AbilityButtonState.Unusable) {
      if (this.rings[INNER]) {
        this.ringStop(INNER);
      }
    }

    this.prevEvent = event;
  }
}

export default AbilityStateConnector()(AbilityButton);
