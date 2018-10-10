/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';

import styled from 'react-emotion';
import { HUDContext, HUDGraphQLQueryResult } from 'HUDContext';
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
  apiAbilities: HUDGraphQLQueryResult<ApiAbilityInfo[]>;
}

export interface AbilityBarState {
  clientAbilities: AbilityBarItem[];
}

export class AbilityBar extends React.Component<AbilityBarProps, AbilityBarState> {
  constructor(props: AbilityBarProps) {
    super(props);
    this.state = {
      clientAbilities: [],
    };
  }

  public render() {
    const { apiAbilities } = this.props;
    const { clientAbilities } = this.state;
    return (
      <Container>
        {clientAbilities.map((clientAbility: AbilityBarItem, index: number) => {
          const abilityInfo = {
            ..._.find(apiAbilities.data, (s: ApiAbilityInfo) => s.id === clientAbility.id),
            ...clientAbility,
          };

          return abilityInfo ? (
            <AbilityButton key={index} abilityInfo={abilityInfo} index={index + 1} />
          ) : null;
        })}
      </Container>
    );
  }

  public componentDidMount() {
    game.abilityBarState.onUpdated(this.updateAbilities);
  }

  public shouldComponentUpdate(nextProps: AbilityBarProps, nextState: AbilityBarState) {
    return !_.isEqual(nextState.clientAbilities, this.state.clientAbilities) ||
      !_.isEqual(nextProps.apiAbilities, this.props.apiAbilities);
  }

  private updateAbilities = () => {
    const sortedAbilities = game.abilityBarState.abilities.sort(this.sortByAbilityID);

    this.setState({ clientAbilities: sortedAbilities });

    if (this.props.apiAbilities.refetch()) {
      setTimeout(() => this.props.apiAbilities.refetch(), 50);
    }
  }

  private sortByAbilityID = (a: AbilityBarItem, b: AbilityBarItem) => {
    const aID = !_.isNumber(a.id) ? parseInt(a.id, 16) : a.id;
    const bID = !_.isNumber(b.id) ? parseInt(b.id, 16) : b.id;
    return aID - bID;
  }
}

class AbilityBarWithInjectedContext extends React.Component<{}> {
  public render() {
    return (
      <HUDContext.Consumer>
        {({ skills }) => {
          return (
            <AbilityBar apiAbilities={skills} />
          );
        }}
      </HUDContext.Consumer>
    );
  }
}

export default AbilityBarWithInjectedContext;
