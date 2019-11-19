/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';
import { WarbandContext } from 'components/context/WarbandContext';

const Container = styled.div`
  display: flex;
  align-items: center;
  height: calc(100% - 95px);
`;

const PlayerPosition = styled.div`
  position: absolute;
  left: 50%;
  width: 300px;
  height: 500px;

  &.Zero {
    transform: translateX(-50%);
    z-index: 10;
  }

  &.One {
    transform: translateX(-125%) scale(0.8);
    z-index: 9;
  }

  &.Two {
    transform: translateX(25%) scale(0.8);
    z-index: 8;
  }

  &.Three {
    transform: translateX(-200%) scale(0.7);
    z-index: 7;
  }

  &.Four {
    transform: translateX(100%) scale(0.7);
    z-index: 6;
  }

  &.Five {
    transform: translateX(-275%) scale(0.6);
    z-index: 5;
  }
`;

const PlayerContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const PlayerImage = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 500px;
  height: 800px;
  background-image: url(../images/fullscreen/startscreen/human-m-blackguard.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
`;

const PlayerInfoContainer = styled.div`
  position: absolute;
  left: 50%;
  bottom: 30%;
  width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  &.Zero {
    transform: translateX(-50%);
  }

  &.One {
    transform: translateX(-125%);
    bottom: 35%;
  }

  &.Two {
    transform: translateX(25%);
    bottom: 35%;
  }

  &.Three {
    transform: translateX(-200%);
    bottom: 37%;
  }

  &.Four {
    transform: translateX(100%);
    bottom: 37%;
  }

  &.Five {
    transform: translateX(-275%);
    bottom: 39%;
  }
`;

const ProfileBox = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  background-color: #7e7e7e;
  margin-right: 5px;

  &.leader:before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 10px;
    height: 10px;
    background-color: #ff7139;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.div`
  font-size: 22px;
  color: white;
  font-family: Lato;
`;

const Ready = styled.div`
  font-size: 18px;
  color: #7fff7e;

  &.not-ready {
    color: #FF786E;
  }
`;

export interface Player {
  id: string;
  image: string;
}

export interface Props {
  isReady: boolean;
}

export function PlayerView(props: Props) {
  const warbandContextState = useContext(WarbandContext);

  function getClassName(index: number) {
    switch (index) {
      case 0: {
        return 'Zero';
      };
      case 1: {
        return 'One';
      }
      case 2: {
        return 'Two';
      }
      case 3: {
        return 'Three';
      }
      case 4: {
        return 'Four';
      }
      case 5: {
        return 'Five';
      }
    }
  }

  function getSortedMembers() {
    const groupMembers = Object.values(warbandContextState.groupMembers);
    const myIndex = groupMembers.findIndex(m => m.characterID === hordetest.game.selfPlayerState.characterID);
    const memberInfo = groupMembers[myIndex];
    groupMembers.splice(myIndex, 1);
    groupMembers.unshift(memberInfo);
    return groupMembers;
  }

  if (warbandContextState.groupID) {
    return (
      <Container>
        {getSortedMembers().map((player, i) => {
          return (
            <>
              <PlayerPosition className={getClassName(i)}>
                <PlayerContainer>
                  <PlayerImage className={'player-image'} />
                </PlayerContainer>
              </PlayerPosition>
              <PlayerInfoContainer className={getClassName(i)}>
                <ProfileBox className={player.isLeader ? 'leader' : ''} />
                <TextContainer>
                  <Name>{player.name}</Name>
                  <Ready className={player.isReady ? '' : 'not-ready'}>{player.isReady ? 'Ready' : 'Not Ready'}</Ready>
                </TextContainer>
              </PlayerInfoContainer>
            </>
          );
        })}
      </Container>
    );
  }

  const player = hordetest.game.selfPlayerState;
  return (
    <Container>
      <PlayerPosition className={getClassName(0)}>
        <PlayerContainer>
          <PlayerImage className={'player-image'} />
        </PlayerContainer>
      </PlayerPosition>
      <PlayerInfoContainer className={getClassName(0)}>
        <ProfileBox className={true ? 'leader' : ''} />
        <TextContainer>
          <Name>{player.name}</Name>
          <Ready className={props.isReady ? '' : 'not-ready'}>{props.isReady ? 'Ready' : 'Not Ready'}</Ready>
        </TextContainer>
      </PlayerInfoContainer>
    </Container>
  );
}
