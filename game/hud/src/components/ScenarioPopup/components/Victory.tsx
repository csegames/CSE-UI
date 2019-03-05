/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

const slideBounceTime = 0.4;

const WaitTillBounce = `
  -webkit-animation-delay: ${slideBounceTime - 0.08}s;
  animation-delay: ${slideBounceTime - 0.08}s;
`;

const Container = styled.div`
  pointer-events: none;
  position: relative;
  width: 700px;
  height: 370px;
  -webkit-animation: slideDownBounceUp ${slideBounceTime}s ease-out forwards,
    shake-hard 0.15s ease 0.3s, fadeOut 0.5s ease 4s forwards;
  animation: slideDownBounceUp ${slideBounceTime}s ease-out forwards,
    shake-hard 0.15s ease 0.3s, fadeOut 0.5s ease 4s forwards;

  @keyframes slideDownBounceUp {
    0%, 10% {
      top: -300px;
      opacity: 0;
    }
    80% {
      top: 0px;
    }
    100% {
      top: -20px;
      opacity: 1;
    }
  }

  @keyframes fadeOut {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }
`;

const RadialGradient = styled.div`
  position: absolute;
  width: 1000px;
  height: 600px;
  top: -100px;
  left: -150px;
  opacity: 0;
  background: radial-gradient(rgba(67, 225, 147, 0.5) 1%, transparent 55%);
  -webkit-animation: fadeInOut 1s ease forwards;
  animation: fadeInOut 1s ease forwards;
  ${WaitTillBounce}

  @keyframes fadeInOut {
    0% {
      opacity: 0;
    }
    50% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  }
`;

const VictoryBlast = styled.div`
  position: absolute;
  width: 1142px;
  height: 651px;
  opacity: 0;
  top: -112px;
  left: -230px;
  background: url(../images/scenario/victory/blast.png) no-repeat center;
  background-size: cover;
  -webkit-animation: blast 1s ease forwards;
  animation: blast 1s ease forwards;
  -webkit-animation-delay: 0.2s;
  animation-delay: 0.2s;

  @keyframes blast {
    from {
      opacity: 1;
      background-size: 10% 10%;
    }
    to {
      opacity: 0;
      background-size: 120% 120%;
    }
  }
`;

const FrameLasers = styled.div`
  position: absolute;
  top: -72px;
  left: -96px;
  width: 892px;
  height: 554px;
  background: url(../images/scenario/victory/laser-victory.png);
  background-size: cover;
  opacity: 0;
  -webkit-animation: fadeIn 1s ease forwards, glow 2s ease infinite;
  animation: fadeIn 1s ease forwards, glow 2s ease infinite;
  -webkit-animation-delay: ${slideBounceTime - 0.15}s;
  animation-delay: ${slideBounceTime - 0.15}s;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  @keyframes glow {
    0% {
      -webkit-filter: brightness(100%);
    }
    50% {
      -webkit-filter: brightness(150%);
    }
    100% {
      -webkit-filter: brightness(100%);
    }
  }
`;

const Frame = styled.div`
  position: relative;
  width: 700px;
  height: 370px;
  background: url(../images/scenario/roundend/round-endframe.png) no-repeat;
  background-size: cover;
  z-index: 10;

  &:after {
    content: '';
    position: absolute;
    width: 0%;
    height: 100%;
    background: linear-gradient(to right, transparent 80%, rgba(255,255,255,0.5));
    -webkit-mask-image: url(../images/scenario/roundend/round-endframe.png);
    -webkit-mask-repeat: no-repeat;
    -webkit-mask-size: cover;
    -webkit-animation: shine 0.7ss ease-in forwards;
    animation: shine 0.7s ease-in forwards;
    -webkit-animation-delay: ${slideBounceTime - 0.15}s;
    animation-delay: ${slideBounceTime - 0.15}s;
  }

  @keyframes shine {
    0% {
      width: 0%;
    }
    99.9% {
      width: 100%;
    }
    100% {
      width: 0%;
    }
  }
`;

const Background = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
  width: 525px;
  height: 225px;
  top: 105px;
  left: 90px;
  background: url(../images/scenario/roundend/round-end-bg.png) no-repeat;
  z-index: 1;

  &:before {
    content: '';
    position: absolute;
    width: 356px;
    height: 223px;
    left: 0;
    bottom: 0;
    background: url(../images/scenario/victory/flame-victory.png);
    -webkit-animation: glow 2s ease infinite;
    animation: glow 2s ease infinite;
    ${WaitTillBounce}
  }

  &:after {
    content: '';
    position: absolute;
    width: 516px;
    height: 188px;
    left: 0;
    bottom: 0;
    background: url(../images/scenario/victory/gradient-victory.png);
    -webkit-animation: glow 2s ease infinite;
    animation: glow 2s ease infinite;
    ${WaitTillBounce}
  }

  @keyframes glow {
    0% {
      -webkit-filter: brightness(100%);
    }
    50% {
      -webkit-filter: brightness(150%);
    }
    100% {
      -webkit-filter: brightness(100%);
    }
  }
`;

const Title = styled.div`
  z-index: 10;
  opacity: 0;
  position: relative;
  font-family: Caudex;
  text-transform: uppercase;
  color: #d3fffd;
  font-size: 45px;
  letter-spacing: 20px;
  -webkit-animation: slideUpTitle 0.2s linear forwards;
  animation: slideUpTitle 0.2s linear forwards;
  ${WaitTillBounce}

  @keyframes slideUpTitle {
    0%, 10% {
      bottom: 0px;
      opacity: 0;
    }
    100% {
      bottom: 35px;
      opacity: 1;
    }
  }
`;

const ResultMessage = styled.div`
  z-index: 11;
  position: relative;
  opacity: 0;
  text-align: center;
  font-size: 24px;
  width: 400px;
  font-family: Caudex;
  color: white;
  -webkit-animation: slideUpMsg 0.2s linear forwards;
  animation: slideUpMsg 0.2s linear forwards;
  ${WaitTillBounce}

  @keyframes slideUpMsg {
    0%, 10% {
      bottom: 0px;
      opacity: 0;
    }

    100% {
      bottom: 30px;
      opacity: 1;
    }
  }
`;

const BackgroundShadow = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  opacity: 0;
  width: 100%;
  height: 110%;
  background: url(../images/scenario/roundend/gradient-bg.png) no-repeat;
  background-size: cover;
  z-index: 0;
  -webkit-animation: fadeIn 0.5s ease-in forwards;
  animation: fadeIn 0.5s ease-in forwards;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

export interface VictoryProps {
  scenarioResultMessage: string;
}

class Victory extends React.Component<VictoryProps> {
  public render() {
    return (
      <Container>
        <RadialGradient />
        <VictoryBlast />
        <FrameLasers />
        <Frame />
        <Background>
          <Title>Victory</Title>
          <ResultMessage>{this.props.scenarioResultMessage}</ResultMessage>
        </Background>
        <BackgroundShadow />
      </Container>
    );
  }
}

export default Victory;
