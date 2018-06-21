/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';

import { client, ClientSkillBarItem } from '@csegames/camelot-unchained';
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
  apiSkills: ApiSkillInfo[];
  clientSkills: ClientSkillBarItem[];
}

export class SkillBar extends React.Component<SkillBarProps, SkillBarState> {
  private graphql: GraphQLResult<Pick<CUQuery, 'myCharacter'>>;
  constructor(props: {}) {
    super(props);
    this.state = {
      apiSkills: [],
      clientSkills: [],
    };
  }

  public render() {
    const { apiSkills, clientSkills } = this.state;
    return (
      <Container>
        <GraphQL query={query} onQueryResult={this.handleQueryResult} />
        {clientSkills.map((clientSkill: ClientSkillBarItem, index: number) => {
          const skillInfo = {
            ..._.find(apiSkills, (s: ApiSkillInfo) => s.id === clientSkill.id),
            ...clientSkill,
          };

          return skillInfo ? (
            <SkillButton key={index} skillInfo={skillInfo} index={index + 1} />
          ) : null;
        })}
      </Container>
    );
  }

  public componentDidMount() {
    client.OnSkillBarChanged(this.updateSkills);
  }

  public shouldComponentUpdate(nextProps: SkillBarProps, nextState: SkillBarState) {
    return !_.isEqual(nextState.clientSkills, this.state.clientSkills) ||
      !_.isEqual(nextState.apiSkills, this.state.apiSkills);
  }

  private handleQueryResult = (graphql: GraphQLResult<Pick<CUQuery, 'myCharacter'>>) => {
    this.graphql = graphql;

    if (graphql.loading || !graphql.data) {
      return;
    }

    const myCharacter = typeof graphql.data === 'string' ? JSON.parse(graphql.data).myCharacter : graphql.data.myCharacter;

    if (myCharacter && myCharacter.skills && !_.isEqual(this.state.apiSkills, myCharacter.skills)) {
      this.setState({ apiSkills: myCharacter.skills });
    }
  }

  private updateSkills = (skills: ClientSkillBarItem[]) => {
    const sortedSkills = skills.sort(this.sortBySkillID);

    this.setState({ clientSkills: sortedSkills });

    if (this.graphql) {
      setTimeout(() => this.graphql.refetch(), 50);
    }
  }

  private sortBySkillID = (a: ClientSkillBarItem, b: ClientSkillBarItem) => {
    const aID = !_.isNumber(a.id) ? parseInt(a.id, 16) : a.id;
    const bID = !_.isNumber(b.id) ? parseInt(b.id, 16) : b.id;
    return aID - bID;
  }
}

export default SkillBar;
