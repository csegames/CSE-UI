/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { colors } from '../../styleConstants';

const ResetAlertOverlay = styled('div')`
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.7);
  transition: opacity 0.3s;
  z-index: 10;
  opacity: ${props => props.opacity};
  visibility: ${props => props.visibility};
`;

const ResetAlertDialog = styled('div')`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  background-color: #FFF;
  padding: 15px;
  width: 300px;
  height: 200px;
  z-index: 11;
  transition: opacity 0.3s;
  border-radius: 7px;
  opacity: ${props => props.opacity};
  visibility: ${props => props.visibility};
`;

const AlertPrimaryText = styled('div')`
  font-size: 1.6em;
  font-weight: bold;
  margin: 0;
  colro: #858585;
`;

const ResetAlertDialogText = styled('div')`
  color: #858585;
`;

const ResetAlertButtonContainer = styled('div')`
  display: flex;
  align-items: center;
`;

const AlertButton = styled('div')`
  cursor: pointer;
  padding: 5px 10px;
  background-color: #CCC;
  color: #444;
  transition: background-color 0.1s;
  &:active {
    box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.3);
  }
  &:hover {
    background-color: #BFBFBF;
  }
`;

const ResetAlertButton = styled('div')`
  cursor: pointer;
  padding: 5px 10px;
  background-color: ${colors.banePrimary};
  color: white;
  transition: background-color 0.1s;
  margin-left: 15px;
  &:active {
    box-shadow: inset 0 0 8px rgba(0, 0, 0, 0.3);
  }
  &:hover {
    background-color: #BF4333;
  }
`;

export interface ResetAlertProps {
  showResetAllAlertDialog: boolean;
  showResetBoonAlertDialog: boolean;
  showResetBaneAlertDialog: boolean;
  onResetClick: (type: 'boons' | 'banes' | 'both') => void;
  onCancelClick: () => void;
}

class ResetAlert extends React.Component<ResetAlertProps> {
  constructor(props: ResetAlertProps) {
    super(props);
  }

  public render() {

    const { showResetAllAlertDialog, showResetBoonAlertDialog, showResetBaneAlertDialog } = this.props;
    return (
      <div>
        <ResetAlertOverlay
          opacity={showResetBoonAlertDialog || showResetBaneAlertDialog || showResetAllAlertDialog ? 1 : 0}
          visibility={showResetBoonAlertDialog || showResetBaneAlertDialog || showResetAllAlertDialog ?
            'visible' : 'hidden'}
        />
        <ResetAlertDialog
          opacity={showResetBoonAlertDialog || showResetBaneAlertDialog || showResetAllAlertDialog ? 1 : 0}
          visibility={showResetBoonAlertDialog || showResetBaneAlertDialog || showResetAllAlertDialog ?
            'visible' : 'hidden'}>
          <AlertPrimaryText>Are you sure?</AlertPrimaryText>
          <ResetAlertDialogText>
            Are you sure you want to reset all&nbsp;
            {showResetBoonAlertDialog && !showResetBaneAlertDialog && 'Boons'}
            {showResetBaneAlertDialog && !showResetBoonAlertDialog && 'Banes'}
            {showResetBoonAlertDialog && showResetBaneAlertDialog && 'Banes & Boons'}?
          </ResetAlertDialogText>
          <ResetAlertButtonContainer>
            <AlertButton onClick={this.props.onCancelClick}>Cancel</AlertButton>
            <ResetAlertButton onClick={this.onReset}>
              Yes, reset!
            </ResetAlertButton>
          </ResetAlertButtonContainer>
        </ResetAlertDialog>
      </div>
    );
  }

  private onReset = () => {
    const { showResetBaneAlertDialog, showResetBoonAlertDialog } = this.props;
    if (showResetBaneAlertDialog && showResetBoonAlertDialog) {
      this.props.onResetClick('both');
    } else if (showResetBoonAlertDialog) {
      this.props.onResetClick('boons');
    } else if (showResetBaneAlertDialog) {
      this.props.onResetClick('banes');
    }
  }
}

export default ResetAlert;
