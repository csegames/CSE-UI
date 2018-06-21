/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { PlayerState, damageTypes, GroupMemberState } from '@csegames/camelot-unchained';
import styled from 'react-emotion';

import { isEqualPlayerState } from '../../lib/playerStateEqual';
import HealthBarViewCompact from './components/HealthBarViewCompact';
import HealthBarViewFull from './components/HealthBarViewFull';
import HealthBarViewMini from './components/HealthBarViewMini';
import DistanceText from './components/DistanceText';
import Status from './components/Status';

const Container = styled('div')`
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

// type CombatEvent  = DamageEvent | HealEvent;

export type HealthBarType = 'full' | 'compact' | 'mini';

export interface HealthBarProps {
  type: HealthBarType;
  playerState: PlayerState | GroupMemberState;
  target?: 'enemy' | 'friendly';
}

export interface HealthBarState {
  // events: CombatEvent[];
  // shouldShake: boolean;
}

class HealthBar extends React.Component<HealthBarProps, HealthBarState> {
  // private mounted: boolean;
  // private endTime: number;
  // constructor(props: HealthBarProps) {
  //   super(props);
  //   this.state = {
  //     events: [],
  //     shouldShake: false,
  //   };
  // }

  public render() {
    const { playerState, target } = this.props;

    // const now = Date.now();
    // // did we recently take damage?
    // for (let i = this.state.events.length - 1; i >= 0; --i) {
    //   const e = this.state.events[i];
    //   if (now - e.when > 200) break;
    //   if (e.kind === 'damage') {
    //     this.endTime = now + 200;
    //     setTimeout(() => this.shakeIt());
    //     setTimeout(() => this.endShake(), 201);
    //     break;
    //   }
    // }


    return (
      <Container>
        {this.props.type === 'compact' &&
          <div>
            <HealthBarViewCompact shouldShake={false} playerState={playerState} />
            <Status statuses={playerState ? playerState.statuses as any : null} />
          </div>
        }
        {this.props.type === 'full' &&
          <div>
            <HealthBarViewFull shouldShake={false} playerState={playerState} />
            <Status statuses={playerState ? playerState.statuses as any : null} />
          </div>
        }
        {
          this.props.type === 'mini' &&
          <div>
            <HealthBarViewMini shouldShake={false} playerState={playerState} />
            <Status statuses={playerState ? playerState.statuses as any : null} />
          </div>
        }
        {target && <DistanceText targetType={target} />}
      </Container>
    );
  }

  public componentDidMount() {
    // client.OnCombatLogEvent(this.parseCombatLogEvent);
  }

  public shouldComponentUpdate(nextProps: HealthBarProps, nextState: HealthBarState) {
    return !isEqualPlayerState(nextProps.playerState, this.props.playerState);
  }

  // private parseCombatLogEvent = (combatLogs: CombatLog[]) => {
  //   const events: CombatEvent[] = [];
  //   combatLogs.forEach((e) => {
  //     // Go through combat log and look for damage/heal events
  //     if (!e || e.toName !== this.props.playerState.name) return;
  //     if (e.damages) {
  //       // Found a damage event
  //       let value = 0;
  //       let max = 0;
  //       let type = damageTypes.NONE;
  //       e.damages.forEach((d) => {
  //         if (d.received > max) {
  //           max = d.received | 0;
  //           type = d.type;
  //         }
  //         value += d.received | 0;
  //       });
  //       events.push({
  //         id: generateID(7),
  //         kind: 'damage',
  //         type,
  //         value,
  //         when: Date.now(),
  //       });
  //     }

  //     if (e.heals) {
  //       // Found a heal event
  //       let value = 0;
  //       let max = 0;
  //       e.heals.forEach((d) => {
  //         if (d.received > max) {
  //           max = d.received | 0;
  //         }
  //         value += d.received | 0;
  //       });
  //       events.push({
  //         id: generateID(7),
  //         kind: 'heal',
  //         value,
  //         when: Date.now(),
  //       });
  //     }
  //   });

  //   if (events.length > 0) {
  //     const stateEvents = this.state.events;
  //     if (stateEvents.length > 0 && (Date.now() - stateEvents[stateEvents.length - 1].when) > 200 && this.mounted
  //       ) {
  //       this.setState({
  //         events,
  //       });
  //     } else if (this.mounted) {
  //       this.setState({
  //         events: stateEvents.concat(events),
  //       });
  //     }
  //   }
  // }
}

export default HealthBar;
