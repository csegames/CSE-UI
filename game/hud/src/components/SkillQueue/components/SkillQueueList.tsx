/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled from 'react-emotion';

import { SkillStateInfo } from '../../SkillBar/SkillButton/lib';
import SkillQueueItem from './SkillQueueItem';

const Container = styled('div')`
  display: flex;
  margin-right: ${(props: any) => props.marginRight}px;
  opacity: 0.9;
`;

export interface QueuedSkills {
  [track: string]: SkillStateInfo[];
}

export interface SkillQueueListProps {
  queuedSkills: QueuedSkills;
}

class SkillQueueList extends React.Component<SkillQueueListProps> {
  public render() {
    return (
      <Container marginRight={50}>
        {_.values(this.props.queuedSkills).map((skillTrack, i) => {
          return (
            <Container key={i} marginRight={5}>
              {skillTrack.map((skill, i) => <SkillQueueItem key={skill.id} skill={skill} />)}
            </Container>
          );
        })}
      </Container>
    );
  }
}

export default SkillQueueList;
