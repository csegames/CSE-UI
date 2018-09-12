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
import { MediaBreakpoints } from 'services/session/MediaBreakpoints';
import { Tooltip } from 'components/Tooltip';

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

const Tab = styled.div`
  position: relative;
  width: 20px;
  height: 20px;
  font-size: 12px;
  text-align: center;
  color: white;
  cursor: pointer;
  margin-right: 5px;
  z-index: ${(props: React.HTMLProps<HTMLDivElement> & { zIndex: number }) => props.zIndex};
  &:hover {
    -webkit-filter: brightness(130%);
    filter: brightness(130%);
  }
  &.active {
    -webkit-filter: brightness(200%);
    filter: brightness(200%);
  }

  &.none:before {
    content: '';
    position: absolute;
    width: 20px;
    height: 20px;
    background: url(../images/crafting/1080/que-slot.png) no-repeat;
    background-position: center center;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  &.configuring:before {
    content: '';
    position: absolute;
    width: 11px;
    height: 24px;
    background: url(../images/crafting/1080/que-slot-filled.png) no-repeat;
    background-position: center center;
    right: 0;
    left: 0;
    margin: auto;
  }

  &.running {
    &:before {
      content: '';
      position: absolute;
      width: 35px;
      height: 22px;
      background: url(../images/crafting/1080/que-current.png) no-repeat;
      background-size: contain;
      left: -10px;
      top: 2px;
    }
    &:after {
      content: '';
      position: absolute;
      width: 15px;
      height: 15px;
      top: 5px;
      left: 0px;
      background: url(../images/crafting/1080/que-crafting-gif.gif) no-repeat;
      background-size: contain;
    }
  }

  &.queued {
    &:before {
      content: '';
      position: absolute;
      width: 35px;
      height: 22px;
      background: url(../images/crafting/1080/queued-job-current.png) no-repeat;
      background-size: contain;
      left: -10px;
      top: 2px;
    }
  }

  &.finished:before {
    content: '';
    position: absolute;
    width: 11px;
    height: 24px;
    background: url(../images/crafting/1080/que-done.png) no-repeat;
    background-position: center center;
    right: 0;
    left: 0;
    margin: auto;
  }

  @media (min-width: ${MediaBreakpoints.UHD}px) {
    width: 26px;
    height: 62px;
    font-size: 24px;
    margin: 0 15px;
    z-index: 10;
    &.none:before {
      background: url(../images/crafting/4k/que-slot.png) no-repeat;
      background-position: center center;
      width: 26px;
      height: 62px;
    }

    &.configuring:before {
      background: url(../images/crafting/4k/que-slot-filled.png) no-repeat;
      backgruond-position: center center;
      width: 26px;
      height: 62px;
    }

    &.running {
      &:before {
        background: url(../images/crafting/4k/que-current.png) no-repeat;
        background-size: contain;
        width: 60px;
        height: 53px;
        top: 15px;
      }
      &:after {
        background: url(../images/crafting/4k/que-crafting-gif.gif) no-repeat;
        background-size: contain;
        width: 25px;
        height: 25px;
        top: 17px;
        left: 10px;
      }
    }

    &.queued {
      &:before {
        background: url(../images/crafting/4k/queued-job-current.png) no-repeat;
        background-size: contain;
        width: 60px;
        height: 53px;
        top: 15px;
      }
    }

    &.finished:before {
      background: url(../images/crafting/4k/que-done.png) no-repeat;
      background-position: center center;
      width: 26px;
      height: 62px;
    }
  }
`;

const TooltipContent = styled.div`
  padding: 2px 5px;
  font-size: 14px;
  color: #CCC;

  @media (min-width: ${MediaBreakpoints.UHD}px) {
    padding: 6px 15px;
    font-size: 28px;
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
