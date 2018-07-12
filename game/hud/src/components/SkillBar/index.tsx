/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import * as _ from 'lodash';

import { client, ClientSkillBarItem } from '@csegames/camelot-unchained';
import styled from 'react-emotion';
import { HUDContext, HUDGraphQLQueryResult } from 'HUDContext';
import SkillButton from './SkillButton';

const Container = styled('div')`
  display: flex;
  justify-content: center;
`;

export interface ApiSkillInfo {
  id: number;
  name: string;
  icon: string;
  notes: string;
  tracks: any;
}

export interface SkillBarProps {
  apiSkills: HUDGraphQLQueryResult<ApiSkillInfo[]>;
}

export interface SkillBarState {
  clientSkills: ClientSkillBarItem[];
}

export class SkillBar extends React.Component<SkillBarProps, SkillBarState> {
  constructor(props: SkillBarProps) {
    super(props);
    this.state = {
      clientSkills: [],
    };
  }

  public render() {
    const { apiSkills } = this.props;
    const { clientSkills } = this.state;
    return (
      <Container>
        {clientSkills.map((clientSkill: ClientSkillBarItem, index: number) => {
          const skillInfo = {
            ..._.find(apiSkills.data, (s: ApiSkillInfo) => s.id === clientSkill.id),
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
      !_.isEqual(nextProps.apiSkills, this.props.apiSkills);
  }

  private updateSkills = (skills: ClientSkillBarItem[]) => {
    const sortedSkills = skills.sort(this.sortBySkillID);

    this.setState({ clientSkills: sortedSkills });

    if (this.props.apiSkills.refetch()) {
      setTimeout(() => this.props.apiSkills.refetch(), 50);
    }
  }

  private sortBySkillID = (a: ClientSkillBarItem, b: ClientSkillBarItem) => {
    const aID = !_.isNumber(a.id) ? parseInt(a.id, 16) : a.id;
    const bID = !_.isNumber(b.id) ? parseInt(b.id, 16) : b.id;
    return aID - bID;
  }
}

class SkillBarWithInjectedContext extends React.Component<{}> {
  public render() {
    return (
      <HUDContext.Consumer>
        {({ skills }) => {
          return (
            <SkillBar apiSkills={skills} />
          );
        }}
      </HUDContext.Consumer>
    );
  }
}

export default SkillBarWithInjectedContext;
