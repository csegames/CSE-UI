/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { MediaBreakpoints } from 'services/session/MediaBreakpoints';

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

  @media (min-width: ${MediaBreakpoints.UHD}px) {
    background: url(../images/crafting/4k/infusion-non.png) no-repeat;
    background-size: contain;
    background-position: center center;
    width: 145px;
    height: 145px;
  }
`;

export interface Props {
  top: number;
  left: number;
}

class Slot extends React.PureComponent<Props> {
  public render() {
    return (
      <Container top={this.props.top} left={this.props.left} />
    );
  }
}

export default Slot;
