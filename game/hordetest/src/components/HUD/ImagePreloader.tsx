/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const Container = styled.div`
  position: fixed;
  top: -9999px;
  left: -9999px;
`;

const imagesToPreload = [
  'images/fullscreen/loadingscreen/bg.jpg',
  'images/fullscreen/loadingscreen/loading-border.png',
  'images/fullscreen/loadingscreen/temp-logo.png',
];

export interface Props {

}

export function ImagePreloader(props: Props) {
  return (
    <Container>
      {imagesToPreload.map((img) => {
        return (
          <img src={img} />
        );
      })}
    </Container>
  );
}
