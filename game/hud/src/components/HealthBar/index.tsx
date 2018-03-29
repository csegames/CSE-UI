/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { client, Faction, PlayerState, CombatLog, damageTypes } from 'camelot-unchained';
import styled from 'react-emotion';
import { generateID } from 'redux-typed-modules';

import { BodyParts } from '../../lib/PlayerStatus';
import HealthBarViewCompact from './components/HealthBarViewCompact';
import HealthBarViewFull from './components/HealthBarViewFull';
import HealthBarViewMini from './components/HealthBarViewMini';
import Status from './components/Status';

const Container = styled('div')`
  position: relative;
`;

const DistanceText = styled('div')`
  position: absolute;
  left: 198px;
  bottom: -29px;
  z-index: -1;
  font-size: 24px;
  color: white;
  background-color: rgba(0,0,0,0.6);
  width: 100px;
  text-align: center;
`;

export interface DamageEvent {
  kind: 'damage';
  id: string;
  type: damageTypes;
  value: number;
  when: number;
}

export interface HealEvent {
  kind: 'heal';
  id: string;
  value: number;
  when: number;
}

type CombatEvent = DamageEvent | HealEvent;

export interface HealthBarValues {
  bloodPercent: number;
  staminaPercent: number;
  bodyPartsCurrentHealth: number[];

  // Health
  rightArmHealthPercent: number;
  leftArmHealthPercent: number;
  headHealthPercent: number;
  torsoHealthPercent: number;
  rightLegHealthPercent: number;
  leftLegHealthPercent: number;

  // Wounds
  rightArmWounds: number;
  leftArmWounds: number;
  headWounds: number;
  torsoWounds: number;
  rightLegWounds: number;
  leftLegWounds: number;
}

export type HealthBarType = 'full' | 'compact' | 'mini';

export interface HealthBarProps {
  type: HealthBarType;
  playerState: PlayerState;
  distanceToTarget?: number;
}

export interface HealthBarState {
  events: CombatEvent[];
  shouldShake: boolean;
}

class HealthBar extends React.Component<HealthBarProps, HealthBarState> {
  private mounted: boolean;
  private endTime: number;
  constructor(props: HealthBarProps) {
    super(props);
    this.state = {
      events: [],
      shouldShake: false,
    };
  }

  public render() {
    const { playerState, distanceToTarget } = this.props;
    const healthBarVals = this.getHealthBarValues();

    const now = Date.now();
    // did we recently take damage?
    for (let i = this.state.events.length - 1; i >= 0; --i) {
      const e = this.state.events[i];
      if (now - e.when > 200) break;
      if (e.kind === 'damage') {
        this.endTime = now + 200;
        setTimeout(() => this.shakeIt());
        setTimeout(() => this.endShake(), 201);
        break;
      }
    }

    return (
      <Container>
        {this.props.type === 'compact' &&
          <div>
            <HealthBarViewCompact
              shouldShake={false}
              faction={playerState ? playerState.faction : Faction.Factionless}
              isAlive={playerState ? playerState.isAlive : true}
              name={playerState ? playerState.name : 'unknown'}
              currentStamina={playerState && playerState.stamina ? playerState.stamina.current : 0}
              currentBlood={playerState && playerState.blood ? playerState.blood.current : 0}
              {...healthBarVals}
            />
            <Status statuses={playerState ? playerState.statuses : null} />
          </div>
        }
        {this.props.type === 'full' &&
          <div>
            <HealthBarViewFull
              shouldShake={false}
              faction={playerState ? playerState.faction : Faction.Factionless}
              isAlive={playerState ? playerState.isAlive : true}
              name={playerState ? playerState.name : 'unknown'}
              currentStamina={playerState && playerState.stamina ? playerState.stamina.current : 0}
              currentBlood={playerState && playerState.blood ? playerState.blood.current : 0}
              {...healthBarVals}
            />
            <Status statuses={playerState ? playerState.statuses : null} />
          </div>
        }
        {
          this.props.type === 'mini' &&
          <div>
            <HealthBarViewMini
              shouldShake={false}
              faction={playerState ? playerState.faction : Faction.Factionless}
              isAlive={playerState ? playerState.isAlive : true}
              name={playerState ? playerState.name : 'unknown'}
              currentStamina={playerState && playerState.stamina ? playerState.stamina.current : 0}
              currentBlood={playerState && playerState.blood ? playerState.blood.current : 0}
              {...healthBarVals}
            />
            <Status statuses={playerState ? playerState.statuses : null} />
          </div>
        }
        {typeof distanceToTarget === 'number' && <DistanceText>{distanceToTarget}m</DistanceText>}
      </Container>
    );
  }

  public componentDidMount() {
    client.OnCombatLogEvent(this.parseCombatLogEvent);
    this.mounted = true;
  }

  public shouldComponentUpdate(nextProps: HealthBarProps, nextState: HealthBarState) {
    return nextProps.distanceToTarget !== nextProps.distanceToTarget ||
      !_.isEqual(nextProps.playerState, this.props.playerState) ||
      !_.isEqual(nextState.events, this.state.events);
  }

  private parseCombatLogEvent = (combatLogs: CombatLog[]) => {
    const events: CombatEvent[] = [];
    combatLogs.forEach((e) => {
      // Go through combat log and look for damage/heal events
      if (!e || e.toName !== this.props.playerState.name) return;
      if (e.damages) {
        // Found a damage event
        let value = 0;
        let max = 0;
        let type = damageTypes.NONE;
        e.damages.forEach((d) => {
          if (d.received > max) {
            max = d.received | 0;
            type = d.type;
          }
          value += d.received | 0;
        });
        events.push({
          id: generateID(7),
          kind: 'damage',
          type,
          value,
          when: Date.now(),
        });
      }

      if (e.heals) {
        // Found a heal event
        let value = 0;
        let max = 0;
        e.heals.forEach((d) => {
          if (d.received > max) {
            max = d.received | 0;
          }
          value += d.received | 0;
        });
        events.push({
          id: generateID(7),
          kind: 'heal',
          value,
          when: Date.now(),
        });
      }
    });

    if (events.length > 0) {
      const stateEvents = this.state.events;
      if (stateEvents.length > 0 && (Date.now() - stateEvents[stateEvents.length - 1].when) > 200 && this.mounted
        ) {
        this.setState({
          events,
        });
      } else if (this.mounted) {
        this.setState({
          events: stateEvents.concat(events),
        });
      }
    }
  }

  private getHealthBarValues = (): HealthBarValues => {
    const { playerState } = this.props;
    if (!playerState || !_.has(playerState, 'blood') || !_.has(playerState, 'stamina') || !_.has(playerState, 'health')) {
      return {
        bloodPercent: 100,
        staminaPercent: 100,

        // Health
        bodyPartsCurrentHealth: [5, 5, 5, 5, 5, 5],
        rightArmHealthPercent: 100,
        leftArmHealthPercent: 100,
        headHealthPercent: 100,
        torsoHealthPercent: 100,
        rightLegHealthPercent: 100,
        leftLegHealthPercent: 100,

        // Wounds
        rightArmWounds: 0,
        leftArmWounds: 0,
        headWounds: 0,
        torsoWounds: 0,
        rightLegWounds: 0,
        leftLegWounds: 0,
      };
    }

    const bloodPercent = (playerState.blood.current / playerState.blood.max) * 100;
    const staminaPercent = (playerState.stamina.current / playerState.stamina.max) * 100;
    const bodyPartsCurrentHealth: number[] = [];
    const bodyHealthPercent: number[] = [];
    const bodyWounds: number[] = [];
    playerState.health && playerState.health.forEach((bodyPart) => {
      bodyPartsCurrentHealth.push(bodyPart.current);

      const healthPercent = (bodyPart.current / bodyPart.max) * 100;
      bodyHealthPercent.push(healthPercent);

      bodyWounds.push(bodyPart.wounds);
    });

    return {
      bloodPercent,
      staminaPercent,

      // Health
      bodyPartsCurrentHealth,
      rightArmHealthPercent: bodyHealthPercent[BodyParts.RightArm],
      leftArmHealthPercent: bodyHealthPercent[BodyParts.LeftArm],
      headHealthPercent: bodyHealthPercent[BodyParts.Head],
      torsoHealthPercent: bodyHealthPercent[BodyParts.Torso],
      rightLegHealthPercent: bodyHealthPercent[BodyParts.RightLeg],
      leftLegHealthPercent: bodyHealthPercent[BodyParts.LeftLeg],

      // Wounds
      rightArmWounds: bodyWounds[BodyParts.RightArm],
      leftArmWounds: bodyWounds[BodyParts.LeftArm],
      headWounds: bodyWounds[BodyParts.Head],
      torsoWounds: bodyWounds[BodyParts.Torso],
      rightLegWounds: bodyWounds[BodyParts.RightLeg],
      leftLegWounds: bodyWounds[BodyParts.LeftLeg],
    };
  }

  private shakeIt = () => {
    if (this.state.shouldShake) return;
    this.setState({ shouldShake: true });
  }

  private endShake = () => {
    if (Date.now() < this.endTime) return;
    if (!this.state.shouldShake) return;
    this.setState({ shouldShake: false });
  }
}

export default HealthBar;
