/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { utils } from 'camelot-unchained';
import styled, { css, keyframes } from 'react-emotion';
import { LoginStatus } from '../index';

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

const Button = styled('div')`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 170px;
  height: 50px;
  margin: 5px;
  text-align: center;
  font-family:"caudex";
  border-image: linear-gradient(180deg,#e2cb8e,#8e6d27) stretch;
  border-style: solid;
  border-width: 3px 1px;
  transition: background-color .3s;
  background-color: rgba(17, 17, 17, 0.8);
  border-image-slice: 1;
  color: #b89969;
  cursor: pointer;
  font-size: 14px;
  letter-spacing: 2px;
  text-transform: uppercase;
  -webkit-mask-image: url(images/controller/button-mask.png);
  -webkit-mask-repeat: no-repeat;
  -webkit-mask-size: cover;
  transition: all ease .2s;
  &:hover {
    background-color: rgba(36, 28, 28, 0.8);
    border-image-slice: 1;
    color: #ffd695;
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
        return <Button onClick={this.props.onClick}>Login</Button>;
      case LoginStatus.IDLE:
        return <Button tabIndex={4} onClick={this.props.onClick}>Login</Button>;
      case LoginStatus.WORKING:
        return <Button onClick={e => e.preventDefault()}>
          <WaveText>
            <i>V</i><i>e</i><i>r</i><i>i</i><i>f</i><i>y</i><i>i</i><i>n</i><i>g</i><i>.</i><i>.</i><i>.</i>
          </WaveText>
          <HorizontalBorderShine />
          <VerticalBorderShine />
          <ButtonGlow />
        </Button>;
      case LoginStatus.SUCCESS:
        return <Button>Success!</Button>;
      case LoginStatus.FAILED:
        return <Button className={FailedButton}>Login Failed</Button>;
    }
  }
}

export default LoginButton;
