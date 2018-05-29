/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import styled, { css } from 'react-emotion';
import { events, SkillStateStatusEnum } from '@csegames/camelot-unchained';
import { SkillStateInfo, skillStateColors, makeGlowPathFor } from '../../SkillBar/SkillButton/lib';

const Container = styled('div')`
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-image: url(${(props: any) => props.backgroundImage});
  background-size: cover;
  background-repeat: no-repeat;
  margin-right: 5px;

  .inner,
  .inner-blur {
    stroke: ${(props: any) => props.strokeColor};
  }

  .inner-bg {
    stroke: #000;
  }

  svg {
    position: absolute;
    z-index: 1;
    pointer-events: none;
    border-radius: 15px;
  }
`;

const queuedPathStyle = css`
  stroke: ${skillStateColors.queuedColor};
`;

export interface SkillQueueItemProps {
  skill: SkillStateInfo;
}

export interface SkillQueueItemState {
  current: number;
}

class SkillQueueItem extends React.Component<SkillQueueItemProps, SkillQueueItemState> {
  private timerListener: any;
  private mounted: boolean;

  constructor(props: SkillQueueItemProps) {
    super(props);
    this.state = {
      current: 0,
    };
  }

  public render() {
    const { skill } = this.props;

    const x = 15;
    const y = 15;
    const radius = 15;
    const defaultPath = `M 14.99 0 A ${x} ${y} 0 1 0 ${radius} 0`;
    let timerPath = defaultPath;
    let isQueued = false;

    if (skill.timing && skill.status & SkillStateStatusEnum.Preparation) {
      timerPath = makeGlowPathFor(skill.timing.end, this.state.current, radius, x, y, true);
    }

    if (skill.status & SkillStateStatusEnum.Queued) {
      isQueued = true;
    }

    return (
      <Container
        backgroundImage={skill.info.icon}
        strokeColor={skill.status & SkillStateStatusEnum.Preparation ? 'yellow' : skillStateColors.queuedColor}>
        <svg width='30px' height='30px'>
          <path d={defaultPath} fill='none' strokeWidth='3px' className='inner-bg-blur'></path>
          <path d={defaultPath} fill='none' strokeWidth='3px' className={isQueued ? queuedPathStyle : 'inner-bg'}></path>
          <path d={timerPath} fill='none' strokeWidth='3px' className='inner-blur'></path>
          <path d={timerPath} fill='none' strokeWidth='3px' className='inner'></path>
        </svg>
      </Container>
    );
  }

  public componentDidMount() {
    this.mounted = true;
    this.timerListener = events.on(`skill-button-timer-${this.props.skill.id}`, (current: number) => {
      if (this.mounted) {
        this.setState({ current });
      }
    });
  }

  public shouldComponentUpdate(nextProps: SkillQueueItemProps, nextState: SkillQueueItemState) {
    return nextState.current !== this.state.current ||
      !_.isEqual(nextProps.skill, this.props.skill);
  }

  public componentWillUnmount() {
    this.mounted = false;
    events.off(this.timerListener);
  }
}

export default SkillQueueItem;
