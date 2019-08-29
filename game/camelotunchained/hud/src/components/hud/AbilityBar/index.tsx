/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';

import { styled } from '@csegames/linaria/react';
import AbilityButton from './AbilityButton';

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

export interface ApiAbilityInfo {
  id: number;
  name: string;
  icon: string;
  description: string;
  tracks: any;
}

export interface AbilityBarProps {
}

export interface AbilityBarState {
  clientAbilities: AbilityBarItem[];
}

export type InitialAbilityInfo = ApiAbilityInfo & AbilityBarItem;

export class AbilityBar extends React.Component<AbilityBarProps, AbilityBarState> {
  private refetchAbilitiesTimeout: number;
  private clientAbilitiesCache: ArrayMap<AbilityBarItem>;
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
        {JSON.parse(JSON.stringify(clientAbilities)).map((clientAbility: AbilityBarItem, index: number) => {
          const abilityInfo = this.getAbility(clientAbility);

          return abilityInfo ? (
            <AbilityButton
              key={abilityInfo.id}
              abilityInfo={abilityInfo}
              index={index + 1}
              numberOfAbilities={clientAbilities.length}
            />
          ) : null;
        })}
      </Container>
    );
  }

  public componentDidMount() {
    camelotunchained.game.abilityBarState.onUpdated(() => {
      this.updateAbilities();
    });
    camelotunchained.game.store.onUpdated(() => this.forceUpdate());

    if (!camelotunchained.game.store.myCharacter || !camelotunchained.game.store.myCharacter.abilities) {
      this.refetchBadAPIAbilities();
    }

    if (camelotunchained.game.abilityBarState.isReady) {
      this.updateAbilities();
    }
  }

  public shouldComponentUpdate(nextProps: AbilityBarProps, nextState: AbilityBarState) {
    return true;
    // return !_.isEqual(nextState.clientAbilities, this.state.clientAbilities) ||
    //   !_.isEqual(nextProps.apiAbilities, this.props.apiAbilities);
  }

  public componentWillUnmount() {
    window.clearTimeout(this.refetchAbilitiesTimeout);
  }

  private updateAbilities = () => {
    if (!this.clientAbilitiesCache ||
        !_.isEqual(this.clientAbilitiesCache, camelotunchained.game.abilityBarState.abilities)) {
      this.clientAbilitiesCache = camelotunchained.game.abilityBarState.abilities;
      const sortedAbilities = Object.values(camelotunchained.game.abilityBarState.abilities).sort(this.sortByAbilityID);

      this.setState({ clientAbilities: sortedAbilities });

      if (camelotunchained.game.store.refetch) {
        window.setTimeout(() => camelotunchained.game.store.refetch(), 50);
      }
    }
  }

  private refetchBadAPIAbilities = () => {
    if (!camelotunchained.game.store.myCharacter || !camelotunchained.game.store.myCharacter.abilities) {
      camelotunchained.game.store.refetch();
      this.refetchAbilitiesTimeout = window.setTimeout(this.refetchBadAPIAbilities, 3000);
      return;
    }

    window.clearTimeout(this.refetchAbilitiesTimeout);
    this.refetchAbilitiesTimeout = null;
  }

  private sortByAbilityID = (a: AbilityBarItem, b: AbilityBarItem) => {
    const aID = !_.isNumber(a.id) ? parseInt(a.id, 16) : a.id;
    const bID = !_.isNumber(b.id) ? parseInt(b.id, 16) : b.id;
    return aID - bID;
  }

  private getAbility = (clientAbility: AbilityBarItem) => {
    const apiAbilityInfo = camelotunchained.game.store.getAbilityInfo(clientAbility.id);
    const abilityInfo: InitialAbilityInfo = {
      ...clientAbility,
      ...apiAbilityInfo,
    } as InitialAbilityInfo;

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
