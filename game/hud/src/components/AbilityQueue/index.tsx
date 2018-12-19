/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { findIndex, isEmpty } from 'lodash';
import { HUDContext, HUDGraphQLQueryResult } from 'HUDContext';

import { ApiAbilityInfo } from '../AbilityBar';
import { AbilityButtonInfo } from '../AbilityBar/AbilityButton/AbilityButtonView';
import AbilityQueueList, { QueuedAbilities } from './components/AbilityQueueList';
import { Skill } from 'gql/interfaces';

export interface AbilityQueueProps {
  abilities: HUDGraphQLQueryResult<Skill[]>;
}

export interface AbilityQueueState {
  queuedAbilities: QueuedAbilities;
}

class AbilityQueue extends React.Component<AbilityQueueProps, AbilityQueueState> {
  constructor(props: AbilityQueueProps) {
    super(props);
    this.state = {
      queuedAbilities: {},
    };
  }

  public render() {
    return (
      <AbilityQueueList queuedAbilities={this.state.queuedAbilities} />
    );
  }

  public componentDidUpdate(prevProps: AbilityQueueProps) {
    if (isEmpty(prevProps.abilities.data) && !isEmpty(this.props.abilities.data)) {
      this.props.abilities.data.forEach((ability: ApiAbilityInfo) => {
        game.on('abilitybutton-' + ability.id, this.handleAbilityQueueEvent);
      });
    }
  }

  private handleAbilityQueueEvent = (ability: AbilityButtonInfo) => {
    const queuedAbilities = { ...this.state.queuedAbilities };
    const track = this.getTrack(ability.track);
    const activeOrQueued = ability.status & AbilityButtonState.Queued ||
    ability.status & AbilityButtonState.Preparation ||
    ability.status & AbilityButtonState.Held;

    if (activeOrQueued) {
      // Add active or queued ability to the AbilityQueue list
      const abilityIndex = findIndex(queuedAbilities[track], queuedAbility => queuedAbility.id === ability.id);
      if (abilityIndex > -1) {
        queuedAbilities[track][abilityIndex] = ability;
      } else {
        queuedAbilities[track] = queuedAbilities[track] ? [...queuedAbilities[track], ability] : [ability];
      }
    } else {
      // Ability is no longer active or queued, remove from the AbilityQueue list
      Object.keys(queuedAbilities).forEach((track) => {
        if (queuedAbilities[track].find(queuedAbility => queuedAbility.id === ability.id)) {
          queuedAbilities[track] = queuedAbilities[track].filter(queuedAbility => queuedAbility.id !== ability.id);
          if (queuedAbilities[track].length === 0) {
            delete queuedAbilities[track];
          }
        }
      });
    }

    this.setState({ queuedAbilities });
  }

  private getTrack = (track: AbilityTrack) => {
    if (track & AbilityTrack.BothWeapons) {
      return AbilityTrack[AbilityTrack.BothWeapons];
    }

    if (track & AbilityTrack.PrimaryWeapon) {
      return AbilityTrack[AbilityTrack.PrimaryWeapon];
    }

    if (track & AbilityTrack.SecondaryWeapon) {
      return AbilityTrack[AbilityTrack.SecondaryWeapon];
    }

    if (track & AbilityTrack.Voice) {
      return AbilityTrack[AbilityTrack.Voice];
    }

    if (track & AbilityTrack.Mind) {
      return AbilityTrack[AbilityTrack.Mind];
    }

    return AbilityTrack[AbilityTrack.None];
  }
}

class AbilityQueueWithInjectedContext extends React.Component<{}> {
  public render() {
    return (
      <HUDContext.Consumer>
        {({ skills }) => {
          return (
            <AbilityQueue abilities={skills} />
          );
        }}
      </HUDContext.Consumer>
    );
  }
}

export default AbilityQueueWithInjectedContext;
