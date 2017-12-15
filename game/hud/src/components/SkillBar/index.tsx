/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';

import { restAPI, client } from 'camelot-unchained';
import styled from 'react-emotion';
import SkillButton from './SkillButton';

const Container = styled('div')`
  display: flex;
  justify-content: center;
`;

export interface ApiSkillInfo {
  characterID: string;
  duration: number;
  icon: string;
  id: number;
  name: string;
  notes: string;
  preparationTime: number;
  shardID: number;
  cooldowns: any;
  rootComponentSlot: any;
  stats: any;
}

export interface SkillBarProps {

}

export interface SkillBarState {
  abilities: ApiSkillInfo[];
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
        {this.state.abilities.map((state: ApiSkillInfo, index: number) => (
          <SkillButton key={index} skillInfo={state} index={index + 1} />
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
    const sortedAbilities = res.sort(this.sortByAbilityID);
    sortedAbilities.forEach((skill: ApiSkillInfo) => this.registerAbility(skill));
    this.setState({ abilities: sortedAbilities });
  }

  private sortByAbilityID = (a: ApiSkillInfo, b: ApiSkillInfo) => {
    const aID = !_.isNumber(a.id) ? parseInt(a.id, 16) : a.id;
    const bID = !_.isNumber(b.id) ? parseInt(b.id, 16) : b.id;
    return aID - bID;
  }

  private onAbilityCreated = (abilityId: string, ability: string) => {
    this.registerAbility(abilityId);
    this.setState({ abilities: [...this.state.abilities, JSON.parse(ability)] });
  }

  private onAbilityDeleted = (abilityId: string) => {
    const newAbilities = _.filter(this.state.abilities, (ability) => {
      const hexId = ability.id.toString(16);
      return hexId !== abilityId;
    });
    this.setState({ abilities: newAbilities });
  }

  private getPrimaryComponent = (ability: any) => {
    if (ability) {
      return ability.rootComponentSlot;
    }
  }

  private getSecondaryComponent = (ability: any) => {
    if (ability && ability.rootComponentSlot && ability.rootComponentSlot.children) {
      return ability.rootComponentSlot.children[0];
    }
  }

  private registerAbility = (ability: any) => {
    const abilityID = typeof ability.id === 'number' ? ability.id.toString(16) : ability.id;
    const primaryComponent = this.getPrimaryComponent(ability);
    const primaryComponentBaseID = primaryComponent && primaryComponent.baseComponentID ?
      primaryComponent.baseComponentID.toString(16) : '';
    const secondaryComponent = this.getSecondaryComponent(ability);
    const secondaryComponentBaseID = secondaryComponent && secondaryComponent.baseComponentID ?
      secondaryComponent.baseComponentID.toString(16) : '';
    client.RegisterAbility(abilityID, primaryComponentBaseID, secondaryComponentBaseID);
  }
}

export default SkillBar;
