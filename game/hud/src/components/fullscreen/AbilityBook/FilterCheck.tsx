/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { Checkbox } from 'shared/Checkbox';
import { Tooltip } from 'shared/Tooltip';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

const Container = styled.div`
  display: flex;
  cursor: pointer;
  opacity: 0.5;
`;

// #region Container constants
const TEXT_CONTAINER_FONT_SIZE = 28;
const TEXT_CONTAINER_MARGIN_LEFT = 10;
// #endregion
const TextContainer = styled.div`
  font-family: CaudexBold;
  font-size: ${TEXT_CONTAINER_FONT_SIZE}px;
  margin-left: ${TEXT_CONTAINER_MARGIN_LEFT}px;
  text-transform: uppercase;
  color: #1F1E1B;

  @media (max-width: 2560px) {
    font-size: ${TEXT_CONTAINER_FONT_SIZE * MID_SCALE}px;
    margin-left: ${TEXT_CONTAINER_MARGIN_LEFT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    font-size: ${TEXT_CONTAINER_FONT_SIZE * HD_SCALE}px;
    margin-left: ${TEXT_CONTAINER_MARGIN_LEFT * HD_SCALE}px;
  }
`;

export interface Props {
  text: string;
}

// tslint:disable-next-line:function-name
export function FilterCheck(props: Props) {
  return (
    <Tooltip content='Not yet implemented'>
      <Container>
        <Checkbox checked={true} />
        <TextContainer>{props.text}</TextContainer>
      </Container>
    </Tooltip>
  );
}
