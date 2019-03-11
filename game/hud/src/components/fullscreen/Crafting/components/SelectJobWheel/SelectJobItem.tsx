/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { VoxJobType } from 'gql/interfaces';
import { PRIMARY_COLOR } from '../SelectorWheel';
import { getJobTypeIcon } from '../../lib/utils';
import { MediaBreakpoints } from 'fullscreen/Crafting/lib/MediaBreakpoints';

const Container = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: black;
  border: 2px solid rgba(117, 255, 204, 0.8);
  cursor: pointer;
  pointer-events: all;
  &:hover {
    filter: brightness(130%);
    -webkit-filter: brightness(130%);
  }
  &.selected {
    filter: brightness(150%);
    -webkit-filter: brightness(150%);
  }
  &.hide {
    visibility: hidden;
    opacity: 0;
    pointer-events: none;
  }
`;

const InnerCircle = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  width: 90%;
  height: 90%;
  border-radius: 50%;
  border: 1px solid rgba(117, 255, 204, 0.6);
  cursor: pointer;
`;

const Icon = styled.div`
  color: ${PRIMARY_COLOR};
  font-size: 30px !important;
  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    font-size: 60px !important;
  }
`;

const Text = styled.div`
  color: ${PRIMARY_COLOR};
  text-transform: uppercase;
  font-size: 12px;
  font-family: Caudex;
  letter-spacing: 1px;
  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    font-size: 24px;
  }
`;

export interface Props {
  hide: boolean;
  selectedJobType: VoxJobType;
  jobType: VoxJobType;
  onClick: (jobType: VoxJobType) => void;
}

class SelectJobItem extends React.Component<Props> {
  public render() {
    const { hide, jobType } = this.props;
    const isSelected = this.props.selectedJobType === this.props.jobType;
    return (
      <Container onClick={this.onClick} className={`${isSelected ? 'selected' : ''}  ${hide ? 'hide' : ''}`}>
        <InnerCircle />
        <Icon className={getJobTypeIcon(jobType)} />
        <Text>{jobType}</Text>
      </Container>
    );
  }

  private onClick = () => {
    this.props.onClick(this.props.jobType);
  }
}

export default SelectJobItem;
