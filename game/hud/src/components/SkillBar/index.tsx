/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';

import { client } from '@csegames/camelot-unchained';
import { CUQuery } from '@csegames/camelot-unchained/lib/graphql/schema';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import styled from 'react-emotion';
import SkillButton from './SkillButton';

const query = `
  {
    myCharacter {
      skills {
        id
        name
        icon
        notes
        tracks
      }
    }
  }
`;

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
  skills: ApiSkillInfo[];
}

export class SkillBar extends React.Component<SkillBarProps, SkillBarState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      skills: [],
    };
  }

  public render() {
    return (
      <Container>
        <GraphQL query={query} onQueryResult={this.initializeSkills} />
        {this.state.skills.map((state: ApiSkillInfo, index: number) => (
          <SkillButton key={index} skillInfo={state} index={index + 1} />
        ))}
      </Container>
    );
  }

  public componentDidMount() {
    client.OnAbilityCreated(this.onSkillCreated);
    client.OnAbilityDeleted(this.onSkillDeleted);
  }

  public shouldComponentUpdate(nextProps: SkillBarProps, nextState: SkillBarState) {
    return !_.isEqual(nextState.skills, this.state.skills);
  }

  private initializeSkills = (graphql: GraphQLResult<Pick<CUQuery, 'myCharacter'>>) => {
    if (graphql.loading || !graphql.data) {
      return;
    }

    const myCharacter = typeof graphql.data === 'string' ? JSON.parse(graphql.data).myCharacter : graphql.data.myCharacter;
    if (myCharacter) {
      const skills = this.updateSkills(myCharacter.skills);
      if (!_.isEqual(skills, this.state.skills)) {
        this.setState({ skills });
      }
    }
  }

  private updateSkills = (skills: any[]) => {
    const sortedSkills = skills.sort(this.sortBySkillID);
    sortedSkills.forEach((skill: ApiSkillInfo) => this.registerSkill(skill));
    return sortedSkills;
  }

  private sortBySkillID = (a: ApiSkillInfo, b: ApiSkillInfo) => {
    const aID = !_.isNumber(a.id) ? parseInt(a.id, 16) : a.id;
    const bID = !_.isNumber(b.id) ? parseInt(b.id, 16) : b.id;
    return aID - bID;
  }

  private onSkillCreated = (abilityId: string, ability: string) => {
    const newSkills = [...this.state.skills, JSON.parse(ability)];
    const skills = this.updateSkills(newSkills);
    this.setState({ skills });
  }

  private onSkillDeleted = (abilityId: string) => {
    const newSkills = _.filter(this.state.skills, (ability) => {
      const hexId = ability.id.toString(16);
      return hexId !== abilityId;
    });
    const skills = this.updateSkills(newSkills);
    this.setState({ skills });
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

  private registerSkill = (ability: any) => {
    const abilityID = ability.id.toString();
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
