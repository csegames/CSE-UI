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
  width: 43px;
  height: 43px;
  justify-content: center;
  border: 3px solid #1a1a1a;
  background-color: black;
  transform: skewX(-13deg);
  overflow: hidden;
`;

const ProfileBox = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform: skewX(13deg);
`;

const Image = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  object-fit: cover;
  width: 100%;
  height: 100%;
`;

export interface Props {
}

export function ChampionProfile(props: Props) {
  return (
    <ChampionProfileContainer>
      <ProfileBox>
        <Image src='images/fullscreen/character-select/face.png' />
      </ProfileBox>
    </ChampionProfileContainer>
  );
}
