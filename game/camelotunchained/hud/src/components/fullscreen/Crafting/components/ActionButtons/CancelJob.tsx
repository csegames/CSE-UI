/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { getJobContext } from '../../lib/utils';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

const ConfirmationContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const ConfirmationButtons = styled.div`
  display: flex;
`;

// #region CancelButton constants
const CANCEL_BUTTON_WIDTH = 302;
const CANCEL_BUTTON_HEIGHT = 90;
const CANCEL_BUTTON_FONT_SIZE = 24;
const CANCEL_BUTTON_LETTER_SPACING = 4;
const CANCEL_BUTTON_MARGIN_HORIZONTAL = 10;
// #endregion
const CancelButton = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  align-self: center;
  width: ${CANCEL_BUTTON_WIDTH}px;
  height: ${CANCEL_BUTTON_HEIGHT}px;
  font-size: ${CANCEL_BUTTON_FONT_SIZE}px;
  letter-spacing: ${CANCEL_BUTTON_LETTER_SPACING}px;
  margin: 0 ${CANCEL_BUTTON_MARGIN_HORIZONTAL}px;
  background-image: url(../images/crafting/uhd/vox-cancel-button-border.png);
  background-repeat: no-repeat;
  background-size: contain;
  text-align: center;
  font-family: Caudex;
  text-transform: uppercase;
  cursor: pointer;

  @media (max-width: 2560px) {
    width: ${CANCEL_BUTTON_WIDTH * MID_SCALE}px;
    height: ${CANCEL_BUTTON_HEIGHT * MID_SCALE}px;
    font-size: ${CANCEL_BUTTON_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${CANCEL_BUTTON_LETTER_SPACING * MID_SCALE}px;
    margin: 0 ${CANCEL_BUTTON_MARGIN_HORIZONTAL * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    background-image: url(../images/crafting/hd/vox-cancel-button-border.png) no-repeat;
    width: ${CANCEL_BUTTON_WIDTH * HD_SCALE}px;
    height: ${CANCEL_BUTTON_HEIGHT * HD_SCALE}px;
    font-size: ${CANCEL_BUTTON_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${CANCEL_BUTTON_LETTER_SPACING * HD_SCALE}px;
    margin: 0 ${CANCEL_BUTTON_MARGIN_HORIZONTAL * HD_SCALE}px;
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
