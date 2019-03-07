/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import moment from 'moment';
import { styled } from '@csegames/linaria/react';
import { VoxJob, VoxJobType, VoxJobState } from 'gql/interfaces';
import { isEqual } from 'lodash';
import CancelJob from '../ActionButtons/CancelJob';
import { CraftingContext } from '../../CraftingContext';
import { JobIdToJobState } from '../../CraftingBase';
import { MediaBreakpoints } from 'services/session/MediaBreakpoints';

const Container = styled.div`
  position: absolute;
  top: -25px;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(to top, rgba(8, 26, 27, 0.2), rgba(8, 26, 27, 0.8));
  color: white;
  font-size: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  z-index: 99;
`;

const JobTypeIcon = styled.img`
  position: absolute;
  top: 50px;
  right: 0;
  left: 0;
  margin: auto;
`;

const CancelContainer = styled.div`
  position: absolute;
  right: 0;
  left: 0;
  bottom: 140px;
  margin: auto;
  display: flex;
  flex-direction: column;
`;

const QueuedContainer = styled.div`
  position: absolute;
  right: 0;
  left: 0;
  bottom: 120px;
  margin: auto;
  text-align: center;

  @media (min-width: ${MediaBreakpoints.UHD}px) {
    font-size: 48px;
  }
`;

const JobActionText = styled.div`
  font-size: 12px;
  letter-spacing: 1px;
  text-transform: uppercase;
  font-family: Caudex;
  z-index: 10;
  text-align: center;
  color: #B1FFF3;
  margin-top: 100px;

  @media (min-width: ${MediaBreakpoints.UHD}px) {
    font-size: 24px;
  }
`;

export interface ComponentProps {
  jobNumber: number;
  voxJob: VoxJob.Fragment;
  onJobFinish: () => void;
}

export interface Props extends ComponentProps {
  jobIdToJobState: JobIdToJobState;
}

export interface State {
  timeRemaining: number;
}

class JobStartedOverlay extends React.Component<Props, State> {
  private timeRemainingTimeout: number;
  private jobFinishTimeout: number;
  constructor(props: Props) {
    super(props);
    this.state = {
      timeRemaining: Math.round(props.voxJob.timeRemaining),
    };
  }

  public render() {
    return (
      <UIContext.Consumer>
        {(uiContext: UIContext) => {
          const jobTypeIcon = this.getJobTypeIcon(uiContext);
          const isQueued = this.isQueued();
          return (
            <Container>
              <JobTypeIcon src={jobTypeIcon} />
              {!isQueued &&
                <CancelContainer>
                  <CancelJob jobId={this.props.voxJob.id} jobNumber={this.props.jobNumber} isQueued={isQueued} />
                  <JobActionText>{this.getJobTypeActionText()}: {this.getTimeRemainingText()}</JobActionText>
                </CancelContainer>
              }
              {isQueued &&
                <QueuedContainer>
                  This job will start once the previous one finishes.
                </QueuedContainer>
              }
            </Container>
          );
        }}
      </UIContext.Consumer>
    );
  }

  public componentDidMount() {
    this.updateTimeRemaining();
  }

  public componentDidUpdate(prevProps: Props) {
    if (this.props.voxJob && !isEqual(prevProps.voxJob, this.props.voxJob)) {
      this.setState({ timeRemaining: Math.round(this.props.voxJob.timeRemaining) });
    }
  }

  public componentWillUnmount() {
    clearTimeout(this.timeRemainingTimeout);
    clearTimeout(this.jobFinishTimeout);
  }

  private updateTimeRemaining = () => {
    const nextTimeRemaining = this.state.timeRemaining - 1;

    if (nextTimeRemaining === 0) {
      this.jobFinishTimeout = window.setTimeout(() => this.props.onJobFinish(), 1000);
    } else {
      this.timeRemainingTimeout = window.setTimeout(this.updateTimeRemaining, 1000);
    }

    this.setState({ timeRemaining: nextTimeRemaining });
  }

  private isQueued = () => {
    let queued: boolean = false;
    Object.keys(this.props.jobIdToJobState).forEach((jobId) => {
      const jobStateInfo = this.props.jobIdToJobState[jobId];
      if (jobStateInfo.jobNumber < this.props.jobNumber && jobStateInfo.jobState === VoxJobState.Running) {
        queued = true;
      }
    });

    return queued;
  }

  private getJobTypeIcon = (uiContext: UIContext) => {
    const { voxJob } = this.props;
    const imagePrefix = uiContext.isUHD() ? '4k' : '1080';

    switch (voxJob.jobType) {
      case VoxJobType.Make:
      case VoxJobType.Block: {
        return `../images/crafting/${imagePrefix}/make.png`;
      }

      case VoxJobType.Purify: {
        return `../images/crafting/${imagePrefix}/purify.png`;
      }

      case VoxJobType.Repair: {
        return `../images/crafting/${imagePrefix}/repair.png`;
      }

      case VoxJobType.Salvage: {
        return `../images/crafting/${imagePrefix}/salvage.png`;
      }

      case VoxJobType.Shape: {
        return `../images/crafting/${imagePrefix}/shape.png`;
      }

      default: {
        return `../images/crafting/${imagePrefix}/make.png`;
      }
    }
  }

  private getJobTypeActionText = () => {
    const { voxJob } = this.props;

    switch (voxJob.jobType) {
      case VoxJobType.Make:
      case VoxJobType.Block: {
        return 'Making';
      }

      case VoxJobType.Purify: {
        return 'Purifying';
      }

      case VoxJobType.Repair: {
        return 'Repairing';
      }

      case VoxJobType.Salvage: {
        return 'Salvaging';
      }

      case VoxJobType.Shape: {
        return 'Shaping';
      }

      default: {
        return 'Crafting';
      }
    }
  }

  private getTimeRemainingText = () => {
    return `${moment.utc(this.state.timeRemaining * 1000).format('HH:mm:ss')}`;
  }
}

class JobStartedOverlayWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    return (
      <CraftingContext.Consumer>
        {({ jobIdToJobState }) => (
          <JobStartedOverlay {...this.props} jobIdToJobState={jobIdToJobState} />
        )}
      </CraftingContext.Consumer>
    );
  }
}

export default JobStartedOverlayWithInjectedContext;
