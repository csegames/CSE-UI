/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { MediaBreakpoints } from 'fullscreen/Crafting/lib/MediaBreakpoints';

const Back = styled.div`
  position: absolute;
  top: 1px;
  right: 10px;
  width: fit-content;
  color: black;
  font-size: 12px;
  cursor: pointer;
  text-transform: uppercase;
  font-family: TradeWinds;
  pointer-events: all;
  cursor: pointer;
  padding: 5px;
  z-index: 10;
  &:hover {
    opacity: 0.8;
  }

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    font-size: 16px;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    top: 5px;
    font-size: 24px;
  }
`;

const Arrow = styled.div`
  display: inline-block;
  width: 16px;
  height: 10px;
  background: url(../images/crafting/1080/paper-history-left-arrow.png) no-repeat;

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    width: 21px;
    height: 13px;
    background: url(../images/crafting/4k/paper-history-left-arrow.png) no-repeat;
    background-size: contain;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    width: 31px;
    height: 19px;
    background: url(../images/crafting/4k/paper-history-left-arrow.png) no-repeat;
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
