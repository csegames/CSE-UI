/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';

import { ContextMenu } from 'shared/ContextMenu';
import AbilityButtonView, { AbilityButtonInfo } from './AbilityButtonView';
import AbilityStateConnector from './AbilityStateConnector';
import {
  getTimingEnd,
  getClassNames,
  makeGlowPathFor,
  CLASS_NAMES,
} from './lib';
import { webAPI } from '@csegames/camelot-unchained';
import { AbilityContextMenu } from './AbilityContextMenu';
export * from './lib';

declare const toastr: any;

export interface AbilityButtonProps {
  abilityInfo: AbilityButtonInfo;
  children?: React.ReactNode;
  name: string;
  description: any;
  index: number;
  numberOfAbilities: number;
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
  private updateHandle: EventHandle;
  private activateHandle: EventHandle;
  private prevEvent: AbilityButtonInfo;
  private startCastTimeout: any;
  private hitTimeout: any;
  private outerTimeout: any;
  private innerTimeout: any;
  private innerRingTimingEnd: number = 0;
  private outerRingTimingEnd: number = 0;

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
    if (props.abilityInfo) {
      // extract button state from props
      const { timing, disruption } = props.abilityInfo;
      const classNames: string[] = getClassNames(props.abilityInfo);
      const outerDirection = this.rings[OUTER] && this.rings[OUTER].event.clockwise;
      const innerDirection = this.rings[INNER] && this.rings[INNER].event.clockwise;

      let outerPath;
      let innerPath;
      // Includes a timer, render timer in outer circle
      if (timing && this.innerRingTimingEnd > 0) {
        if (!disruption || disruption.max === 0 || disruption.current < disruption.max) {
          // Set timer ring
          innerPath = makeGlowPathFor(this.innerRingTimingEnd, this.state.inner.current, x, y, innerRadius, innerDirection);
        }
      }

      if (disruption && disruption.max > 0) {
        // Ability has been disrupted, override inner ring with disruption ring and show outer ring effect
        if (disruption.current >= disruption.max) {
          classNames.push(CLASS_NAMES.INTERRUPTED_STATE);
          innerPath = makeGlowPathFor(500, this.state.inner.current, x, y, innerRadius, innerDirection);
        }
        outerPath = makeGlowPathFor(disruption.max, this.state.outer.current || 0, x, y, outerRadius, outerDirection);
      } else {
        if ((props.abilityInfo.status & AbilityButtonState.Held) ||
            (props.abilityInfo.type & AbilityButtonType.Modal)) {
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
        this.props.numberOfAbilities > 1 ?
        <ContextMenu
          type='content'
          getContent={() => <AbilityContextMenu onDeleteClick={() => this.onDeleteClick(this.props.abilityInfo.id)} />}>
          <div>
            <AbilityButtonView
              ability={this.props.abilityInfo}
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
          </div>
        </ContextMenu> :
          <div>
            <AbilityButtonView
              ability={this.props.abilityInfo}
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
          </div>
      );
    }

    return null;
  }

  public componentDidMount() {
    this.activateHandle = game.abilityStates[this.props.abilityInfo.id].onActivated(this.handleClientActivation);
  }

  public componentWillReceiveProps(nextProps: AbilityButtonProps) {
    if (!this.updateHandle && nextProps.abilityInfo && typeof nextProps.abilityInfo.id === 'number') {
      this.updateHandle = game.abilityStates[nextProps.abilityInfo.id].onUpdated(this.processEvent);
    }
  }

  public shouldComponentUpdate(nextProps: AbilityButtonProps, nextState: AbilityButtonState) {
    return nextProps.index !== this.props.index ||
      nextState.label !== this.state.label ||
      nextState.inner.current !== this.state.inner.current ||
      nextState.outer.current !== this.state.outer.current ||
      !_.isEqual(nextProps.abilityInfo, this.props.abilityInfo) ||
      nextState.startCast !== this.state.startCast ||
      nextState.hit !== this.state.hit;
  }

  public componentWillUnmount() {
    if (this.updateHandle) {
      this.updateHandle.clear();
      this.updateHandle = null;
    }

    if (this.activateHandle) {
      this.activateHandle.clear();
      this.activateHandle = null;
    }
  }

  private handleClientActivation = () => {
    this.runStartCastAnimation();
  }

  private performAbility = () => {
    game.triggerKeyAction(this.props.abilityInfo.keyActionID);
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

    // Begin a new timer ring animation. If overrideCurrentTimer, then stop current timer, and begin new one.
    if (!ring || overrideCurrentTimer) {
      if (id === OUTER) {
        clearTimeout(this.outerTimeout);
        this.outerTimeout = setTimeout(() => this.ringTimerTick(id, shouldPlayHit), 66);
        this.outerRingTimingEnd = getTimingEnd(timer);
        ring = this.rings[id] = {
          event: { when: Date.now(), remaining: this.outerRingTimingEnd, direction: 1, clockwise },
        };
        this.setRingState(id, this.outerRingTimingEnd);
      }
      if (id === INNER) {
        clearTimeout(this.innerTimeout);
        this.innerTimeout = setTimeout(() => this.ringTimerTick(id, shouldPlayHit), 66);
        this.innerRingTimingEnd = getTimingEnd(timer);
        ring = this.rings[id] = {
          event: { when: Date.now(), remaining: this.innerRingTimingEnd, direction: 1, clockwise },
        };
        this.setRingState(id, this.innerRingTimingEnd);
      }
    }
  }

  private setDisruptionRing = (info: { id: number, disruption: CurrentMax, clockwise: boolean }) => {
    const { id, disruption, clockwise } = info;
    let ring = this.rings[id];
    const disruptionEnd = disruption.max;

    // Update disruption ring
    if (!ring) {
      ring = this.rings[id] = {
        event: { when: disruption.current, remaining: disruptionEnd - disruption.current, direction: 1, clockwise },
      };
    } else {
      ring.event = { when: Date.now(), remaining: disruption.current, direction: 1, clockwise };
    }
    this.setRingState(id, disruption.current);
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

    if (id === INNER && this.props.abilityInfo.status & AbilityButtonState.Preparation) {
      // Fire off event for skill queue UI
      game.trigger(`ability-button-timer-${this.props.abilityInfo.id}`, current, this.innerRingTimingEnd);
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
      this.outerRingTimingEnd = 0;
    }
    if (id === INNER && this.innerTimeout) {
      clearTimeout(this.innerTimeout);
      this.innerTimeout = null;
      this.rings[id] = undefined;
      this.innerRingTimingEnd = 0;
    }
    if (shouldPlayHit) {
      this.runHitAnimation();
    }
  }

  private runTimerAnimation = (timing: Timing,
                              disruption: CurrentMax,
                              isClockwise: boolean,
                              shouldPlayHit?: boolean,
                              overrideCurrentTimer?: boolean) => {
    if (timing && (!disruption || disruption.current < disruption.max)) {
      // Run timer animation, skill has not been disrupted
      this.setTimerRing({ id: INNER, timer: timing, clockwise: isClockwise, shouldPlayHit, overrideCurrentTimer });
    }

    if (disruption) {
      if (disruption.current >= disruption.max) {
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
    // Cooldown
    if (event.status & AbilityButtonState.Cooldown) {
      const ring = this.rings[INNER];
      if (!ring || !this.prevEvent || !(this.prevEvent.status & AbilityButtonState.Cooldown)) {
        this.runTimerAnimation(event.timing, null, false, false, true);
      }
    }

    // Recovery
    if (event.status & AbilityButtonState.Recovery) {
      this.runTimerAnimation(event.timing, null, false, false, true);
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

    this.prevEvent = { ...event };
  }

  private onDeleteClick = async (abilityID: number) => {
    const res = await webAPI.AbilitiesAPI.DeleteAbility(
      webAPI.defaultConfig,
      game.shardID,
      game.selfPlayerState.characterID,
      abilityID,
    );

    if (res.ok) {
      game.store.refetch();
    } else {
      const errorMessage = JSON.parse(res.data).FieldCodes[0].AbilityResult.Details;
      toastr.error(errorMessage, 'Oh no!!', { timeout: 3000 });
    }
  }
}

export default AbilityStateConnector()(AbilityButton);
