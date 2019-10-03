/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const CrosshairImage = styled.img`
  width: 102px;
  height: 102px;
`;

export function Crosshair() {
  return (
    <CrosshairImage src={'images/hud/crosshair.png'} />
  );
}
