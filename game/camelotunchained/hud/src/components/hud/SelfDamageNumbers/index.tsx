/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { generateID } from 'redux-typed-modules';
import { Status } from './Status';
import { NegativeNumber } from './NegativeNumber';
import { PositiveNumber } from './PositiveNumber';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region Container constants
export const SELF_DAMAGE_NUMBERS_WIDTH = 1200;
export const SELF_DAMAGE_NUMBERS_HEIGHT = 500;
// #endregion
const Container = styled.div`
  pointer-events: none;
  display: flex;
  width: ${SELF_DAMAGE_NUMBERS_WIDTH}px;
  height: ${SELF_DAMAGE_NUMBERS_HEIGHT}px;
  overflow: hidden;
  -webkit-mask-image: linear-gradient(to bottom, rgba(0, 0, 0, 1) 70%, rgba(0, 0, 0, 0));

  @media (max-width: 2560px) {
    width: ${SELF_DAMAGE_NUMBERS_WIDTH * MID_SCALE}px;
    height: ${SELF_DAMAGE_NUMBERS_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${SELF_DAMAGE_NUMBERS_WIDTH * HD_SCALE}px;
    height: ${SELF_DAMAGE_NUMBERS_HEIGHT * HD_SCALE}px;
  }
`;

const SectionContainer = styled.div`
  flex: ${(props: { flex: number } & React.HTMLProps<HTMLDivElement>) => props.flex};
  position: relative;
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-end;
`;

const NUMBER_VISIBLE_TIME = 7000;

export interface NegativeEventBlock {
  id: string;
  eventBlock: (ResourceEvent | DamageEvent)[];
}

export interface DamageEvent {
  eventType: 'damage';
  id: string;
  type: DamageType;
  received: number;
  sent: number;
  part: BodyPart;
}

export interface StatusEventBlock {
  id: string;
  eventBlock: StatusEvent[];
}

export interface StatusEvent {
  id: string;
  name: string;
  action: StatusAction;
  duration: number;
}

export interface PositiveEventBlock {
  id: string;
  eventBlock: (ResourceEvent | HealEvent)[];
}

export interface ResourceEvent {
  eventType: 'resource';
  id: string;
  sent: number;
  received: number;
  type: EntityResourceType;
}

export interface HealEvent {
  eventType: 'heal';
  id: string;
  sent: number;
  received: number;
  part: BodyPart;
}

export interface Props {
}

export interface State {
  negativeEvents: (DamageEvent | ResourceEvent | NegativeEventBlock)[];

  statusEvents: (StatusEvent | StatusEventBlock)[];

  positiveEvents: (ResourceEvent | HealEvent | PositiveEventBlock)[];
}

export function getResourceType(event: ResourceEvent | HealEvent) {
  let resourceType = '';
  if (event.eventType === 'resource') {
    switch (event.type) {
      case EntityResourceType.Blood: {
        resourceType = 'blood';
        break;
      }
      case EntityResourceType.Stamina: {
        resourceType = 'stamina';
        break;
      }
    }
  }

  if (event.eventType === 'heal') {
    resourceType = 'heal';
  }

  return resourceType;
}

// tslint:disable-next-line:function-name
export class SelfDamageNumbers extends React.Component<Props, State> {
  private updateEventsInterval: number;

  private batchedNegativeEvents: (DamageEvent | ResourceEvent | NegativeEventBlock)[] = [];
  private lastNegativeEventTime: number;

  private batchedStatusEvents: (StatusEvent | StatusEventBlock)[] = [];
  private lastStatusEventTime: number;

  private batchedPositiveEvents: (ResourceEvent | HealEvent | PositiveEventBlock)[] = [];
  private lastPositiveEventTime: number;

  constructor(props: Props) {
    super(props);
    this.state = {
      negativeEvents: [],
      statusEvents: [],
      positiveEvents: [],
    };
  }

  public render() {
    return (
      <Container>
        <SectionContainer flex={1}>
          {this.state.negativeEvents.map((event) => {
            return (
              <NegativeNumber
                key={event.id}
                negativeEvent={event}
                canPositionAbsolute={this.batchedNegativeEvents.length < 5}
              />
            );
          })}
        </SectionContainer>
        <SectionContainer flex={1.25}>
          {this.state.statusEvents.map((event) => {
            return (
              <Status key={event.id} statusEvent={event} />
            );
          })}
        </SectionContainer>
        <SectionContainer flex={1}>
          {this.state.positiveEvents.map((event) => {
            return (
              <PositiveNumber key={event.id} positiveEvent={event} />
            );
          })}
        </SectionContainer>
      </Container>
    );
  }

  public componentDidMount() {
    game.onCombatEvent(this.setEvents);
  }

  private updateEvents = () => {
    const currentTime = new Date().getTime();
    let shouldUpdate = false;

    if (currentTime - this.lastNegativeEventTime >= NUMBER_VISIBLE_TIME) {
      this.batchedNegativeEvents = [];
      shouldUpdate = true;
    }

    if (currentTime - this.lastStatusEventTime >= NUMBER_VISIBLE_TIME) {
      this.batchedStatusEvents = [];
      shouldUpdate = true;
    }

    if (currentTime - this.lastPositiveEventTime >= NUMBER_VISIBLE_TIME) {
      this.batchedPositiveEvents = [];
      shouldUpdate = true;
    }

    if (this.batchedNegativeEvents.length > 0 ||
        this.batchedStatusEvents.length > 0 ||
        this.batchedStatusEvents.length > 0) {
      shouldUpdate = true;
    }

    if (shouldUpdate) {
      this.setState({
        negativeEvents: this.batchedNegativeEvents,
        statusEvents: this.batchedStatusEvents,
        positiveEvents: this.batchedPositiveEvents,
      });
    }

    if (this.batchedNegativeEvents.length === 0 &&
        this.batchedStatusEvents.length === 0 &&
        this.batchedPositiveEvents.length === 0) {
      this.stopUpdateInterval();
    }
  }

  public componentWillUnmount() {
    window.clearInterval(this.updateEventsInterval);
  }

  private setEvents = (e: CombatEvent[]) => {
    e.forEach((combatEvent) => {
      this.setStatusEvents(combatEvent);
      this.setNegativeEvents(combatEvent);
      this.setPositiveEvents(combatEvent);
    });
  }

  private setNegativeEvents = (event: CombatEvent) => {
    if (event.toName !== camelotunchained.game.selfPlayerState.name) return;
    if (!event.damages) return;

    if (event.damages.length === 1) {
      this.batchedNegativeEvents.push({ id: generateID(10), eventType: 'damage', ...event.damages[0] });
    } else {
      const negativeEventsBlock: DamageEvent[] = [];
      event.damages.forEach((damageEvent) => {
        negativeEventsBlock.push({ id: generateID(10), eventType: 'damage', ...damageEvent });
      });

      this.batchedNegativeEvents.push({ id: generateID(10), eventBlock: negativeEventsBlock });
    }

    if (event.resources) {
      if (event.resources.length === 1) {
        const resourceEvent = event.resources[0];
        if (resourceEvent.received > 0) {
          this.batchedNegativeEvents.push({ id: generateID(10), eventType: 'resource', ...event.resources[0] });
        }
      } else {
        const resourceEventsBlock: ResourceEvent[] = [];
        event.resources.forEach((resourcesEvent) => {
          if (resourcesEvent.received > 0) {
            resourceEventsBlock.push({ id: generateID(10), eventType: 'resource', ...resourcesEvent });
          }
        });

        this.batchedNegativeEvents.push({ id: generateID(10), eventBlock: resourceEventsBlock });
      }
    }

    if (this.batchedNegativeEvents.length === 10) {
      this.batchedNegativeEvents.shift();
    }

    this.lastNegativeEventTime = new Date().getTime();

    if (!this.updateEventsInterval) {
      this.startUpdateInterval();
    }
  }

  private setStatusEvents = (event: CombatEvent) => {
    if (event.toName !== camelotunchained.game.selfPlayerState.name) return;
    if (!event.statuses) return;

    if (event.statuses.length === 1) {
      this.batchedStatusEvents.push({ id: generateID(10), ...event.statuses[0] });
    } else {
      const statusEventsBlock: StatusEvent[] = [];
      event.statuses.forEach((statusEvent) => {
        statusEventsBlock.push({ id: generateID(10), ...statusEvent });
      });

      this.batchedStatusEvents.push({ id: generateID(10), eventBlock: statusEventsBlock });
    }

    if (this.batchedStatusEvents.length === 10) {
      this.batchedStatusEvents.shift();
    }

    this.lastStatusEventTime = new Date().getTime();

    if (!this.updateEventsInterval) {
      this.startUpdateInterval();
    }
  }

  private setPositiveEvents = (event: CombatEvent) => {
    if (event.toName !== camelotunchained.game.selfPlayerState.name) return;
    if (!event.heals && !event.resources) return;

    if (event.heals) {
      if (event.heals.length === 1) {
        this.batchedPositiveEvents.push({ id: generateID(10), eventType: 'heal', ...event.heals[0] });
      } else {
        const healEventsBlock: HealEvent[] = [];
        event.heals.forEach((healsEvent) => {
          healEventsBlock.push({ id: generateID(10), eventType: 'heal', ...healsEvent });
        });

        this.batchedPositiveEvents.push({ id: generateID(10), eventBlock: healEventsBlock });
      }
    }

    if (event.resources) {
      if (event.resources.length === 1) {
        const resourceEvent = event.resources[0];
        if (resourceEvent.received > 0) {
          this.batchedPositiveEvents.push({ id: generateID(10), eventType: 'resource', ...event.resources[0] });
        }
      } else {
        const resourceEventsBlock: ResourceEvent[] = [];
        event.resources.forEach((resourcesEvent) => {
          if (resourcesEvent.received > 0) {
            resourceEventsBlock.push({ id: generateID(10), eventType: 'resource', ...resourcesEvent });
          }
        });

        this.batchedPositiveEvents.push({ id: generateID(10), eventBlock: resourceEventsBlock });
      }
    }

    if (this.batchedPositiveEvents.length === 10) {
      this.batchedPositiveEvents.shift();
    }

    this.lastPositiveEventTime = new Date().getTime();

    if (!this.updateEventsInterval) {
      this.startUpdateInterval();
    }
  }

  private startUpdateInterval = () => {
    if (this.updateEventsInterval) {
      // Just in case for some crazy reason there is already an interval running, clear it.
      window.clearInterval(this.updateEventsInterval);
    }
    this.updateEventsInterval = window.setInterval(this.updateEvents, 400);
  }

  private stopUpdateInterval = () => {
    window.clearInterval(this.updateEventsInterval);
    this.updateEventsInterval = null;
  }
}
