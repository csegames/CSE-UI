/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region Container constants
const CONTAINER_HEIGHT = 130;
// #endregion
const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0px 20px;
  height: ${CONTAINER_HEIGHT}px;
  background-image: url(../images/abilitybook/uhd/nav-grey-bg.jpg);
  background-repeat: repeat;
  background-size: 100% 100%;
  z-index: 2;

  @media (max-width: 2560px) {
    height: ${CONTAINER_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    background-image: url(../images/abilitybook/hd/nav-grey-bg.jpg);
    height: ${CONTAINER_HEIGHT * HD_SCALE}px;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-image: url(../images/abilitybook/uhd/title-overlay.jpg);
  background-repeat: no-repeat;
  background-size: cover;
  z-index: -1;

  @media (max-width: 1920px) {
    background-image: url(../images/abilitybook/hd/title-overlay.jpg);
  }
`;

// #region Text constants
const TEXT_FONT_SIZE = 40;
const TEXT_LETTER_SPACING = 6;
// #endregion
const Text = styled.div`
  font-family: Caudex;
  color: #FFF6DA;
  font-size: ${TEXT_FONT_SIZE}px;
  letter-spacing: ${TEXT_LETTER_SPACING}px;
  text-transform: uppercase;

  @media (max-width: 2560px) {
    font-size: ${TEXT_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${TEXT_LETTER_SPACING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${TEXT_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${TEXT_LETTER_SPACING * HD_SCALE}px;
  }
`;

export interface Props {
  title: string;
}

// tslint:disable-next-line:function-name
export function Header(props: Props) {
  return (
    <Container>
      <Overlay />
      <Text>{props.title}</Text>
    </Container>
  );
}
