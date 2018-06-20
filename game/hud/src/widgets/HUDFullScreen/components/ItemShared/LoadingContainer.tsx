/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
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
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 100%;
  z-index: 10;
`;

export interface LoadingContainerProps {
}

const LoadingContainer = (props: LoadingContainerProps) => {
  return (
    <Container>
      <Spinner />
    </Container>
  );
};

export default LoadingContainer;
