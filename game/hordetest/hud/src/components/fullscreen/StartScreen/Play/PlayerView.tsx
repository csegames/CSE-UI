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
import { WarbandContext, PartialGroupMemberState } from 'context/WarbandContext';
import { ColossusProfileContext } from 'context/ColossusProfileContext';
import { ChampionInfoContext } from 'context/ChampionInfoContext';
import { MatchmakingContext, PlayerNumberMode } from 'context/MatchmakingContext';

const Container = styled.div`
  display: flex;
  align-items: center;
  height: calc(100% - 95px);
`;

const TenManGroupContainer = styled.div`
  position: absolute;
  display: flex;

  &.topLevel {
    top: 20%;
    left: 50%;
    transform: translateX(-45%) scale(0.8);
  }

  &.bottomLevel {
    bottom: 10%;
    left: 50%;
    transform: translateX(-55%) scale(0.8);
  }
`;

const PlayerPosition = styled.div`
  left: 50%;
  width: 300px;
  height: 500px;
  pointer-events: none;

  &.sixman {
    position: absolute;
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
  }
`;

const PlayerContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;

  &.self {
    left: 50%;
    transform: translateX(-50%);
  }

  .playerInfoContainer {
    top: 50px;
  }

  &.topLevel {
    flex-direction: column-reverse;

    .playerInfoContainer {
      top: -50px;
    }
  }
`;

const PlayerImageContainer = styled.div`
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
  position: relative;
  width: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10;

  &.sixman {
    position: absolute;
    left: 50%;
    bottom: 20%;
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
  const matchmakingContext = useContext(MatchmakingContext);
  const champions = getChampions();

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
    const sortedGroupMembers = getSortedMembers();
    if (matchmakingContext.selectedPlayerNumberMode === PlayerNumberMode.SixMan) {
      return <SixManView groupMembers={sortedGroupMembers} />;
    }

    return <TenManView groupMembers={sortedGroupMembers} />;
  }

  const defaultChampion = getMyDefaultChampion();
  const standingImage = defaultChampion ? defaultChampion.standingImageURL :
    'images/hud/champions/berserker.png';
  const thumbnailImage = defaultChampion ? defaultChampion.thumbnailURL : '';
  const displayName = myUserContext.myUser ? myUserContext.myUser.displayName : 'You'
  return (
    <Container>
      {/* <TenManGroupContainer className='topLevel'> */}
        <Player
          index={0}
          standingImage={standingImage}
          thumbnailImage={thumbnailImage}
          displayName={displayName}
          className='self'
        />
        {/* <Player
          index={1}
          standingImage={'images/hud/champions/berserker.png'}
          thumbnailImage={thumbnailImage}
          displayName={'DisplayName'}
          className='topLevel'
        />
        <Player
          index={2}
          standingImage={'images/hud/champions/amazon.png'}
          thumbnailImage={thumbnailImage}
          displayName={'DisplayName'}
          className='topLevel'
        />
        <Player
          index={3}
          standingImage={'images/hud/champions/amazon.png'}
          thumbnailImage={thumbnailImage}
          displayName='DisplayName'
          className='topLevel'
        />
        <Player
          index={4}
          standingImage={'images/hud/champions/knight.png'}
          thumbnailImage={thumbnailImage}
          displayName={'DisplayName'}
          className='topLevel'
        />
      </TenManGroupContainer> */}
      {/* <TenManGroupContainer className='bottomLevel'>
        <Player
          index={5}
          standingImage={'images/hud/champions/knight.png'}
          thumbnailImage={thumbnailImage}
          displayName={'DisplayName'}
        />
        <Player
          index={6}
          standingImage={'images/hud/champions/celt.png'}
          thumbnailImage={thumbnailImage}
          displayName={'DisplayName'}
        />
        <Player
          index={7}
          standingImage={'images/hud/champions/berserker.png'}
          thumbnailImage={thumbnailImage}
          displayName={'DisplayName'}
        />
        <Player
          index={8}
          standingImage={'images/hud/champions/amazon.png'}
          thumbnailImage={thumbnailImage}
          displayName={'DisplayName'}
        />
        <Player
          index={9}
          standingImage={'images/hud/champions/celt.png'}
          thumbnailImage={thumbnailImage}
          displayName={'DisplayName'}
        />
      </TenManGroupContainer> */}
    </Container>
  );
}

function Player(props: {
  index: number,
  standingImage: string,
  thumbnailImage: string,
  displayName: string,
  className?: string,
}) {
  return (
    <PlayerContainer className={props.className}>
      <PlayerPosition className={''}>
        <PlayerImageContainer>
          <PlayerImage className={'player-image'} image={props.standingImage} />
        </PlayerImageContainer>
      </PlayerPosition>
      <PlayerInfoContainer className={'playerInfoContainer'}>
        <ProfileBox className={true ? 'leader' : ''} image={props.thumbnailImage} />
        <TextContainer>
          <Name>{props.displayName}</Name>
        </TextContainer>
      </PlayerInfoContainer>
    </PlayerContainer>
  )
}

function SixManView(props: { groupMembers: PartialGroupMemberState[] }) {
  function getClassName(index: number) {
    const modeType = 'sixman';
    switch (index) {
      case 0: {
        return `${modeType} Zero`;
      };
      case 1: {
        return `${modeType} One`;
      }
      case 2: {
        return `${modeType} Two`;
      }
      case 3: {
        return `${modeType} Three`;
      }
      case 4: {
        return `${modeType} Four`;
      }
      case 5: {
        return `${modeType} Five`;
      }
      case 6: {
        return `${modeType} Six`;
      }
      case 7: {
        return `${modeType} Seven`;
      }
      case 8: {
        return `${modeType} Eight`;
      }
      case 9: {
        return `${modeType} Nine`;
      }
    }
  }

  return (
    <Container>
      {props.groupMembers.map((player, i) => {
        return (
          <>
            <PlayerPosition className={getClassName(i)}>
              <PlayerImageContainer>
                <PlayerImage
                  className={'player-image'}
                  image={'images/hud/champions/berserker.png'}
                />
              </PlayerImageContainer>
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

function TenManView(props: { groupMembers: PartialGroupMemberState[] }) {
  const firstHalf = props.groupMembers.slice(0, 5);
  const secondHalf = props.groupMembers.slice(5, 10);
  return (
    <Container>
      <TenManGroupContainer className='topLevel'>
        {firstHalf.map((player, i) => {
          return (
            <Player
              index={i}
              standingImage={'images/hud/champions/berserker.png'}
              thumbnailImage={'images/hud/champions/berserker-profile.png'}
              displayName={player.name}
            />
          );
        })}
      </TenManGroupContainer>
      <TenManGroupContainer className='bottomLevel'>
        {secondHalf.map((player, i) => {
          return (
            <Player
              index={i}
              standingImage={'images/hud/champions/berserker.png'}
              thumbnailImage={'images/hud/champions/berserker-profile.png'}
              displayName={player.name}
            />
          );
        })}
      </TenManGroupContainer>
    </Container>
  );
}
