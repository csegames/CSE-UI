/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';
import { StatusContext } from 'context/StatusContext';

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

const EffectOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);

  &.hostile {
    background-color: rgba(145, 0, 0, 0.5);
  }
`;

const EffectIcon = styled.div`
  position: absolute;
  font-size: 60px;
  color: white;
  top: 0;
  right: 0;
  left: 0;
  bottom: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: pulse 0.7s infinite alternate;
  transform: skewX(10deg);

  @keyframes pulse {
    from {
      opacity: 1;
    }

    to {
      opacity: 0.6;
    }
  }
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
  statuses: ArrayMap<Status>;
}

export function ChampionProfile(props: Props) {
  const { statusDefs } = useContext(StatusContext);
  function getProfileImage() {
    const myRace = hordetest.game.races.find(r => r.id === props.race);
    if (!myRace) return 'images/fullscreen/character-select/face.png';

    return myRace.thumbnailURL;
  }

  function getEffectInfo() {
    if (!props.statuses) return null;

    const statuses = Object.values(props.statuses);

    let statusDef: { id: string, numericID: number, name: string, iconClass: string, statusTags: string[] } = null;
    statuses.forEach((status) => {
      if (!statusDef) {
        statusDef = statusDefs.find(def => def.numericID === status.id && def.iconClass);
      }
    });

    if (!statusDef) return null;
    return statusDef;
  }

  const effect = getEffectInfo();
  return (
    <ChampionProfileContainer className={props.containerStyles ? props.containerStyles : ''}>
      <ProfileBox>
        <Image src={getProfileImage()} />
      </ProfileBox>
      {effect &&
        <EffectOverlay className={effect.statusTags.includes('hostile') ? 'hostile' : ''}>
          <EffectIcon className={effect.iconClass} />
        </EffectOverlay>
      }
      {!props.isAlive && <DeadX src={'images/hud/dead-x.svg'} />}
    </ChampionProfileContainer>
  );
}