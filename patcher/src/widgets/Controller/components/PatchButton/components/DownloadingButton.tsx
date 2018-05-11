/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import * as events  from '@csegames/camelot-unchained/lib/events';
import styled, { keyframes } from 'react-emotion';
import { ButtonText, PatchButtonStyle } from '../styles';

const goldenColor = 'rgba(192, 173, 124, 0.9)';

const shineAnim = keyframes`
  0% {
    left: 30px;
    opacity: 0;
  }
  30% {
    opacity: 0.5;
  }
  100% {
    left: 35%;
    opacity: 0;
  }
`;

const DownloadingButtonView = styled('div')`
  ${PatchButtonStyle};
  background: url(images/controller/play-button-grey.png);
  filter: brightness(140%);
  &:hover {
    filter: brightness(140%);
  }
  &:hover:before {
    animation: none;
    -webkit-animation: none;
  }
  &:hover:after {
    animation: none;
    -webkit-animation: none;
  }
`;

const Shine = styled('div')`
  position: absolute;
  height: 90%;
  width: 70%;
  border-left-radius: 50%;
  background: linear-gradient(to right, transparent, ${goldenColor}, transparent);
  bottom: 5px;
  left: 15px;
  opacity: 0;
  -webkit-animation: ${shineAnim} 1.3s ease infinite;
  animation: ${shineAnim} 1.3s ease infinite;
  -webkit-clip-path: polygon(5% 0%, 100% 0%, 90% 100%, 0% 100%);
  clip-path: polygon(5% 0%, 100% 0%, 90% 100%, 0% 100%);
  z-index: 2;
`;

export interface DownloadingButtonProps {
  text: string;
  onClick?: (e: React.MouseEvent<HTMLDivElement>) => void;
}

class DownloadingButton extends React.Component<DownloadingButtonProps> {
  public render() {
    return (
      <DownloadingButtonView onClick={this.props.onClick} onMouseOver={this.playSound}>
        <ButtonText>{this.props.text}</ButtonText>
        <Shine />
      </DownloadingButtonView>
    );
  }

  private playSound = () => {
    events.fire('play-sound', 'select-change');
  }
}

export default DownloadingButton;
