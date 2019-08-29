/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const PlayerTrackerContainer = styled.div`

`;

export interface Props {
  name: string;
  color: string;
  seconds: number;
  position: Vec3f;
}

export function PlayerTracker(props: Props) {
  return (
    <PlayerTrackerContainer />
  );
}
