/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React, { useState, useContext, useEffect } from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { webAPI } from '@csegames/library/lib/hordetest';

import { Header } from '../Header';
import { ChampionPick } from './ChampionPick';
import { ChampionInfo } from './ChampionInfo';
import { LockedList } from './LockedList';
import { LockIn } from './LockIn';
import { TransitionAnimation } from '../../shared/TransitionAnimation';
import { ChampionInfoContext } from 'context/ChampionInfoContext';
import { MatchmakingContext } from 'context/MatchmakingContext';
import { InputContext } from 'context/InputContext';
import { ColossusProfileContext } from 'context/ColossusProfileContext';
import { ChampionSelectContextProvider } from './context/ChampionSelectContext';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  background-color: black;
  z-index: 0;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), transparent);

  opacity: 0;
  animation: slideIn 0.5s forwards ;
  @keyframes slideIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const HeaderItemContainer = styled.div`
  display: flex;
  flex: 1;

  &.align-center {
    justify-content: center;
  }
`;

const GameModeContainer = styled.div`
  margin-top: 30px;
  margin-left: 30px;
`;

const GameModeText = styled.div`
  font-size: 30px;
  line-height: 30px;
  font-family: Colus;
  text-transform: uppercase;
  color: white;
`;

const GameModeDifficulty = styled.div`
  font-size: 16px;
  line-height: 16px;
  font-family: Colus;
  text-transform: uppercase;
  color: #707070;
`;

const ChampionPickContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  position: fixed;
  z-index: 1;
  bottom: 150px;
  opacity: 0;
  margin-bottom: -5%;
  animation: slideIn 0.5s forwards ;

  @keyframes slideIn {
    from {
      opacity: 0;
      margin-bottom: -5%;
    }
    to {
      opacity: 1;
      margin-bottom: 0;
    }
  }
`;

const SelectedChampionBackground = styled.img`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
`;

const SelectedChampionContainer = css`
  position: relative;
  width: 80%;
  height: 140%;
  pointer-events: none;
  top: 0;
  bottom: 0;
  left: auto;
  -webkit-mask-image: linear-gradient(to top, transparent 25%, black 65%);
`;

const SelectedChampionTransitionAnimation = css`
  animation: slideIn 0.5s forwards;
  opacity: 0;
  margin-left: -10%;

  @keyframes slideIn {
    from {
      opacity: 0;
      margin-left: -10%;
    }
    to {
      opacity: 1;
      margin-left: 0;
    }
  }
`;

const SelectedChampionImage = styled.img`
  position: absolute;
  width: 80%;
  height: 80%;
  object-fit: contain;
  right: -5%;
`;

const ChampionInfoContainer = styled.div`
  position: absolute;
  left: 45%;
  top: 40%;
  transform: translate(-50%, -50%);
`;

const LockedListContainer = styled.div`
  position: absolute;
  top: 100px;

  &.right {
    right: -60px;
  }

  &.left {
    left: -60px;
  }
`;

const LockInPosition = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 60px;
`;

const ConsoleNavIcon = styled.div`
  color: white;
  font-size: 30px;
  color: white;
  margin: 0 10px;
`;

const BackgroundAnimationClass = css`
  opacity: 0;
  animation: fadeIn 0.5s forwards;

  @keyframes fadeIn {
    from {
      opacity: 0;
    }

    to {
      opacity: 1;
    }
  }
`;

export interface Props {
  gameMode: string;
  difficulty: string;
  onSelectionTimeOver: () => void;
}

export interface Champion {
  id: string;
  name: string;
  image: string;
  previewImage?: string;
  abilities: { type: 'light' | 'heavy' | 'ultimate', name: string, iconClass: string }[];
}

export function ChampionSelect(props: Props) {
  const { champions, championCostumes } = useContext(ChampionInfoContext);
  const { matchID } = useContext(MatchmakingContext);
  const inputContext = useContext(InputContext);
  const colossusProfileContext = useContext(ColossusProfileContext);
  const [selectedChampion, setSelectedChampion] = useState(getDefaultSelectedChampion());
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (selectedChampion) {
      updateSelectedChampion(selectedChampion.id, getChampionCostumeInfo(selectedChampion.id).id);
    }

    game.playGameSound(SoundEvents.PLAY_USER_FLOW_CHAMP_SELECT);
  }, []);

  function getDefaultSelectedChampion() {
    const colossusProfile = colossusProfileContext.colossusProfile;
    if (colossusProfile && colossusProfile.defaultChampion && colossusProfile.defaultChampion.championID) {
      const colossusProfileChampion = champions.find(c => c.id === colossusProfile.defaultChampion.championID);

      if (colossusProfileChampion) {
        return colossusProfileChampion;
      } else {
        console.error('User had a ColossusProfile default champion with an invalid championID');
      }
    }

    return champions[0];
  }

  function getChampionCostumeInfo(championID: string) {
    return championCostumes.find(c => c.requiredChampionID === championID);
  }

  function onChampionPick(championID: string) {
    if (isLocked) {
      return;
    }
    const champion = champions.find(c => championID === c.id);
    setSelectedChampion(champion);
    const costumeinfo = getChampionCostumeInfo(championID);
    updateSelectedChampion(championID, costumeinfo.id);
  }

  async function updateSelectedChampion(championID: string, costumeID: string) {
    const request: SelectChampionRequest = {
      ChampionID: championID,
      ChampionMetaData: {
        costume: costumeID
      }
    };
    await webAPI.ChampionAPI.SelectChampion(webAPI.defaultConfig, request);
  }

  async function onLockIn() {
    setIsLocked(true);
    const res = await webAPI.ChampionAPI.LockInChampionSelection(webAPI.defaultConfig);
    if (!res.ok) {
      // TODO: Handle why this is not OK
      setIsLocked(false);
      console.error("Champion lock failed: " + res.data)
    }
  }

  const selectedChampionCostumeInfo = selectedChampion ? getChampionCostumeInfo(selectedChampion.id) : null;
  const standingImage = selectedChampionCostumeInfo ?
    selectedChampionCostumeInfo.standingImageURL : 'images/hud/champions/berserker.png';
  const backgroundImage = selectedChampionCostumeInfo ? selectedChampionCostumeInfo.backgroundImageURL : 
    'images/hud/champions/berserker-champion-card-bg.jpg';
  return (
    <ChampionSelectContextProvider matchID={matchID}>
      <Container>
        <TransitionAnimation
          changeVariable={backgroundImage}
          animationDuration={500}
          animationClass={BackgroundAnimationClass}>
          <SelectedChampionBackground src={backgroundImage} />
        </TransitionAnimation>

        <HeaderContainer>
          <HeaderItemContainer>
            <GameModeContainer>
              <GameModeText>{props.gameMode}</GameModeText>
              <GameModeDifficulty>{props.difficulty}</GameModeDifficulty>
            </GameModeContainer>
          </HeaderItemContainer>
          <HeaderItemContainer className='align-center'>
            <Header isSelected>Select your champion</Header>
          </HeaderItemContainer>
          <HeaderItemContainer />
        </HeaderContainer>

        <ChampionPickContainer>
          {inputContext.isConsole && <ConsoleNavIcon className='icon-xb-lb' />}
          {champions.map((champion) => {
            const isSelected = selectedChampion ? champion.id === selectedChampion.id : false;
            const championCostumeInfo = getChampionCostumeInfo(champion.id);
            return (
              <ChampionPick
                key={champion.id}
                isDisabled={isLocked}
                isSelected={isSelected}
                id={champion.id}
                image={championCostumeInfo.thumbnailURL}
                onClick={onChampionPick}
              />
            );
          })}
          {inputContext.isConsole && <ConsoleNavIcon className='icon-xb-rb' />}
        </ChampionPickContainer>

        <TransitionAnimation
          changeVariable={standingImage}
          animationDuration={500}
          animationClass={SelectedChampionTransitionAnimation}
          containerStyles={SelectedChampionContainer}>
          <SelectedChampionImage src={standingImage} />
        </TransitionAnimation>

        <ChampionInfoContainer>
          <ChampionInfo selectedChampion={selectedChampion} />
        </ChampionInfoContainer>

        <LockedListContainer className='right'>
          <LockedList type='right' />
        </LockedListContainer>

        <LockedListContainer className='left'>
          <LockedList type='left' />
        </LockedListContainer>

        <LockInPosition>
          <LockIn isLocked={isLocked} onLockIn={onLockIn} onSelectionTimeOver={props.onSelectionTimeOver} />
        </LockInPosition>
      </Container>
    </ChampionSelectContextProvider>
  );
}
