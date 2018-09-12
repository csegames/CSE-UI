/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { css } from '@csegames/linaria';
import { Container, Overlay } from './Header';
import { MediaBreakpoints } from 'services/session/MediaBreakpoints';

const ContainerClass = css`
  color: #FFDFAF;
  background: url(../images/crafting/1080/wood-bg.png);
  height: 35px;
  padding: 0 20px;
  text-transform: uppercase;
  font-family: Caudex;
  letter-spacing: 3px;

  @media (min-width: ${MediaBreakpoints.UHD}px) {
    background: url(../images/crafting/4k/wood-bg.png);
    height: 86px;
    font-size: 28px;
    padding: 0 30px;
  }
`;

const OverlayClass = css`
  background: url(../images/crafting/1080/title-recipebar-overlay.png) no-repeat;
  background-size: cover;
  max-width: 538px;
  @media (min-width: ${MediaBreakpoints.UHD}px) {
    background: url(../images/crafting/4k/title-recipebar-overlay.png) no-repeat;
    background-size: cover;
    max-width: 1076px;
  }
`;

export interface Props {

}

class RecipeHeader extends React.PureComponent<Props> {
  public render() {
    return (
      <Container className={ContainerClass}>
        <Overlay className={OverlayClass} />
        RECIPES
      </Container>
    );
  }
}

export default RecipeHeader;
