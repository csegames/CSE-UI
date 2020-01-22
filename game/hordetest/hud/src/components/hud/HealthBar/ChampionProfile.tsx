/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const ChampionProfileContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 75px;
  height: 75px;
  justify-content: center;
  border: 3px solid #1a1a1a;
  background-color: rgb(51, 51, 51);
  transform: skewX(-10deg);
  overflow: hidden;
`;

const ProfileBox = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  transform: skewX(10deg);
  overflow: hidden;
`;

const Image = styled.img`
  position: absolute;
  top: -5%;
  right: -5%;
  bottom: -5%;
  left: -7%;
  object-fit: cover;
  width: 115%;
  height: 115%;
`;

const DeadX = styled.img`
  position: absolute;
  width: 110%;
  height: 110%;
  object-fit: contain;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`;

export interface Props {
  race: Race;
  isAlive: boolean;
  containerStyles?: string;
}

export function ChampionProfile(props: Props) {
  function getProfileImage() {
    const myRace = hordetest.game.races.find(r => r.id === props.race);
    if (!myRace) return 'images/fullscreen/character-select/face.png';

    return myRace.thumbnailURL;
  }

  return (
    <ChampionProfileContainer className={props.containerStyles ? props.containerStyles : ''}>
      <ProfileBox>
        <Image src={getProfileImage()} />
      </ProfileBox>
      {!props.isAlive && <DeadX src={'images/hud/dead-x.svg'} />}
    </ChampionProfileContainer>
  );
}