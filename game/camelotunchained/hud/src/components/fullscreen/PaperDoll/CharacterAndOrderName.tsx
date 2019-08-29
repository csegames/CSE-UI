/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region Container constants
const CONTAINER_PADDING_LEFT = 40;
// #endregion
const Container = styled.div`
  padding-left: ${CONTAINER_PADDING_LEFT}px;
  height: 100%;
  width: 50%;
  display: flex;
  align-items: center;

  @media (max-width: 2560px) {
    padding-left: ${CONTAINER_PADDING_LEFT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding-left: ${CONTAINER_PADDING_LEFT * HD_SCALE}px;
  }
`;

// #region Text constants
const TEXT_FONT_SIZE = 48;
const TEXT_LETTER_SPACING = 4;
// #endregion
const Text = styled.div`
  margin: 0;
  padding: 0;
  font-family: Caudex;
  font-size: ${TEXT_FONT_SIZE}px;
  letter-spacing: ${TEXT_LETTER_SPACING}px;
  color: #EEEEED;

  @media (max-width: 2560px) {
    font-size: ${TEXT_FONT_SIZE * MID_SCALE}px;
    letter-spacing: ${TEXT_LETTER_SPACING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${TEXT_FONT_SIZE * HD_SCALE}px;
    letter-spacing: ${TEXT_LETTER_SPACING * HD_SCALE}px;
  }
`;

export interface CharacterNameProps {
  characterName: string;
  // orderName: string;
}

const CharacterAndOrderName = (props: CharacterNameProps) => {
  const { characterName } = props;
  return (
    <Container>
      <Text>{characterName}</Text>
    </Container>
  );
};

export default CharacterAndOrderName;
