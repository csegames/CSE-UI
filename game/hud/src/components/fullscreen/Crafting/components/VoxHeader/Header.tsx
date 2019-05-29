/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region Container constants
const PADDING_HORIZONTAL = 40;
const PADDING_HEIGHT = 140;
// #endregion
export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0px ${PADDING_HORIZONTAL}px;
  height: ${PADDING_HEIGHT}px;
  background-image: url(../images/crafting/uhd/title-texture.png);
  background-repeat: repeat;
  background-size: cover;

  @media (max-width: 2560px) {
    padding: 0px ${PADDING_HORIZONTAL * MID_SCALE}px;
    height: ${PADDING_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding: 0px ${PADDING_HORIZONTAL * HD_SCALE}px;
    height: ${PADDING_HEIGHT * HD_SCALE}px;
    background-image: url(../images/crafting/hd/title-texture.png);
  }
`;

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background-image: url(../images/crafting/uhd/title-vox-overlay.png);
  background-repeat: no-repeat;
  background-size: cover;

  @media (max-width: 1920px) {
    background-image: url(../images/crafting/hd/title-vox-overlay.png) no-repeat;
  }
`;

// #region Text constants
const TEXT_FONT_SIZE = 40;
const TEXT_LETTER_SPACING = 10;
// #endregion
export const Text = styled.div`
  font-family: Caudex;
  color: #C6ffb1;
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

}

class Header extends React.Component<Props> {
  public render() {
    return (
      <Container>
        <Overlay />
        <Text>Vox Magus</Text>
      </Container>
    );
  }
}

export default Header;
