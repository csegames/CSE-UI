/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const ChampionProfileContainer = styled.div`
  display: flex;
  align-items: center;
  width: 37px;
  height: 37px;
  justify-content: center;
  border: 3px solid #1a1a1a;
  background-color: #4d4d4d;
  transform: skewX(-10deg);
`;

const ProfileBox = styled.div`
  transform: skewX(10deg);
`;

export interface Props {
}

export function ChampionProfile(props: Props) {
  return (
    <ChampionProfileContainer>
      <ProfileBox>
        P
      </ProfileBox>
    </ChampionProfileContainer>
  );
}
