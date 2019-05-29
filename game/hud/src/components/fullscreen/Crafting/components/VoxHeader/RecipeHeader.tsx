/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { css } from '@csegames/linaria';
import { Container, Overlay } from './Header';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region ContainerClass constants
const CONTAINER_CLASS_HEIGHT = 70;
const CONTAINER_CLASS_PADDING_HORIZONTAL = 40;
const CONTAINER_CLASS_FONT_SIZE = 32;
const CONTAINER_CLASS_LETTER_SPACING = 6;
// #endregion
const ContainerClass = css`
  color: #FFDFAF;
  background-image: url(../images/crafting/uhd/wood-bg.png);
  height: ${CONTAINER_CLASS_HEIGHT}px;
  padding: 0 ${CONTAINER_CLASS_PADDING_HORIZONTAL}px;
  font-size: ${CONTAINER_CLASS_FONT_SIZE}px;
  letter-spacing: ${CONTAINER_CLASS_LETTER_SPACING}px;
  text-transform: uppercase;
  font-family: Caudex;

  @media (max-width: 2560px) {
    height: ${CONTAINER_CLASS_HEIGHT * MID_SCALE}px;
    padding: 0 ${CONTAINER_CLASS_PADDING_HORIZONTAL * MID_SCALE}px;
    font-size: ${CONTAINER_CLASS_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${CONTAINER_CLASS_LETTER_SPACING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    background-image: url(../images/crafting/hd/wood-bg.png);
    height: ${CONTAINER_CLASS_HEIGHT * HD_SCALE}px;
    padding: 0 ${CONTAINER_CLASS_PADDING_HORIZONTAL * HD_SCALE}px;
    font-size: ${CONTAINER_CLASS_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${CONTAINER_CLASS_LETTER_SPACING * HD_SCALE}px;
  }
`;

// #region OverlayClass constants
const OVERLAY_CLASS_MAX_WIDTH = 1076;
// #endregion
const OverlayClass = css`
  background: url(../images/crafting/uhd/title-recipebar-overlay.png) no-repeat;
  background-size: cover;
  max-width: ${OVERLAY_CLASS_MAX_WIDTH}px;

  @media (max-width: 2560px) {
    max-width: ${OVERLAY_CLASS_MAX_WIDTH * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    background: url(../images/crafting/hd/title-recipebar-overlay.png) no-repeat;
    max-width: ${OVERLAY_CLASS_MAX_WIDTH * HD_SCALE}px;
  }
`;

export interface Props {

}

class RecipeHeader extends React.PureComponent<Props> {
  public render() {
    return (
      <Container className={ContainerClass}>
        <Overlay className={OverlayClass} />
        RECIPES
      </Container>
    );
  }
}

export default RecipeHeader;
