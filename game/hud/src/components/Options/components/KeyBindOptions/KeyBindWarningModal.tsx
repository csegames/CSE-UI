/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import styled from 'react-emotion';
import { utils, client } from '@csegames/camelot-unchained';
import { ConfigInfo } from '../../OptionsMain';

const Container = styled('div')`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  background-color: #454545;
  color: ${utils.lightenColor('#454545', 100)};
  height: 100%;
  width: 100%;
`;

const ExclamationTriangle = styled('div')`
  font-size: 50px;
  margin-bottom: 15px;
`;

const DialogText = styled('div')`
  text-align: center;
  font-size: 22px;
  margin: 0;
  padding: 0;
`;

const ImportantText = styled('div')`
  color: white;
`;

const ButtonContainer = styled('div')`
  display: flex;
`;

const Button = styled('div')`
  color: ${utils.lightenColor('#454545', 100)};
`;

const Close = styled('div')`
  position: absolute;
  top: 5px;
  right: 5px;
  color: #CDCDCD;
  font-size: 20px;
  margin-right: 5px;
  cursor: pointer;
  user-select: none;
  &:hover {
    color: #BBB;
  }
`;

export interface WarningModalInfo {
  currentKeyBind: ConfigInfo;
  nextKeyBind: ConfigInfo;
}

export interface KeyBindWarningModalProps {
  warningModalInfo: WarningModalInfo;
  onCancelPress: () => void;
  onConfirmPress: (warningModalInfo: WarningModalInfo) => void;
}

export interface KeyBindWarningModalState {
}

export class KeyBindWarningModal extends React.Component<KeyBindWarningModalProps, KeyBindWarningModalState> {
  constructor(props: KeyBindWarningModalProps) {
    super(props);
    this.state = {
    };
  }

  public render() {
    const currentKeyBind = this.props.warningModalInfo && this.props.warningModalInfo.currentKeyBind;

    return this.props.warningModalInfo ? (
      <Container>
        <Close onClick={this.props.onCancelPress}>
          <i className='fa fa-times click-effect'></i>
        </Close>
        <ExclamationTriangle className='fa fa-exclamation-triangle' />
        <DialogText>
          <ImportantText>{currentKeyBind.name}&nbsp;</ImportantText>
          is already using the key bind
          <ImportantText>&nbsp;{currentKeyBind.value}</ImportantText>
        </DialogText>
        <DialogText>Are you sure you want to override it?</DialogText>
        <ButtonContainer>
          <Button onClick={() => this.props.onConfirmPress(this.props.warningModalInfo)}>
            Override
          </Button>
          <Button onClick={this.onCancelPress}>
            Cancel
          </Button>
        </ButtonContainer>
      </Container>
    ) : null;
  }

  private onCancelPress = () => {
    this.props.onCancelPress();
    client.ReleaseInputOwnership();
  }
}

export default KeyBindWarningModal;

