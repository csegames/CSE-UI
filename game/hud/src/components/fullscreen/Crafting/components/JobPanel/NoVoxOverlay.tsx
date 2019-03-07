/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  position: absolute;
  top: -25px;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(to top, rgba(8, 26, 27, 0.2), rgba(8, 26, 27, 0.8));
  color: white;
  font-size: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  z-index: 99;
`;

export interface Props {

}

class NoVoxOverlay extends React.Component<Props> {
  public render() {
    return (
      <Container>
        No Vox Found
      </Container>
    );
  }
}

export default NoVoxOverlay;
