/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import gql from 'graphql-tag';
import { GraphQL, GraphQLResult } from '@csegames/camelot-unchained/lib/graphql/react';
import { JobPanelTabQuery, VoxJobState } from 'gql/interfaces';
import { CraftingContext } from '../../CraftingContext';
import { JobIdToJobState } from '../../CraftingBase';
import { Tooltip } from 'shared/Tooltip';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

const query = gql`
  query JobPanelTabQuery($entityID: String!, $voxJobID: String!) {
    voxJob(entityID: $entityID, voxJobID: $voxJobID) {
      status {
        jobState
        recipeID
        jobType
      }
    }
  }
`;

// #region Tab constants
const TAB_DIMENSIONS = 40;
const TAB_FONT_SIZE = 24;
const TAB_MARGIN_RIGHT = 10;

const TAB_CONFIGURING_WIDTH = 22;
const TAB_CONFIGURING_HEIGHT = 48;

const TAB_RUNNING_CONTAINER_WIDTH = 70;
const TAB_RUNNING_CONTAINER_HEIGHT = 44;
const TAB_RUNNING_CONTAINER_LEFT = -20;
const TAB_RUNNING_GIF_DIMENSIONS = 30;
const TAB_RUNNING_GIF_TOP = 8;

const TAB_QUEUED_LEFT = -20;
const TAB_QUEUED_TOP = 4;

const TAB_FINISHED_WIDTH = 22;
const TAB_FINISHED_HEIGHT = 48;
// #endregion
const Tab = styled.div`
  position: relative;
  width: ${TAB_DIMENSIONS}px;
  height: ${TAB_DIMENSIONS}px;
  font-size: ${TAB_FONT_SIZE}px;
  margin-right: ${TAB_MARGIN_RIGHT}px;
  text-align: center;
  color: white;
  cursor: pointer;
  z-index: ${(props: React.HTMLProps<HTMLDivElement> & { zIndex: number }) => props.zIndex};

  &:hover {
    -webkit-filter: brightness(130%);
    filter: brightness(130%);
  }

  &.active {
    -webkit-filter: brightness(200%);
    filter: brightness(200%);
  }

  &:before {
    content: '';
    position: absolute;
    width: ${TAB_DIMENSIONS}px;
    height: ${TAB_DIMENSIONS}px;
    background-repeat: no-repeat;
    background-position: center center;
    background-size: contain;
  }

  &.none:before {
    background-image: url(../images/crafting/uhd/que-slot.png);
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  &.configuring:before {
    width: ${TAB_CONFIGURING_WIDTH}px;
    height: ${TAB_CONFIGURING_HEIGHT}px;
    background-image: url(../images/crafting/uhd/que-slot-filled.png);
    right: 0;
    left: 0;
    margin: auto;
  }

  &.running {
    &:before {
      background-image: url(../images/crafting/uhd/que-current.png);
      background-repeat: no-repeat;
      background-size: contain;
      width: ${TAB_RUNNING_CONTAINER_WIDTH}px;
      height: ${TAB_RUNNING_CONTAINER_HEIGHT}px;
      left: ${TAB_RUNNING_CONTAINER_LEFT}px;
    }
    &:after {
      content: '';
      position: absolute;
      width: ${TAB_RUNNING_GIF_DIMENSIONS}px;
      height: ${TAB_RUNNING_GIF_DIMENSIONS}px;
      top: ${TAB_RUNNING_GIF_TOP}px;
      left: 0px;
      background-image: url(../images/crafting/uhd/que-crafting-gif.gif);
      background-repeat: no-repeat;
      background-size: contain;
    }
  }

  &.queued {
    &:before {
      width: ${TAB_RUNNING_CONTAINER_WIDTH}px;
      height: ${TAB_RUNNING_CONTAINER_HEIGHT}px;
      left: ${TAB_QUEUED_LEFT}px;
      top: ${TAB_QUEUED_TOP}px;
      background-image: url(../images/crafting/uhd/queued-job-current.png);
      background-size: contain;
    }
  }

  &.finished:before {
    width: ${TAB_FINISHED_WIDTH}px;
    height: ${TAB_FINISHED_HEIGHT}px;
    background-image: url(../images/crafting/uhd/que-done.png);
    right: 0;
    left: 0;
    margin: auto;
  }

  @media (max-width: 2560px) {
    width: ${TAB_DIMENSIONS * MID_SCALE}px;
    height: ${TAB_DIMENSIONS * MID_SCALE}px;
    font-size: ${TAB_FONT_SIZE * MID_SCALE}px;
    margin-right: ${TAB_MARGIN_RIGHT * MID_SCALE}px;
    z-index: 10;

    &:before {
      width: ${TAB_DIMENSIONS * MID_SCALE}px;
      height: ${TAB_DIMENSIONS * MID_SCALE}px;
    }

    &.configuring:before {
      width: ${TAB_CONFIGURING_WIDTH * MID_SCALE}px;
      height: ${TAB_CONFIGURING_HEIGHT * MID_SCALE}px;
    }

    &.running {
      &:before {
        width: ${TAB_RUNNING_CONTAINER_WIDTH * MID_SCALE}px;
        height: ${TAB_RUNNING_CONTAINER_HEIGHT * MID_SCALE}px;
        left: ${TAB_RUNNING_CONTAINER_LEFT * MID_SCALE}px;
      }
      &:after {
        width: ${TAB_RUNNING_GIF_DIMENSIONS * MID_SCALE}px;
        height: ${TAB_RUNNING_GIF_DIMENSIONS * MID_SCALE}px;
        top: ${TAB_RUNNING_GIF_TOP * MID_SCALE}px;
      }
    }

    &.queued {
      &:before {
        width: ${TAB_RUNNING_CONTAINER_WIDTH * MID_SCALE}px;
        height: ${TAB_RUNNING_CONTAINER_HEIGHT * MID_SCALE}px;
        top: ${TAB_QUEUED_TOP * MID_SCALE}px;
      }
    }

    &.finished:before {
      width: ${TAB_FINISHED_WIDTH * MID_SCALE}px;
      height: ${TAB_FINISHED_HEIGHT * MID_SCALE}px;
    }
  }

  @media (max-width: 1920px) {
    width: ${TAB_DIMENSIONS * HD_SCALE}px;
    height: ${TAB_DIMENSIONS * HD_SCALE}px;
    font-size: ${TAB_FONT_SIZE * HD_SCALE}px;
    margin-right: ${TAB_MARGIN_RIGHT * HD_SCALE}px;
    z-index: 10;

    &:before {
      width: ${TAB_DIMENSIONS * HD_SCALE}px;
      height: ${TAB_DIMENSIONS * HD_SCALE}px;
    }

    &:none:before {
      background-image: url(../images/crafting/hd/que-slot.png);
    }

    &.configuring:before {
      background-image: url(../images/crafting/hd/que-slot-filled.png);
      width: ${TAB_CONFIGURING_WIDTH * HD_SCALE}px;
      height: ${TAB_CONFIGURING_HEIGHT * HD_SCALE}px;
    }

    &.running {
      &:before {
        background-image: url(../images/crafting/hd/que-current.png);
        width: ${TAB_RUNNING_CONTAINER_WIDTH * HD_SCALE}px;
        height: ${TAB_RUNNING_CONTAINER_HEIGHT * HD_SCALE}px;
        left: ${TAB_RUNNING_CONTAINER_LEFT * HD_SCALE}px;
      }
      &:after {
        background-image: url(../images/crafting/hd/que-crafting-gif.gif);
        width: ${TAB_RUNNING_GIF_DIMENSIONS * HD_SCALE}px;
        height: ${TAB_RUNNING_GIF_DIMENSIONS * HD_SCALE}px;
        top: ${TAB_RUNNING_GIF_TOP * HD_SCALE}px;
      }
    }

    &.queued {
      &:before {
        background-image: url(../images/crafting/hd/queued-job-current.png);
        width: ${TAB_RUNNING_CONTAINER_WIDTH * HD_SCALE}px;
        height: ${TAB_RUNNING_CONTAINER_HEIGHT * HD_SCALE}px;
        top: ${TAB_QUEUED_TOP * HD_SCALE}px;
      }
    }

    &.finished:before {
      background-image: url(../images/crafting/hd/que-done.png);
      width: ${TAB_FINISHED_WIDTH * HD_SCALE}px;
      height: ${TAB_FINISHED_HEIGHT * HD_SCALE}px;
    }
  }
`;

// #region TooltipContent constants
const TOOLTIP_CONTENT_PADDING_VERTICAL = 4;
const TOOLTIP_CONTENT_PADDING_HORIZONTAL = 10;
const TOOLTIP_FONT_SIZE = 28;
// #endregion
const TooltipContent = styled.div`
  padding: ${TOOLTIP_CONTENT_PADDING_VERTICAL}px ${TOOLTIP_CONTENT_PADDING_HORIZONTAL}px;
  font-size: ${TOOLTIP_FONT_SIZE}px;
  color: #CCC;

  @media (max-width: 2560px) {
    padding: ${TOOLTIP_CONTENT_PADDING_VERTICAL * MID_SCALE}px ${TOOLTIP_CONTENT_PADDING_HORIZONTAL * MID_SCALE}px;
    font-size: ${TOOLTIP_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding: ${TOOLTIP_CONTENT_PADDING_VERTICAL * HD_SCALE}px ${TOOLTIP_CONTENT_PADDING_HORIZONTAL * HD_SCALE}px;
    font-size: ${TOOLTIP_FONT_SIZE * HD_SCALE}px;
  }
`;

export interface ComponentProps {
  active: boolean;
  jobNumber: number;
  jobId: string;
  voxEntityID: string;
  onClick: (jobNumber: number) => void;
}

export interface Props extends ComponentProps {
  jobIdToJobState: JobIdToJobState;
  onUpdateJobIdToJobState: (jobIdToJobState: JobIdToJobState) => void;
}

class JobPanelTab extends React.Component<Props> {
  public render() {
    const { active } = this.props;
    const isQueued = this.isQueued();
    const jobState = this.getJobState();
    const className = `${isQueued ? 'queued' : jobState.toLowerCase()} ${active ? 'active' : ''}`;
    return (
      <Tooltip content={<TooltipContent>Job State: {isQueued ? 'Queued' : jobState}</TooltipContent>}>
        <Tab className={className} onClick={this.onClick} zIndex={this.getZIndex()}>
          {this.props.jobId &&
            <GraphQL
              query={{
                query,
                variables: {
                  entityID: this.props.voxEntityID,
                  voxJobID: this.props.jobId,
                },
              }}
              onQueryResult={this.handleQueryResult}
            />
          }
        </Tab>
      </Tooltip>
    );
  }

  private handleQueryResult = (graphql: GraphQLResult<JobPanelTabQuery.Query>) => {
    if (!graphql || !graphql.data || !graphql.data.voxJob) return graphql;

    const voxJobStatus = graphql.data.voxJob.status;
    const jobIdToJobState = cloneDeep(this.props.jobIdToJobState);
    jobIdToJobState[this.props.jobId] = {
      jobNumber: this.props.jobNumber,
      jobState: voxJobStatus.jobState,
      jobIdentifier: voxJobStatus.recipeID,
      jobType: voxJobStatus.jobType,
    };
    this.props.onUpdateJobIdToJobState(jobIdToJobState);
  }

  private getJobState = () => {
    const { jobId, jobIdToJobState } = this.props;
    return (jobId && jobIdToJobState[jobId] && jobIdToJobState[jobId].jobState) || VoxJobState.None;
  }

  private isQueued = () => {
    let queued: boolean = false;
    Object.keys(this.props.jobIdToJobState).forEach((jobId) => {
      const jobStateInfo = this.props.jobIdToJobState[jobId];
      if (jobStateInfo.jobNumber < this.props.jobNumber &&
          jobStateInfo.jobState === VoxJobState.Running && this.getJobState() === VoxJobState.Running) {
        queued = true;
      }
    });

    return queued;
  }

  private getZIndex = () => {
    return 6 - this.props.jobNumber;
  }

  private onClick = () => {
    this.props.onClick(this.props.jobNumber);
  }
}

class JobPanelTabWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    return (
      <CraftingContext.Consumer>
        {({ jobIdToJobState, onUpdateJobIdToJobState }) => (
          <JobPanelTab
            {...this.props}
            jobIdToJobState={jobIdToJobState}
            onUpdateJobIdToJobState={onUpdateJobIdToJobState}
          />
        )}
      </CraftingContext.Consumer>
    );
  }
}

export default JobPanelTabWithInjectedContext;
