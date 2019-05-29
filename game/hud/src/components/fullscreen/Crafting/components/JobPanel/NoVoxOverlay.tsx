/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region Container constants
const CONTAINER_TOP = -50;
const CONTAINER_FONT_SIZE = 48;
// #endregion
const Container = styled.div`
  position: absolute;
  top: ${CONTAINER_TOP}px;
  font-size: ${CONTAINER_FONT_SIZE}px;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(to top, rgba(8, 26, 27, 0.2), rgba(8, 26, 27, 0.8));
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  z-index: 99;

  @media (max-width: 2560px) {
    top: ${CONTAINER_TOP * MID_SCALE}px;
    font-size: ${CONTAINER_FONT_SIZE * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    top: ${CONTAINER_TOP * HD_SCALE}px;
    font-size: ${CONTAINER_FONT_SIZE * HD_SCALE}px;
  }
`;

export interface Props {

}

class NoVoxOverlay extends React.Component<Props> {
  public render() {
    return (
      <Container>
        No Vox Found
      </Container>
    );
  }
}

export default NoVoxOverlay;
