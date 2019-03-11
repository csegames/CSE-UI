/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { css } from '@csegames/linaria';
import { Container, Overlay, Text } from './Header';
import { MediaBreakpoints } from 'fullscreen/Crafting/lib/MediaBreakpoints';

const ContainerClass = css`
  padding: 0px 20px;
  height: 50px;

  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    padding: 0px 30px;
    height: 90px;
  }
`;

const OverlayClass = css`
  background: url(../images/crafting/1080/title-vox-inventory-overlay.png) no-repeat;
  background-size: cover;
  max-width: 882px;
  @media (min-width: ${MediaBreakpoints.UHDWidth}px) and (min-height: ${MediaBreakpoints.UHDHeight}px) {
    background: url(../images/crafting/4k/title-vox-inventory-overlay.png) no-repeat;
    background-size: cover;
    max-width: 1763px;
  }
`;

export interface Props {

}

class SubHeader extends React.Component<Props> {
  public render() {
    return (
      <Container className={ContainerClass}>
        <Overlay className={OverlayClass} />
        <Text>Vox Inventory</Text>
      </Container>
    );
  }
}

export default SubHeader;
