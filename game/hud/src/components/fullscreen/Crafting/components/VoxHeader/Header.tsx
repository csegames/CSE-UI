/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';
import { MediaBreakpoints } from 'fullscreen/Crafting/lib/MediaBreakpoints';

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  padding: 0px 20px;
  height: 70px;
  background: url(../images/crafting/1080/title-texture.png) repeat;
  background-size: cover;

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    background: url(../images/crafting/4k/title-texture.png) repeat;
    background-size: cover;
    height: 130px;
  }
`;

export const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  background: url(../images/crafting/1080/title-vox-overlay.png) no-repeat;
  background-size: cover;

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    background: url(../images/crafting/4k/title-vox-overlay.png) no-repeat;
    background-size: cover;
  }
`;

export const Text = styled.div`
  font-family: Caudex;
  color: #C6ffb1;
  font-size: 20px;
  text-transform: uppercase;
  letter-spacing: 5px;

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    font-size: 40px;
    letter-spacing: 10px;
  }
`;

export interface Props {

}

class Header extends React.Component<Props> {
  public render() {
    return (
      <Container>
        <Overlay />
        <Text>Vox Magus</Text>
      </Container>
    );
  }
}

export default Header;
