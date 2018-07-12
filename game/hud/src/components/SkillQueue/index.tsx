/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { findIndex, isEmpty } from 'lodash';
import { events, SkillStateStatusEnum, SkillStateTrackEnum } from '@csegames/camelot-unchained';
import { Skill } from '@csegames/camelot-unchained/lib/graphql/schema';
import { HUDContext, HUDGraphQLQueryResult } from 'HUDContext';

import { ApiSkillInfo } from '../SkillBar';
import { SkillStateInfo } from '../SkillBar/SkillButton/lib';
import SkillQueueList, { QueuedSkills } from './components/SkillQueueList';

export interface SkillQueueProps {
  skills: HUDGraphQLQueryResult<Skill[]>;
}

export interface SkillQueueState {
  queuedSkills: QueuedSkills;
}

class SkillQueue extends React.Component<SkillQueueProps, SkillQueueState> {
  constructor(props: SkillQueueProps) {
    super(props);
    this.state = {
      queuedSkills: {},
    };
  }

  public render() {
    return (
      <SkillQueueList queuedSkills={this.state.queuedSkills} />
    );
  }

  public componentDidUpdate(prevProps: SkillQueueProps) {
    if (isEmpty(prevProps.skills.data) && !isEmpty(this.props.skills.data)) {
      this.props.skills.data.forEach((skill: ApiSkillInfo) => {
        events.on('skillsbutton-' + skill.id, this.handleSkillQueueEvent);
      });
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
        const skillIndex = findIndex(queuedSkills[track], queuedSkill => queuedSkill.id === skill.id);
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

class SkillQueueWithInjectedContext extends React.Component<{}> {
  public render() {
    return (
      <HUDContext.Consumer>
        {({ skills }) => {
          return (
            <SkillQueue skills={skills} />
          );
        }}
      </HUDContext.Consumer>
    );
  }
}

export default SkillQueueWithInjectedContext;
