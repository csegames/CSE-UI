/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';

import styled from 'react-emotion';
import AbilityButton from './AbilityButton';

const Container = styled('div')`
  display: flex;
  justify-content: center;
`;

export interface ApiAbilityInfo {
  id: number;
  name: string;
  icon: string;
  notes: string;
  tracks: any;
}

export interface AbilityBarProps {
}

export interface AbilityBarState {
  clientAbilities: AbilityBarItem[];
}

export type InitialAbilityInfo = ApiAbilityInfo & AbilityBarItem;

export class AbilityBar extends React.Component<AbilityBarProps, AbilityBarState> {
  constructor(props: AbilityBarProps) {
    super(props);
    this.state = {
      clientAbilities: [],
    };
  }

  public render() {
    const { clientAbilities } = this.state;

    return (
      <Container className={'ability-bar'}>
        {clientAbilities.map((clientAbility: AbilityBarItem, index: number) => {
          const abilityInfo = this.getAbility(clientAbility);

          return abilityInfo ? (
            <AbilityButton key={index} abilityInfo={abilityInfo} index={index + 1} />
          ) : null;
        })}
      </Container>
    );
  }

  public componentDidMount() {
    game.abilityBarState.onUpdated(this.updateAbilities);
    game.store.onUpdated(() => this.forceUpdate());

    if (game.abilityBarState.isReady) {
      this.updateAbilities();
    }
  }

  public shouldComponentUpdate(nextProps: AbilityBarProps, nextState: AbilityBarState) {
    return true;
    // return !_.isEqual(nextState.clientAbilities, this.state.clientAbilities) ||
    //   !_.isEqual(nextProps.apiAbilities, this.props.apiAbilities);
  }

  private updateAbilities = () => {
    const sortedAbilities = Object.values(game.abilityBarState.abilities).sort(this.sortByAbilityID);

    this.setState({ clientAbilities: sortedAbilities });

    if (game.store.refetch) {
      window.setTimeout(() => game.store.refetch(), 50);
    }
  }

  private sortByAbilityID = (a: AbilityBarItem, b: AbilityBarItem) => {
    const aID = !_.isNumber(a.id) ? parseInt(a.id, 16) : a.id;
    const bID = !_.isNumber(b.id) ? parseInt(b.id, 16) : b.id;
    return aID - bID;
  }

  private getAbility = (clientAbility: AbilityBarItem) => {
    const apiAbilityInfo = game.store.getSkillInfo(clientAbility.id);
    const abilityInfo: InitialAbilityInfo = {
      ...clientAbility,
      ...apiAbilityInfo,
    };

    if (apiAbilityInfo) {
      Object.keys(apiAbilityInfo).forEach((key) => {
        // If client has same key, check if it's a truthy value. If so, override API data. Otherwise, don't.
        if (clientAbility[key]) {
          // Value is truthy, override.
          abilityInfo[key] = clientAbility[key];
        }
      });
    }

    return abilityInfo;
  }
}

export default AbilityBar;
