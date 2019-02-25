/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from 'linaria/react';

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
  background: radial-gradient(rgba(237,53,35,0.5) 1%, transparent 55%);;
  animation: fadeInOut 1s linear forwards;
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

const DefeatBlast = styled.div`
  position: absolute;
  width: 1142px;
  height: 651px;
  opacity: 0;
  top: -112px;
  left: -230px;
  background: url(/hud-new/images/scenario/defeat/blast-defeat.png) no-repeat center;
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
  width: 883px;
  height: 515px;
  background: url(/hud-new/images/scenario/defeat/laser-defeat.png);
  background-size: cover;
  opacity: 0;
  -webkit-animation: fadeIn 1s ease forwards, glow 2s ease infinite;
  animation: fadeIn 1s ease forwards, glow 2s ease infinite;

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
  position: absolute;
  width: 673px;
  height: 386px;
  background: url(/hud-new/images/scenario/defeat/frame-defeat.png) no-repeat;
  background-size: cover;
  z-index: 10;
`;

const Background = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  position: absolute;
  width: 525px;
  height: 225px;
  top: 105px;
  left: 90px;
  background: url(/hud-new/images/scenario/roundend/round-end-bg.png) no-repeat;
  z-index: 1;

  &:after {
    content: '';
    position: absolute;
    width: 516px;
    height: 188px;
    left: 0;
    bottom: 0;
    background: url(/hud-new/images/scenario/defeat/gradient-defeat.png);
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
  position: relative;
  font-family: Caudex;
  text-transform: uppercase;
  color: #ffd3d3;
  font-size: 45px;
  letter-spacing: 25px;
  opacity: 0;
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
  width: 450px;
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
  background: url(/hud-new/images/scenario/roundend/gradient-bg.png) no-repeat;
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

export interface DefeatProps {
  scenarioResultMessage: string;
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
          <Title>Defeat</Title>
          <ResultMessage>{this.props.scenarioResultMessage}</ResultMessage>
        </Background>
        <BackgroundShadow />
      </Container>
    );
  }
}

export default Defeat;
