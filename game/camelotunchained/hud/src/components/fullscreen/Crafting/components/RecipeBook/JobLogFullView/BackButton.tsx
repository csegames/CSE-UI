/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region Back constants
const BACK_TOP = 2;
const BACK_RIGHT = 20;
const BACK_FONT_SIZE = 24;
const BACK_PADDING = 10;
// #endregion
const Back = styled.div`
  position: absolute;
  top: ${BACK_TOP}px;
  right: ${BACK_RIGHT}px;
  font-size: ${BACK_FONT_SIZE}px;
  padding: ${BACK_PADDING}px;
  width: fit-content;
  color: black;
  cursor: pointer;
  text-transform: uppercase;
  font-family: TradeWinds;
  pointer-events: all;
  cursor: pointer;
  z-index: 10;
  &:hover {
    opacity: 0.8;
  }

  @media (max-width: 2560px) {
    top: ${BACK_TOP * MID_SCALE}px;
    right: ${BACK_RIGHT * MID_SCALE}px;
    font-size: ${BACK_FONT_SIZE * MID_SCALE}px;
    padding: ${BACK_PADDING * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    top: ${BACK_TOP * HD_SCALE}px;
    right: ${BACK_RIGHT * HD_SCALE}px;
    font-size: ${BACK_FONT_SIZE * HD_SCALE}px;
    padding: ${BACK_PADDING * HD_SCALE}px;
  }
`;

// #region Arrow constants
const ARROW_WIDTH = 32;
const ARROW_HEIGHT = 20;
// #endregion
const Arrow = styled.div`
  display: inline-block;
  width: ${ARROW_WIDTH}px;
  height: ${ARROW_HEIGHT}px;
  background-image: url(../images/crafting/uhd/paper-history-left-arrow.png);
  background-size: contain;
  background-repeat: no-repeat;

  @media (max-width: 2560px) {
    width: ${ARROW_WIDTH * MID_SCALE}px;
    height: ${ARROW_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    width: ${ARROW_WIDTH * HD_SCALE}px;
    height: ${ARROW_HEIGHT * HD_SCALE}px;
    background-image: url(../images/crafting/hd/paper-history-left-arrow.png);
  }
`;

export interface Props {
  className?: string;
  onClick: () => void;
}

class BackButton extends React.PureComponent<Props> {
  public render() {
    return (
      <Back className={this.props.className} onClick={this.props.onClick}>
        <Arrow />
        Back
      </Back>
    );
  }
}

export default BackButton;
