/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import Slot from './Slot';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
`;

// #region BG constants
const BG_MAX_WIDTH = 456;
const BG_MAX_HEIGHT = 820;
// #endregion
const BG = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  position: relative;
  top: -15%;
  right: -5%;
  width: 130%;
  height: 130%;
  max-width: ${BG_MAX_WIDTH}px;
  max-height: ${BG_MAX_HEIGHT}px;
  background-image: url(../images/crafting/uhd/infusion-bg.png);
  background-repeat: no-repeat;
  background-size: cover;
  pointer-events: none;

  @media (max-width: 2560px) {
    max-width: ${BG_MAX_WIDTH * MID_SCALE}px;
    max-height: ${BG_MAX_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    background-image: url(../images/crafting/hd/infusion-bg.png);
    max-width: ${BG_MAX_WIDTH * HD_SCALE}px;
    max-height: ${BG_MAX_HEIGHT * HD_SCALE}px;
  }
`;

// #region SlotsContainer constants
const SLOTS_CONTAINER_TOP = -50;
const SLOTS_CONTAINER_RIGHT = 60;
const SLOTS_CONTAINER_WIDTH = 360;
const SLOTS_CONTAINER_HEIGHT = 578;
// #endregion
const SlotsContainer = styled.div`
  position: relative;
  top: ${SLOTS_CONTAINER_TOP}px;
  right: ${SLOTS_CONTAINER_RIGHT}px;
  width: ${SLOTS_CONTAINER_WIDTH}px;
  height: ${SLOTS_CONTAINER_HEIGHT}px;
  background-image: url(../images/crafting/uhd/infusion-slots.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: right center;
  transform: scale(0.9);

  @media (max-width: 2560px) {
    transform: scale(0.8);
    top: ${SLOTS_CONTAINER_TOP * MID_SCALE}px;
    right: ${SLOTS_CONTAINER_RIGHT * MID_SCALE}px;
    width: ${SLOTS_CONTAINER_WIDTH * MID_SCALE}px;
    height: ${SLOTS_CONTAINER_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    transform: scale(0.8);
    top: ${SLOTS_CONTAINER_TOP * HD_SCALE}px;
    right: ${SLOTS_CONTAINER_RIGHT * HD_SCALE}px;
    width: ${SLOTS_CONTAINER_WIDTH * HD_SCALE}px;
    height: ${SLOTS_CONTAINER_HEIGHT * HD_SCALE}px;
    background-image: url(../images/crafting/hd/infusion-slots.png);
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
            <Slot top={228} left={0} />
            <Slot top={124} left={124} />
            <Slot top={334} left={124} />
            <Slot top={228} left={240} />
            <Slot top={0} left={218} />
            <Slot top={458} left={218} />
          </SlotsContainer>
        </BG>
      </Container>
    );
  }
}

export default Infusions;
