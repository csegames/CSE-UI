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
const CONTAINER_DIMENSIONS = 122;
// #endregion
const Container = styled.div`
  position: absolute;
  width: ${CONTAINER_DIMENSIONS}px;
  height: ${CONTAINER_DIMENSIONS}px;
  border-radius: 50%;
  top: ${(props: { top: number, left: number }) => props.top}px;
  left: ${(props: { top: number, left: number }) => props.left}px;
  background-image: url(../images/crafting/1080/infusion-non.png);
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center center;
  opacity: 0.4;

  @media (max-width: 2560px) {
    width: ${CONTAINER_DIMENSIONS * MID_SCALE}px;
    height: ${CONTAINER_DIMENSIONS * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    background-image: url(../images/crafting/hd/infusion-non.png);
    width: ${CONTAINER_DIMENSIONS * HD_SCALE}px;
    height: ${CONTAINER_DIMENSIONS * HD_SCALE}px;
  }
`;

export interface Props {
  top: number;
  left: number;
}

class Slot extends React.PureComponent<Props> {
  public render() {
    const { top, left } = this.props;
    return (
      <UIContext.Consumer>
        {({ resolution }) => {
          const topVal = resolution.width > 2560 ? top : resolution.width > 1920 ? top * MID_SCALE : top * HD_SCALE;
          const leftVal = resolution.width > 2560 ? left : resolution.width > 1920 ? left * MID_SCALE : left * HD_SCALE;
          return (
            <Container top={topVal} left={leftVal} />
          );
        }}
      </UIContext.Consumer>
    );
  }
}

export default Slot;
