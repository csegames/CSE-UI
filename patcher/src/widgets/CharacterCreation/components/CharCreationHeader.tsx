/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { toTitleCase } from '@csegames/camelot-unchained/lib/utils/textUtils';
import { CharacterCreationPage } from '../index';

const Header = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 2px;
  background-color: #0D0D0D;
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  z-index: 10;
  font-size: 14px;
`;

const ActionContainer = styled('div')`
  display: flex;
  align-items: center;
`;

const Button = styled('div')`
  cursor: pointer;
  color: #6F6F6F;
  margin-right: 15px;
  &:hover {
    color: #9C9C9C;
  }
`;

const CloseButton = styled('div')`
  width: auto;
  height: auto;
  padding: 1px 6px;
  text-align: center;
  font-family:"caudex";
  border-image: linear-gradient(180deg,#e2e2e2,#888888) stretch;
  border-style: solid;
  border-width: 1px 3px;
  transition: background-color .3s;
  background-color: rgba(17, 17, 17, 0.8);
  border-image-slice: 1;
  color: #bfbfbf;
  cursor: pointer;
  font-size: 14px;
  letter-spacing: 0;
  text-transform: uppercase;
  -webkit-mask-image: url(images/controller/button-mask.png);
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: cover;
  transition: all ease .2s;
  &:hover {
    background-color: rgba(36, 36, 36, 0.8);
    border-image-slice: 1;
    color: #e6e6e6;
  }
`;

export interface CharCreationHeaderProps {
  selectedServerName: string;
  onCloseClick: () => void;
  onHelpClick: () => void;
  page: number;
}

class CharCreationHeader extends React.Component<CharCreationHeaderProps> {
  public render() {
    return (
      <Header>
        <span>[ {this.props.selectedServerName} ] Character Creation -
          {toTitleCase(CharacterCreationPage[this.props.page])}
        </span>
        <ActionContainer>
          <Button onClick={this.props.onHelpClick}>
            HELP?
          </Button>
          <CloseButton onClick={this.props.onCloseClick}>X</CloseButton>
        </ActionContainer>
      </Header>
    );
  }
}

export default CharCreationHeader;
