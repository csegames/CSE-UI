/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region Container constants
const CONTAINER_DIMENSIONS = 28;
const CONTAINER_BORDER_RADIUS = 2;
// #endregion
const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${CONTAINER_DIMENSIONS}px;
  height: ${CONTAINER_DIMENSIONS}px;
  border-radius: ${CONTAINER_BORDER_RADIUS}px;
  background-color: #f2ddcb;

  @media (max-width: 2560px) {
    width: ${CONTAINER_DIMENSIONS * MID_SCALE}px;
    height: ${CONTAINER_DIMENSIONS * MID_SCALE}px;
    border-radius: ${CONTAINER_BORDER_RADIUS * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${CONTAINER_DIMENSIONS * HD_SCALE}px;
    height: ${CONTAINER_DIMENSIONS * HD_SCALE}px;
    border-radius: ${CONTAINER_BORDER_RADIUS * HD_SCALE}px;
  }
`;

const Check = styled.span`
  color: #5b3329;
`;

export interface Props {
  checked: boolean;
}

// tslint:disable-next-line:function-name
export function Checkbox(props: Props) {
  return (
    <Container>
      {props.checked && <Check className='fa fa-check'></Check>}
    </Container>
  );
}
