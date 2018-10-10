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
    const tracks = this.getTracks(ability.track);
    tracks.forEach((track) => {
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
      } else if (queuedAbilities[track]) {
        // Ability is no longer active or queued, remove from the AbilityQueue list
        queuedAbilities[track] = queuedAbilities[track].filter(queuedAbility => queuedAbility.id !== ability.id);
        if (queuedAbilities[track].length === 0) {
          delete queuedAbilities[track];
        }
      }
    });
    this.setState({ queuedAbilities });
  }

  private getTracks = (track: AbilityTrack) => {
    let tracks: string[] = [];
    if (track & AbilityTrack.PrimaryWeapon) {
      tracks = [...tracks, 'PrimaryWeapon'];
    }

    if (track & AbilityTrack.SecondaryWeapon) {
      tracks = [...tracks, 'SecondaryWeapon'];
    }

    if (track & AbilityTrack.Voice) {
      tracks = [...tracks, 'Voice'];
    }

    if (track & AbilityTrack.Mind) {
      tracks = [...tracks, 'Mind'];
    }

    return tracks;
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
