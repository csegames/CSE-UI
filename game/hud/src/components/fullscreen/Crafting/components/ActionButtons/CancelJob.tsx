/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { getJobContext } from '../../lib/utils';
import { MediaBreakpoints } from 'fullscreen/Crafting/lib/MediaBreakpoints';

const ConfirmationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ConfirmationButtons = styled.div`
  display: flex;
`;

const CancelButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  width: 156px;
  height: 45px;
  background: url(../images/crafting/1080/vox-cancel-button-border.png) no-repeat;
  text-align: center;
  font-family: Caudex;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 2px;
  cursor: pointer;
  margin: 0 5px;

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    background: url(../images/crafting/4k/vox-cancel-button-border.png) no-repeat;
    background-size: contain;
    width: 203px;
    height: 56px;
    font-size: 16px;
    letter-spacing: 3px;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    background: url(../images/crafting/4k/vox-cancel-button-border.png) no-repeat;
    width: 382px;
    height: 110px;
    font-size: 24px;
    letter-spacing: 4px;
  }

  &:hover {
    -webkit-filter: brightness(130%);
    filter: brightness(130%);
  }
`;

export interface ComponentProps {
  jobNumber: number;
  jobId: string;
  isQueued: boolean;
}

export interface InjectedProps {
  onCancelJob: (jobId: string, isQueued?: boolean) => void;
}

export type Props = ComponentProps & InjectedProps;

export interface State {
  showConfirmation: boolean;
}

class CancelJob extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showConfirmation: false,
    };
  }

  public render() {
    if (!this.state.showConfirmation) {
      return (
        <CancelButton onClick={this.onToggleConfirmation}>Cancel</CancelButton>
      );
    }

    return (
      <ConfirmationContainer>
        Are you sure?
        <ConfirmationButtons>
          <CancelButton onClick={this.onCancelJob}>Yes</CancelButton>
          <CancelButton onClick={this.onToggleConfirmation}>No</CancelButton>
        </ConfirmationButtons>
      </ConfirmationContainer>
    );
  }

  private onToggleConfirmation = () => {
    this.setState({ showConfirmation: !this.state.showConfirmation });
  }

  private onCancelJob = () => {
    this.props.onCancelJob(this.props.jobId, this.props.isQueued);
    this.setState({ showConfirmation: false });
  }
}

class CancelJobWithInjectedContext extends React.Component<ComponentProps> {
  public render() {
    const JobContext = getJobContext(this.props.jobNumber);
    return (
      <JobContext.Consumer>
        {({ onCancelJob }) => (
          <CancelJob {...this.props} onCancelJob={onCancelJob} />
        )}
      </JobContext.Consumer>
    );
  }
}

export default CancelJobWithInjectedContext;
