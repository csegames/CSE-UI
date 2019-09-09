/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const KillStreakCounterContainer = styled.div`
  width: 200px;
`;

const Text = styled.div`
  color: white;
  font-size: 18px;
  text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.5);
  text-transform: uppercase;
`;

const BarContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  height: 12px;
  border: 2px solid #bdbab4;
`;

const Fill = styled.div`
  position: absolute;
  top: 1px;
  right: 1px;
  bottom: 1px;
  left: 1px;
  background-color: #f7f7f7;
`;

export function KillStreakCounter() {
  return (
    <KillStreakCounterContainer>
      <Text>23 Kills</Text>
      <BarContainer>
        <Fill style={{ width: '75%' }} />
      </BarContainer>
    </KillStreakCounterContainer>
  );
}
