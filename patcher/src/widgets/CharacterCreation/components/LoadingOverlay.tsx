/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as React from 'react';
import styled from 'react-emotion';
import { Spinner } from '@csegames/camelot-unchained';

const Container = styled('div')`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.25);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;
`;

export interface LoadingOverlayProps {

}

class LoadingOverlay extends React.Component<LoadingOverlayProps> {
  public render() {
    return (
      <Container>
        <Spinner />
      </Container>
    );
  }
}

export default LoadingOverlay;
