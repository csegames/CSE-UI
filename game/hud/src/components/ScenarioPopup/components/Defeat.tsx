/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled, { css } from 'react-emotion';
import { slideDownBounceUp, blast, slideUp, glow, fadeIn, fadeOut, fadeInOut } from '../animations';

const slideBounceTime = 0.4;

const WaitTillBounce = css`
  -webkit-animation-delay: ${slideBounceTime - 0.08}s;
  animation-delay: ${slideBounceTime - 0.08}s;
`;

const Container = styled('div')`
  pointer-events: none;
  position: relative;
  width: 700px;
  height: 370px;
  -webkit-animation: ${slideDownBounceUp} ${slideBounceTime}s ease-out forwards,
    shake-hard 0.15s ease 0.3s, ${fadeOut} 0.5s ease 4s forwards;
  animation: ${slideDownBounceUp} ${slideBounceTime}s ease-out forwards,
    shake-hard 0.15s ease 0.3s, ${fadeOut} 0.5s ease 4s forwards;
`;

const RadialGradient = styled('div')`
  position: absolute;
  width: 1000px;
  height: 600px;
  top: -100px;
  left: -150px;
  opacity: 0;
  background: radial-gradient(rgba(237,53,35,0.5) 1%, transparent 55%);;
  -webkit-animation: ${fadeInOut} 1s linear forwards;
  animation: ${fadeInOut} 1s linear forwards;
  ${WaitTillBounce};
`;

const DefeatBlast = styled('div')`
  position: absolute;
  width: 1142px;
  height: 651px;
  opacity: 0;
  top: -112px;
  left: -230px;
  background: url(images/scenario/defeat/blast-defeat.png) no-repeat center;
  background-size: cover;
  -webkit-animation: ${blast} 1s ease forwards;
  animation: ${blast} 1s ease forwards;
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;
`;

const FrameLasers = styled('div')`
  position: absolute;
  top: -72px;
  left: -96px;
  width: 883px;
  height: 515px;
  background: url(images/scenario/defeat/laser-defeat.png);
  background-size: cover;
  opacity: 0;
  -webkit-animation: ${fadeIn} 1s ease forwards, ${glow} 2s ease infinite;
  animation: ${fadeIn} 1s ease forwards, ${glow} 2s ease infinite;
`;

const Frame = styled('div')`
  position: absolute;
  width: 673px;
  height: 386px;
  background: url(images/scenario/defeat/frame-defeat.png) no-repeat;
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

  &:after {
    content: '';
    position: absolute;
    width: 516px;
    height: 188px;
    left: 0;
    bottom: 0;
    background: url(images/scenario/defeat/gradient-defeat.png);
    -webkit-animation: ${glow} 2s ease infinite;
    animation: ${glow} 2s ease infinite;
    ${WaitTillBounce};
  }
`;

const Text = styled('div')`
  z-index: 10;
  position: relative;
  font-family: Caudex;
  text-transform: uppercase;
  color: #ffd3d3;
  font-size: 45px;
  letter-spacing: 25px;
  opacity: 0;
  -webkit-animation: ${slideUp} 0.2s linear forwards;
  animation: ${slideUp} 0.2s linear forwards;
  ${WaitTillBounce};
`;

const BackgroundShadow = styled('div')`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  width: 100%;
  height: 110%;
  background: url(images/scenario/roundend/gradient-bg.png) no-repeat;
  background-size: cover;
  z-index: 0;
  -webkit-animation: ${fadeIn} 0.5s ease-in forwards;
  animation: ${fadeIn} 0.5s ease-in forwards;
`;

export interface DefeatProps {

}

class Defeat extends React.Component<DefeatProps> {
  public render() {
    return (
      <Container>
        <RadialGradient />
        <DefeatBlast />
        <FrameLasers />
        <Frame />
        <Background>
          <Text>Defeat</Text>
        </Background>
        <BackgroundShadow />
      </Container>
    );
  }
}

export default Defeat;
