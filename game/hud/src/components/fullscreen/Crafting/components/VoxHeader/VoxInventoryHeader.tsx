/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import { css } from '@csegames/linaria';
import { Container, Overlay, Text } from './Header';
import { MID_SCALE, HD_SCALE } from 'fullscreen/lib/constants';

// #region ContainerClass constants
const CONTAINER_CLASS_PADDING_HORIZONTAL = 40;
const CONTAINER_CLASS_HEIGHT = 100;
// #endregion
const ContainerClass = css`
  padding: 0px ${CONTAINER_CLASS_PADDING_HORIZONTAL}px;
  height: ${CONTAINER_CLASS_HEIGHT}px;

  @media (max-width: 2560px) {
    padding: 0px ${CONTAINER_CLASS_PADDING_HORIZONTAL * MID_SCALE}px;
    height: ${CONTAINER_CLASS_HEIGHT * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    padding: 0px ${CONTAINER_CLASS_PADDING_HORIZONTAL * HD_SCALE}px;
    height: ${CONTAINER_CLASS_HEIGHT * HD_SCALE}px;
  }
`;

// #region OverlayClass constants
const OVERLAY_CLASS_MAX_WIDTH = 1764;
// #endregion
const OverlayClass = css`
  background: url(../images/crafting/uhd/title-vox-inventory-overlay.png) no-repeat;
  background-size: cover;
  max-width: ${OVERLAY_CLASS_MAX_WIDTH}px;

  @media (max-width: 2560px) {
    max-width: ${OVERLAY_CLASS_MAX_WIDTH * MID_SCALE}px;
  }

  @media (max-width: 1920px) {
    max-width: ${OVERLAY_CLASS_MAX_WIDTH * HD_SCALE}px;
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
