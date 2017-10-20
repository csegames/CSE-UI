/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';

import { restAPI, client } from 'camelot-unchained';
import styled from 'react-emotion';
import SkillButton, { SkillState } from './SkillButton';

const Container = styled('div')`
  display: flex;
`;

export interface SkillBarProps {

}

export interface SkillBarState {
  abilities: SkillState[];
}

export class SkillBar extends React.Component<SkillBarProps, SkillBarState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      abilities: [],
    };
  }

  public render() {
    return (
      <Container>
        {this.state.abilities.map((state: SkillState, index: number) => (
          <SkillButton key={index} skillState={state} index={index + 1} />
        ))}
      </Container>
    );
  }

  public componentDidMount() {
    this.getAbilities();
    client.OnAbilityCreated(this.onAbilityCreated);
    client.OnAbilityDeleted(this.onAbilityDeleted);
  }

  private getAbilities = async () => {
    const res = await restAPI.legacyAPI.getCraftedAbilities(client.loginToken, client.characterID);
    this.setState({ abilities: res.sort(this.sortByAbilityID) });
  }

  private sortByAbilityID = (a: SkillState, b: SkillState) => {
    const aID = !_.isNumber(a.id) ? parseInt(a.id, 16) : a.id;
    const bID = !_.isNumber(b.id) ? parseInt(b.id, 16) : b.id;
    return aID - bID;
  }

  private onAbilityCreated = (abilityId: string, ability: string) => {
    this.setState({ abilities: [...this.state.abilities, JSON.parse(ability)] });
  }

  private onAbilityDeleted = (abilityId: string) => {
    const newAbilities = _.filter(this.state.abilities, (ability) => {
      const hexId = parseInt(ability.id, 10).toString(16);
      return hexId !== abilityId;
    });
    this.setState({ abilities: newAbilities });
  }
}

export default SkillBar;
