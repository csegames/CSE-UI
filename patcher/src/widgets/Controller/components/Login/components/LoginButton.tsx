/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { utils } from '@csegames/camelot-unchained';
import styled, { css, keyframes } from 'react-emotion';
import { LoginStatus } from '../index';
import GenericButton from '../../../../GenericButton';

const waveTextAnimation = keyframes`
  0% {
    opacity: .3;
    color: #ececec;
  }
  80% {
    opacity: 1;
    color: #d7bb4d;
  }
  100% {
    opacity: 1;
    color: #d7bb4d;
    font-size: 1.1em;
  }
`;

const verifyingAnim = keyframes`
  0% {
    opacity: 0.3;
  }

  50% {
    opacity: 0.8;
  }

  100% {
    opacity: 0.3;
  }
`;

const horizontalShineAnim = keyframes`
  0 {
    left: 0;
  }
  80% {
    left: 100%;
  }
`;

const verticalShineAnim = keyframes`
  0%, 75%  {
    top: 0;
    opacity: 0.5;
  }
  100% {
    opacity: 1;
    top: 100%;
  }
`;

const WaveText = styled('span')`
  i {
    font-style: normal;
    animation: ${waveTextAnimation} 1s infinite ease-in alternate;
    -webkit-animation: ${waveTextAnimation} 1s infinite ease-in alternate;
  }

  @for $i from 0 through 9 {
    i:nth-child(#{$i}) {
      animation-delay: 0.1s * $i;
      -webkit-animation-delay: 0.1s * $i;
    }
  }
`;

const FailedButton = css`
  background-color: rgba(112, 21, 30, 0.4);
`;

const ButtonGlow = styled('div')`
  position: absolute;
  right: 0;
  left: 10%;
  bottom: -60%;
  width: 80%;
  height: 60%;
  border-radius: 60%;
  box-shadow: 0 0 60px 20px rgba(184, 153, 105, 0.3);
  -webkit-animation: ${verifyingAnim} 1s ease infinite;
  animation: ${verifyingAnim} 1s ease infinite;
`;

const HorizontalBorderShine = styled('div')`
  &:before {
    content: '';
    position: absolute;
    top: -3px;
    left: -30px;
    height: 3px;
    width: 30px;
    background-color: ${utils.lightenColor('#e2cb8e', 70)};
    -webkit-animation: ${horizontalShineAnim} 1s infinite;
    animation: ${horizontalShineAnim} 1s infinite;
  }

  &:after {
    content: '';
    position: absolute;
    bottom: -3px;
    left: -30px;
    height: 3px;
    width: 30px;
    background-color: ${utils.lightenColor('#8e6d27', 50)};
    -webkit-animation: ${horizontalShineAnim} 1s infinite;
    animation: ${horizontalShineAnim} 1s infinite;
  }
`;

const VerticalBorderShine = styled('div')`
  &:before {
    content: '';
    position: absolute;
    right: -1px;
    top: 0;
    height: 15px;s
    width: 1px;
    background-color: ${utils.lightenColor('#e2cb8e', 70)};
    -webkit-animation: ${verticalShineAnim} 1s infinite;
    animation: ${verticalShineAnim} 1s infinite;
  }
`;

export interface LoginButtonProps {
  status: LoginStatus;
  onClick: () => void;
}

class LoginButton extends React.Component<LoginButtonProps> {
  public render() {
    switch (this.props.status) {
      case LoginStatus.INVALIDINPUT:
        return <GenericButton text='Login' onClick={this.props.onClick} />;
      case LoginStatus.IDLE:
        return <GenericButton text='Login' onClick={this.props.onClick} />;
      case LoginStatus.WORKING:
        return <GenericButton onClick={e => e.preventDefault()}>
          <WaveText>
            <i>V</i><i>e</i><i>r</i><i>i</i><i>f</i><i>y</i><i>i</i><i>n</i><i>g</i><i>.</i><i>.</i><i>.</i>
          </WaveText>
          <HorizontalBorderShine />
          <VerticalBorderShine />
          <ButtonGlow />
        </GenericButton>;
      case LoginStatus.SUCCESS:
        return <GenericButton text='Success' onClick={() => {}} />;
      case LoginStatus.FAILED:
        return <GenericButton text='Login Failed' className={FailedButton} onClick={() => {}} />;
      case LoginStatus.PRIVACYERROR:
        return <GenericButton text='Login Failed' className={FailedButton} onClick={() => {}} />;
    }
  }
}

export default LoginButton;
