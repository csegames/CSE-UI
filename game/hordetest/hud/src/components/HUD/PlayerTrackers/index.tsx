/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import { styled } from '@csegames/linaria/react';
import { PlayerTracker } from './PlayerTracker';

const PlayerTrackersContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  pointer-events: none;
`;

export interface Props {
}

interface PlayerTrackerInfo {
  name: string;
  color: string;
  seconds: number;
  position: Vec3f;
}

export function PlayerTrackers(props: Props) {
  const [playerTrackers] = useState<PlayerTrackerInfo[]>([]);
  return (
    <PlayerTrackersContainer>
      {playerTrackers.map((pt, i) => (
        <PlayerTracker
          key={i}
          name={pt.name}
          color={pt.color}
          seconds={pt.seconds}
          position={pt.position}
        />
      ))}
    </PlayerTrackersContainer>
  );
}
