/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { MediaBreakpoints } from 'fullscreen/Crafting/lib/MediaBreakpoints';
import { CraftingResolutionContext } from '../../CraftingResolutionContext';

const Container = styled.div`
  position: absolute;
  width: 61px;
  height: 61px;
  border-radius: 50%;
  top: ${(props: { top: number, left: number }) => props.top}px;
  left: ${(props: { top: number, left: number }) => props.left}px;
  background: url(../images/crafting/1080/infusion-non.png) no-repeat;
  background-size: contain;
  background-position: center center;
  opacity: 0.4;

  @media (min-width: ${MediaBreakpoints.MidWidth}px) and (min-height: ${MediaBreakpoints.MidHeight}px) {
    background: url(../images/crafting/4k/infusion-non.png) no-repeat;
    background-size: contain;
    background-position: center center;
    width: 79px;
    height: 79px;
  }

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    background: url(../images/crafting/4k/infusion-non.png) no-repeat;
    background-size: contain;
    background-position: center center;
    width: 122px;
    height: 122px;
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
      <CraftingResolutionContext.Consumer>
        {({ isUHD, isMidScreen }) => {
          const topVal = isUHD() ? top * 2 : isMidScreen() ? top * 1.3 : top;
          const leftVal = isUHD() ? left * 2 : isMidScreen() ? left * 1.3 : left;
          return (
            <Container top={topVal} left={leftVal} />
          );
        }}
      </CraftingResolutionContext.Consumer>
    );
  }
}

export default Slot;
