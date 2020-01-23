/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';
import { ChampionCostumeInfo, ChampionInfo } from '@csegames/library/lib/hordetest/graphql/schema';

import { MyUserContext } from 'context/MyUserContext';
import { WarbandContext } from 'context/WarbandContext';
import { ColossusProfileContext } from 'context/ColossusProfileContext';
import { ChampionInfoContext } from 'context/ChampionInfoContext';

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
  width: 600px;
  height: 800px;
  background-image: ${(props: { image: string } & React.HTMLProps<HTMLDivElement>) => `url(${props.image})`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
`;

const PlayerInfoContainer = styled.div`
  position: absolute;
  left: 50%;
  bottom: 20%;
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
    bottom: 25%;
  }

  &.Two {
    transform: translateX(25%);
    bottom: 25%;
  }

  &.Three {
    transform: translateX(-200%);
    bottom: 27%;
  }

  &.Four {
    transform: translateX(100%);
    bottom: 27%;
  }

  &.Five {
    transform: translateX(-275%);
    bottom: 29%;
  }
`;

const ProfileBox = styled.div`
  position: relative;
  width: 40px;
  height: 40px;
  background-color: #7e7e7e;
  margin-right: 10px;
  background-image: ${(props: { image: string } & React.HTMLProps<HTMLDivElement>) => `url(${props.image})`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;

  &.leader:before {
    content: '';
    position: absolute;
    top: -5px;
    right: -5px;
    width: 10px;
    height: 10px;
    background-color: #ffd805;
  }
  &.leader:after {
    content: '';
    position: absolute;
    top: -3px;
    right: -3px;
    width: 44px;
    height: 44px;
    border: 1px solid #ffd805;
  }
`;

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 5px;
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

export interface Champion extends ChampionInfo {
  costumes: ChampionCostumeInfo[];
}

export interface Player {
  id: string;
  image: string;
}

export interface Props {
  isReady: boolean;
}

export function PlayerView(props: Props) {
  const warbandContextState = useContext(WarbandContext);
  const colossusProfileContext = useContext(ColossusProfileContext);
  const championInfoContext = useContext(ChampionInfoContext);
  const myUserContext = useContext(MyUserContext);
  const champions = getChampions();

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
    const myIndex = groupMembers.findIndex(m => m.characterID === game.characterID);
    const memberInfo = groupMembers[myIndex];
    groupMembers.splice(myIndex, 1);
    groupMembers.unshift(memberInfo);
    return groupMembers;
  }

  function getChampions(): Champion[] {
    const champions = cloneDeep(championInfoContext.champions);
    return champions.map((champ) => {
      const championCostumes = championInfoContext.championCostumes.filter(costume =>
        costume.requiredChampionID === champ.id);
      return {
        ...champ,
        costumes: championCostumes,
      };
    });
  }

  function getMyDefaultChampion(): ChampionCostumeInfo {
    if (colossusProfileContext.colossusProfile && colossusProfileContext.colossusProfile.defaultChampion) {
      const champ = champions.find(c => c.id === colossusProfileContext.colossusProfile.defaultChampion.championID);
      if (champ && champ.costumes) {
        return champ.costumes.find(c => c.id === colossusProfileContext.colossusProfile.defaultChampion.costumeID);
      }
      else {
        console.error("Default champ or champ costumes missing!");
      }
    }

    return null;
  }

  if (warbandContextState.groupID) {
    return (
      <Container>
        {getSortedMembers().map((player, i) => {
          return (
            <>
              <PlayerPosition className={getClassName(i)}>
                <PlayerContainer>
                  <PlayerImage
                    className={'player-image'}
                    image={'images/fullscreen/startscreen/human-m-blackguard.png'}
                  />
                </PlayerContainer>
              </PlayerPosition>
              <PlayerInfoContainer className={getClassName(i)}>
                <ProfileBox className={player.isLeader ? 'leader' : ''} image={''} />
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

  const defaultChampion = getMyDefaultChampion();
  const standingImage = defaultChampion ? defaultChampion.standingImageURL :
    'images/fullscreen/startscreen/human-m-blackguard.png';
  const thumbnailImage = defaultChampion ? defaultChampion.thumbnailURL : '';
  return (
    <Container>
      <PlayerPosition className={getClassName(0)}>
        <PlayerContainer>
          <PlayerImage className={'player-image'} image={standingImage} />
        </PlayerContainer>
      </PlayerPosition>
      <PlayerInfoContainer className={getClassName(0)}>
        <ProfileBox className={true ? 'leader' : ''} image={thumbnailImage} />
        <TextContainer>
          <Name>{myUserContext.myUser ? myUserContext.myUser.displayName : 'You'}</Name>
          <Ready className={props.isReady ? '' : 'not-ready'}>{props.isReady ? 'Ready' : 'Not Ready'}</Ready>
        </TextContainer>
      </PlayerInfoContainer>

      {/* <PlayerPosition className={getClassName(1)}>
        <PlayerContainer>
          <PlayerImage className={'player-image'} image={'images/hud/champions/berserker.png'} />
        </PlayerContainer>
      </PlayerPosition>
      <PlayerInfoContainer className={getClassName(1)}>
        <ProfileBox className={true ? 'leader' : ''} image={thumbnailImage} />
        <TextContainer>
          <Name>You</Name>
          <Ready className={props.isReady ? '' : 'not-ready'}>{props.isReady ? 'Ready' : 'Not Ready'}</Ready>
        </TextContainer>
      </PlayerInfoContainer>

      <PlayerPosition className={getClassName(2)}>
        <PlayerContainer>
          <PlayerImage className={'player-image'} image={'images/hud/champions/amazon.png'} />
        </PlayerContainer>
      </PlayerPosition>
      <PlayerInfoContainer className={getClassName(2)}>
        <ProfileBox className={true ? 'leader' : ''} image={thumbnailImage} />
        <TextContainer>
          <Name>You</Name>
          <Ready className={props.isReady ? '' : 'not-ready'}>{props.isReady ? 'Ready' : 'Not Ready'}</Ready>
        </TextContainer>
      </PlayerInfoContainer>

      <PlayerPosition className={getClassName(3)}>
        <PlayerContainer>
          <PlayerImage className={'player-image'} image={'images/hud/champions/amazon.png'} />
        </PlayerContainer>
      </PlayerPosition>
      <PlayerInfoContainer className={getClassName(3)}>
        <ProfileBox className={true ? 'leader' : ''} image={thumbnailImage} />
        <TextContainer>
          <Name>You</Name>
          <Ready className={props.isReady ? '' : 'not-ready'}>{props.isReady ? 'Ready' : 'Not Ready'}</Ready>
        </TextContainer>
      </PlayerInfoContainer>

      <PlayerPosition className={getClassName(4)}>
        <PlayerContainer>
          <PlayerImage className={'player-image'} image={'images/hud/champions/knight.png'} />
        </PlayerContainer>
      </PlayerPosition>
      <PlayerInfoContainer className={getClassName(4)}>
        <ProfileBox className={true ? 'leader' : ''} image={thumbnailImage} />
        <TextContainer>
          <Name>You</Name>
          <Ready className={props.isReady ? '' : 'not-ready'}>{props.isReady ? 'Ready' : 'Not Ready'}</Ready>
        </TextContainer>
      </PlayerInfoContainer>

      <PlayerPosition className={getClassName(5)}>
        <PlayerContainer>
          <PlayerImage className={'player-image'} image={'images/hud/champions/knight.png'} />
        </PlayerContainer>
      </PlayerPosition>
      <PlayerInfoContainer className={getClassName(5)}>
        <ProfileBox className={true ? 'leader' : ''} image={thumbnailImage} />
        <TextContainer>
          <Name>You</Name>
          <Ready className={props.isReady ? '' : 'not-ready'}>{props.isReady ? 'Ready' : 'Not Ready'}</Ready>
        </TextContainer>
      </PlayerInfoContainer> */}
    </Container>
  );
}
