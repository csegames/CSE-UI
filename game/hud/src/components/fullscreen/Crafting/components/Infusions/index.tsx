/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import Slot from './Slot';
import { MediaBreakpoints } from 'fullscreen/Crafting/lib/MediaBreakpoints';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
`;

const BG = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  top: -15%;
  right: -5%;
  width: 130%;
  height: 130%;
  max-width: 228px;
  max-height: 410px;
  background: url(../images/crafting/1080/infusion-bg.png) no-repeat;
  background-size: cover;
  pointer-events: none;

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    background: url(../images/crafting/4k/infusion-bg.png) no-repeat;
    background-size: cover;
    max-width: 296px;
    max-height: 533px;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    background: url(../images/crafting/4k/infusion-bg.png) no-repeat;
    background-size: cover;
    max-width: 555px;
    max-height: 1000px;
  }

  @media (max-width: ${MediaBreakpoints.SmallScreen}px) {
    transform: scale(0.9);
    top: -15%;
  }
`;

const SlotsContainer = styled.div`
  position: relative;
  top: -25px;
  right: 30px;
  width: 180px;
  height: 289px;
  background: url(../images/crafting/1080/infusion-slots.png) no-repeat;
  background-size: contain;
  background-position: right center;
  transform: scale(0.9);

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    transform: scale(0.8);
    top: -32.5px;
    right: 15px;
    width: 234px;
    height: 378px;
    background: url(../images/crafting/4k/infusion-slots.png) no-repeat;
    background-size: contain;
    background-position: right center;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    transform: scale(0.8);
    top: -50px;
    right: 15px;
    width: 360px;
    height: 578px;
    background: url(../images/crafting/4k/infusion-slots.png) no-repeat;
    background-size: contain;
    background-position: right center;
  }

  @media (max-width: ${MediaBreakpoints.SmallScreen}px) {
    right: 0px;
    transform: scale(0.7);
    background-position: right top;
  }
`;

export interface Props {

}

class Infusions extends React.PureComponent<Props> {
  public render() {
    return (
      <Container>
        <BG>
          <SlotsContainer>
            <Slot top={114} left={0} />
            <Slot top={62} left={62} />
            <Slot top={167} left={62} />
            <Slot top={114} left={120} />
            <Slot top={0} left={109} />
            <Slot top={229} left={109} />
          </SlotsContainer>
        </BG>
      </Container>
    );
  }
}

export default Infusions;
