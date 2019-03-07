/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import Slot from './Slot';
import { MediaBreakpoints } from 'services/session/MediaBreakpoints';

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

  @media (min-width: ${MediaBreakpoints.UHD}px) {
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

  @media (min-width: ${MediaBreakpoints.UHD}px) {
    transform: scale(0.8);
    top: -50px;
    right: 15px;
    width: 437px;
    height: 698px;
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
      <UIContext.Consumer>
        {(uiContext: UIContext) => {
          const isFourK = uiContext.isUHD();
          return (
            <Container>
              <BG>
                <SlotsContainer>
                  <Slot top={isFourK ? 277 : 114} left={isFourK ? 0 : -1} />
                  <Slot top={isFourK ? 152 : 62} left={isFourK ? 150 : 62} />
                  <Slot top={isFourK ? 400 : 167} left={isFourK ? 150 : 62} />
                  <Slot top={isFourK ? 277 : 114} left={isFourK ? 292 : 120} />
                  <Slot top={0} left={isFourK ? 263 : 109} />
                  <Slot top={isFourK ? 553 : 229} left={isFourK ? 263 : 109} />
                </SlotsContainer>
              </BG>
            </Container>
          );
        }}
      </UIContext.Consumer>
    );
  }
}

export default Infusions;
