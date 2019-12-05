/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';
import { StatusContext } from 'context/StatusContext';

const ChampionProfileContainer = styled.div`
  display: flex;
  align-items: center;
  width: 75px;
  height: 75px;
  justify-content: center;
  border: 3px solid #1a1a1a;
  background-color: black;
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

const DebuffIcon = styled.div`
  position: absolute;
  font-size: 50px;
  color: white;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
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
  statuses: ArrayMap<{ id: number } & Timing>;
}

export function ChampionProfile(props: Props) {
  const { statusDefs } = useContext(StatusContext);
  function getProfileImage() {
    const myRace = hordetest.game.races.find(r => r.id === props.race);
    if (!myRace) return 'images/fullscreen/character-select/face.png';

    return myRace.thumbnailURL;
  }

  function getDebuffIconClass() {
    if (!props.statuses) return '';

    const statuses = Object.values(props.statuses);

    let statusDef: { id: string, numericID: number, name: string, iconClass: string } = null;
    statuses.forEach((status) => {
      if (!statusDef) {
        statusDef = statusDefs.find(def => def.numericID === status.id && def.statusTags.includes('hostile'));
      }
    });

    if (!statusDef) return '';
    return statusDef.iconClass;
  }

  return (
    <ChampionProfileContainer className={props.containerStyles ? props.containerStyles : ''}>
      <ProfileBox>
        <Image src={getProfileImage()} />
        <DebuffIcon className={getDebuffIconClass()} />
      </ProfileBox>
      {!props.isAlive && <DeadX src={'images/hud/dead-x.svg'} />}
    </ChampionProfileContainer>
  );
}
