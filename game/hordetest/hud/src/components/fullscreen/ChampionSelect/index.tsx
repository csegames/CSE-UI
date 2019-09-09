/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React, { useState } from 'react';
import { styled } from '@csegames/linaria/react';
import { Header } from '../Header';
import { ChampionPick } from './ChampionPick';
import { ChampionInfo } from './ChampionInfo';
import { LockedList } from './LockedList';
import { LockIn } from './LockIn';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const HeaderContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.5), transparent);
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
`;

const SelectedChampionContainer = styled.div`
  position: relative;
  width: 60%;
  height: 100%;
  pointer-events: none;
  top: 0;
  bottom: 0;
  left: 0;
`;

const SelectedChampionImage = styled.img`
  position: absolute;
  width: 100%;
  height: 120%;
  object-fit: cover;
  top: -20%;
`;

const ChampionInfoContainer = styled.div`
  position: absolute;
  left: 60%;
  top: 50%;
  transform: translate(-50%, -50%);
`;

const LockedListContainer = styled.div`
  position: absolute;
  top: 75px;
  right: 28px;
`;

const LockInPosition = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 70px;
`;

const ConsoleNavIcon = styled.div`
  color: white;
  font-size: 30px;
  color: white;
  margin: 0 10px;
`;

export interface Props {
  gameMode: string;
  difficulty: string;
  onLockIn: () => void;
}

export interface Champion {
  id: string;
  name: string;
  image: string;
  previewImage?: string;
  abilities: { type: 'light' | 'heavy' | 'ultimate', name: string, iconClass: string }[];
}

const champions: Champion[] = [
  {
    id: 'test1',
    name: 'Berserker',
    previewImage: 'images/fullscreen/character-select/face.png',
    image: 'images/fullscreen/startscreen/human-m-blackguard.png',
    abilities: [
      { type: 'light', name: 'Cleave', iconClass: 'icon-icon-axe' },
      { type: 'heavy', name: 'Iron Claw', iconClass: 'icon-permissions' },
      { type: 'ultimate', name: 'Undying Rage', iconClass: 'icon-shout-tab' },
    ],
  },
  {
    id: 'test2',
    name: 'Amazon',
    previewImage: 'images/fullscreen/character-select/face.png',
    image: 'images/fullscreen/startscreen/human-m-blackguard.png',
    abilities: [
      { type: 'light', name: 'Javelin Toss', iconClass: 'icon-category-spear' },
      { type: 'heavy', name: 'Steady Shot', iconClass: 'icon-bow-arrow-tab' },
      { type: 'ultimate', name: 'Horse Charge', iconClass: 'icon-horse' },
    ],
  },
  {
    id: 'test3',
    name: 'Berserker 3',
    previewImage: 'images/fullscreen/character-select/face.png',
    image: 'images/fullscreen/startscreen/human-m-blackguard.png',
    abilities: [
      { type: 'light', name: 'Cleave', iconClass: 'icon-icon-axe' },
      { type: 'heavy', name: 'Iron Claw', iconClass: 'icon-permissions' },
      { type: 'ultimate', name: 'Undying Rage', iconClass: 'icon-shout-tab' },
    ],
  },
  {
    id: 'test4',
    name: 'Berserker 4',
    previewImage: 'images/fullscreen/character-select/face.png',
    image: 'images/fullscreen/startscreen/human-m-blackguard.png',
    abilities: [
      { type: 'light', name: 'Cleave', iconClass: 'icon-icon-axe' },
      { type: 'heavy', name: 'Iron Claw', iconClass: 'icon-permissions' },
      { type: 'ultimate', name: 'Undying Rage', iconClass: 'icon-shout-tab' },
    ],
  },
  {
    id: 'test5',
    name: 'Berserker 5',
    previewImage: 'images/fullscreen/character-select/face.png',
    image: 'images/fullscreen/startscreen/human-m-blackguard.png',
    abilities: [
      { type: 'light', name: 'Cleave', iconClass: 'icon-icon-axe' },
      { type: 'heavy', name: 'Iron Claw', iconClass: 'icon-permissions' },
      { type: 'ultimate', name: 'Undying Rage', iconClass: 'icon-shout-tab' },
    ],
  },
  {
    id: 'test6',
    name: 'Berserker 6',
    previewImage: 'images/fullscreen/character-select/face.png',
    image: 'images/fullscreen/startscreen/human-m-blackguard.png',
    abilities: [
      { type: 'light', name: 'Cleave', iconClass: 'icon-icon-axe' },
      { type: 'heavy', name: 'Iron Claw', iconClass: 'icon-permissions' },
      { type: 'ultimate', name: 'Undying Rage', iconClass: 'icon-shout-tab' },
    ],
  },
];

const players = [
  { name: 'Player 1', isLocked: false, image: 'images/fullscreen/character-select/selected-face.png' },
  { name: 'Player 2', isLocked: false, image: 'images/fullscreen/character-select/selected-face.png' },
  { name: 'Player 3', isLocked: true, image: 'images/fullscreen/character-select/selected-face.png' },
  { name: 'Player 4', isLocked: false, image: 'images/fullscreen/character-select/selected-face.png' },
  { name: 'Player 5', isLocked: true, image: 'images/fullscreen/character-select/selected-face.png' },
  { name: 'Player 6', isLocked: false, image: 'images/fullscreen/character-select/selected-face.png' },
  { name: 'Player 7', isLocked: false, image: 'images/fullscreen/character-select/selected-face.png' },
  { name: 'Player 8', isLocked: true, image: 'images/fullscreen/character-select/selected-face.png' },
];

export function ChampionSelect(props: Props) {
  const [selectedChampion, setSelectedChampion] = useState(champions[0]);

  function onChampionPick(championID: string) {
    const champion = champions.find(c => championID === c.id);
    setSelectedChampion(champion);
  }

  return (
    <Container>
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
        <ConsoleNavIcon className='icon-xb-lb' />
        {champions.map((champion) => {
          const isSelected = champion.id === selectedChampion.id;
          return (
            <ChampionPick
              isSelected={isSelected}
              id={champion.id}
              image={champion.previewImage}
              onClick={onChampionPick}
            />
          );
        })}
        <ConsoleNavIcon className='icon-xb-rb' />
      </ChampionPickContainer>
      <SelectedChampionContainer>
        <SelectedChampionImage src={selectedChampion.image} />
      </SelectedChampionContainer>
      <ChampionInfoContainer>
        <ChampionInfo selectedChampion={selectedChampion} />
      </ChampionInfoContainer>
      <LockedListContainer>
        <LockedList players={players} />
      </LockedListContainer>
      <LockInPosition>
        <LockIn onLockIn={props.onLockIn} />
      </LockInPosition>
    </Container>
  );
}
