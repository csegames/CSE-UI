/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';
import { slideDownBounceUp, fadeIn, slideUp } from '../animations';

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
    shake-hard 0.15s ease 0.3s;
  animation: ${slideDownBounceUp} ${slideBounceTime}s ease-out forwards,
    shake-hard 0.15s ease 0.3s;
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
  position: absolute;
  width: 525px;
  height: 225px;
  top: 105px;
  left: 90px;
  background: url(images/scenario/roundend/round-end-bg.png) no-repeat;
  z-index: 1;
`;

const Text = styled('div')`
  z-index: 10;
  position: relative;
  font-family: Caudex;
  text-transform: uppercase;
  color: white;
  font-size: 35px;
  letter-spacing: 15px;
  opacity: 0;
  -webkit-animation: ${slideUp} 0.2s linear forwards;
  animation: ${slideUp} 0.2s linear forwards;
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

}

class RoundOver extends React.Component<RoundOverProps> {
  public render() {
    return (
      <Container>
        <Frame />
        <Background>
          <Text>Round Over</Text>
        </Background>
        <BackgroundShadow />
      </Container>
    );
  }

  public componentDidMount() {

  }
}

export default RoundOver;
