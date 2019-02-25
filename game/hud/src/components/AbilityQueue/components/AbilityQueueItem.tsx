/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as _ from 'lodash';
import { styled } from 'linaria/react';
import { css } from 'linaria';

import { AbilityButtonInfo } from '../../AbilityBar/AbilityButton/AbilityButtonView';
import { abilityStateColors, makeGlowPathFor } from '../../AbilityBar/AbilityButton/lib';

const Container = styled.div`
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 15px;
  background-size: cover;
  background-repeat: no-repeat;
  margin-right: 5px;

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
  stroke: ${abilityStateColors.queuedColor};
`;

export interface SkillQueueItemProps {
  ability: AbilityButtonInfo;
}

export interface SkillQueueItemState {
  current: number;
  end: number;
}

class SkillQueueItem extends React.Component<SkillQueueItemProps, SkillQueueItemState> {
  private timerListener: any;
  private mounted: boolean;

  constructor(props: SkillQueueItemProps) {
    super(props);
    this.state = {
      current: 0,
      end: 0,
    };
  }

  public render() {
    const { ability } = this.props;

    const x = 15;
    const y = 15;
    const radius = 15;
    const defaultPath = `M 14.99 0 A ${x} ${y} 0 1 0 ${radius} 0`;
    let timerPath = defaultPath;
    let isQueued = false;

    if (this.state.end > 0 && ability.timing && ability.status & AbilityButtonState.Preparation) {
      timerPath = makeGlowPathFor(this.state.end, this.state.current, radius, x, y, true);
    }

    if (ability.status & AbilityButtonState.Queued) {
      isQueued = true;
    }

    const strokeColor = ability.status & AbilityButtonState.Preparation ? 'yellow' : abilityStateColors.queuedColor;
    return (
      <Container style={{ backgroundImage: `url(${ability.icon})` }}>
        <svg width='30px' height='30px'>
          <path d={defaultPath} fill='none' strokeWidth='3px' className='inner-bg-blur'></path>
          <path d={defaultPath} fill='none' strokeWidth='3px' className={isQueued ? queuedPathStyle : 'inner-bg'}></path>
          <path d={timerPath} fill='none' strokeWidth='3px' className='inner-blur' style={{ stroke: strokeColor }}></path>
          <path d={timerPath} fill='none' strokeWidth='3px' className='inner' style={{ stroke: strokeColor }}></path>
        </svg>
      </Container>
    );
  }

  public componentDidMount() {
    this.mounted = true;
    this.timerListener = game.on(`ability-button-timer-${this.props.ability.id}`, (current: number, end: number) => {
      if (this.mounted) {
        this.setState({ current, end });
      }
    });
  }

  public shouldComponentUpdate(nextProps: SkillQueueItemProps, nextState: SkillQueueItemState) {
    return nextState.current !== this.state.current ||
      !_.isEqual(nextProps.ability, this.props.ability);
  }

  public componentWillUnmount() {
    this.mounted = false;
    game.off(this.timerListener);
  }
}

export default SkillQueueItem;
