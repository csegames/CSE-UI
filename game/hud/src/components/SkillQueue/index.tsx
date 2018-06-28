/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { events, SkillStateStatusEnum, SkillStateTrackEnum } from '@csegames/camelot-unchained';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { CUCharacter } from '@csegames/camelot-unchained/lib/graphql/schema';

import { ApiSkillInfo } from '../SkillBar';
import { SkillStateInfo } from '../SkillBar/SkillButton/lib';
import SkillQueueList, { QueuedSkills } from './components/SkillQueueList';

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

export interface SkillQueueProps {

}

export interface SkillQueueState {
  queuedSkills: QueuedSkills;
}

class SkillQueue extends React.Component<SkillQueueProps, SkillQueueState> {
  private initialized: boolean = false;
  constructor(props: SkillQueueProps) {
    super(props);
    this.state = {
      queuedSkills: {},
    };
  }

  public render() {
    return (
      <GraphQL query={query} onQueryResult={this.handleQueryResult}>
        {() => {
          return <SkillQueueList queuedSkills={this.state.queuedSkills} />;
        }}
      </GraphQL>
    );
  }

  private handleQueryResult = (result: GraphQLResult<{ myCharacter: Partial<CUCharacter> }>) => {
    if (this.initialized || !result || !result.data) return;

    const mySkills = result.data.myCharacter && result.data.myCharacter.skills;
    if (mySkills) {
      mySkills.forEach((skill: ApiSkillInfo) => events.on('skillsbutton-' + skill.id, this.handleSkillQueueEvent));
      this.initialized = true;
    }
  }

  private handleSkillQueueEvent = (skill: SkillStateInfo) => {
    const queuedSkills = { ...this.state.queuedSkills };
    const tracks = this.getTracks(skill.track);
    tracks.forEach((track) => {
      const activeOrQueued = skill.status & SkillStateStatusEnum.Queued ||
      skill.status & SkillStateStatusEnum.Preparation ||
      skill.status & SkillStateStatusEnum.Held;

      if (activeOrQueued) {
        const skillIndex = _.findIndex(queuedSkills[track], queuedSkill => queuedSkill.id === skill.id);
        if (skillIndex > -1) {
          queuedSkills[track][skillIndex] = skill;
        } else {
          queuedSkills[track] = queuedSkills[track] ? [...queuedSkills[track], skill] : [skill];
        }
      } else if (queuedSkills[track]) {
        queuedSkills[track] = queuedSkills[track].filter(queuedSkill => queuedSkill.id !== skill.id);
        if (queuedSkills[track].length === 0) {
          delete queuedSkills[track];
        }
      }
    });
    this.setState({ queuedSkills });
  }

  private getTracks = (track: SkillStateTrackEnum) => {
    let tracks: string[] = [];
    if (track & SkillStateTrackEnum.PrimaryWeapon) {
      tracks = [...tracks, 'PrimaryWeapon'];
    }

    if (track & SkillStateTrackEnum.SecondaryWeapon) {
      tracks = [...tracks, 'SecondaryWeapon'];
    }

    if (track & SkillStateTrackEnum.Voice) {
      tracks = [...tracks, 'Voice'];
    }

    if (track & SkillStateTrackEnum.Mind) {
      tracks = [...tracks, 'Mind'];
    }

    return tracks;
  }
}

export default SkillQueue;
