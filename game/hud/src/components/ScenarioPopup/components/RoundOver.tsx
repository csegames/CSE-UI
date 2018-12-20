/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';
import { slideDownBounceUp, fadeIn, fadeOut, slideUpTitle, slideUpMsg } from '../animations';

const slideBounceTime = 0.4;

const WaitTillBounce = css`
  -webkit-animation-delay: ${slideBounceTime - 0.08}s;
  animation-delay: ${slideBounceTime - 0.08}s;
`;

const Container = styled('div')`
  position: relative;
  width: 700px;
  height: 370px;
  -webkit-animation: ${slideDownBounceUp} ${slideBounceTime}s ease-out forwards,
    shake-hard 0.15s ease 0.3s, ${fadeOut} 0.5s ease 4s forwards;
  animation: ${slideDownBounceUp} ${slideBounceTime}s ease-out forwards,
    shake-hard 0.15s ease 0.3s, ${fadeOut} 0.5s ease 4s forwards;
`;

const Frame = styled('div')`
  position: absolute;
  width: 700px;
  height: 370px;
  background: url(images/scenario/roundend/round-endframe.png) no-repeat;
  background-size: cover;
  z-index: 10;
`;

const Background = styled('div')`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  width: 525px;
  height: 225px;
  top: 105px;
  left: 90px;
  background: url(images/scenario/roundend/round-end-bg.png) no-repeat;
  z-index: 1;
`;

const Title = styled('div')`
  z-index: 10;
  position: relative;
  font-family: Caudex;
  text-transform: uppercase;
  color: white;
  font-size: 35px;
  letter-spacing: 15px;
  opacity: 0;
  -webkit-animation: ${slideUpTitle} 0.2s linear forwards;
  animation: ${slideUpTitle} 0.2s linear forwards;
  ${WaitTillBounce};
`;

const ResultMessage = styled('div')`
  z-index: 11;
  position: relative;
  opacity: 0;
  text-align: center;
  font-size: 24px;
  width: 450px;
  font-family: Caudex;
  color: white;
  -webkit-animation: ${slideUpMsg} 0.2s linear forwards;
  animation: ${slideUpMsg} 0.2s linear forwards;
  ${WaitTillBounce};
`;

const BackgroundShadow = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 110%;
  background: url(images/scenario/roundend/gradient-bg.png) no-repeat;
  background-size: cover;
  z-index: 0;
  -webkit-animation: ${fadeIn} 1s ease-in forwards;
  animation: ${fadeIn} 1s ease-in forwards;
`;

export interface RoundOverProps {
  roundResultMessage: string;
}

class RoundOver extends React.Component<RoundOverProps> {
  public render() {
    return (
      <Container>
        <Frame />
        <Background>
          <Title>Round Over</Title>
          <ResultMessage>{this.props.roundResultMessage}</ResultMessage>
        </Background>
        <BackgroundShadow />
      </Container>
    );
  }
}

export default RoundOver;
