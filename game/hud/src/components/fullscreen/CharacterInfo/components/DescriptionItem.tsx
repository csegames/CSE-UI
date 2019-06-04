/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { styled } from '@csegames/linaria/react';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region DescriptionItem constants
const DESCRIPTION_ITEM_PADDING_HORIZONTAL = 10;
const DESCRIPTION_ITEM_HEIGHT = 50;
const DESCRIPTION_ITEM_FONT_SIZE = 24;
const DESCRIPTION_ITEM_LETTER_SPACING = 2;
// #endregion
const DescriptionItem = styled.div`
  display: flex;
  justify-content: space-between;
  position: relative;
  cursor: default;
  padding: 0 ${DESCRIPTION_ITEM_PADDING_HORIZONTAL}px;
  height: ${DESCRIPTION_ITEM_HEIGHT}px;
  line-height: ${DESCRIPTION_ITEM_HEIGHT}px;
  font-size: ${DESCRIPTION_ITEM_FONT_SIZE}px;
  letter-spacing: ${DESCRIPTION_ITEM_LETTER_SPACING}px;
  background-color: rgba(0, 0, 0, 0.5);
  opacity: 0.8;
  border-right: 1px solid black;
  border-bottom: 1px solid black;
  color: #C3A186;
  text-transform: uppercase;

  @media (max-width: 2560px) {
    padding: 0 ${DESCRIPTION_ITEM_PADDING_HORIZONTAL * MID_SCALE}px;
    height: ${DESCRIPTION_ITEM_HEIGHT * MID_SCALE}px;
    line-height: ${DESCRIPTION_ITEM_HEIGHT * MID_SCALE}px;
    font-size: ${DESCRIPTION_ITEM_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${DESCRIPTION_ITEM_LETTER_SPACING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding: 0 ${DESCRIPTION_ITEM_PADDING_HORIZONTAL * HD_SCALE}px;
    height: ${DESCRIPTION_ITEM_HEIGHT * HD_SCALE}px;
    line-height: ${DESCRIPTION_ITEM_HEIGHT * HD_SCALE}px;
    font-size: ${DESCRIPTION_ITEM_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${DESCRIPTION_ITEM_LETTER_SPACING * HD_SCALE}px;
  }
`;

export default DescriptionItem;
