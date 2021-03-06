/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';
import { Champion } from './index';
import { ColossusProfileContext } from 'context/ColossusProfileContext';
// import { EditingMode } from '.';

const Container = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  top: 20px;
`;

const ChampionContainer = styled.div`
  position: relative;
  border: 2px solid #494949;
  outline: 1px solid rgba(196, 253, 255, 0.6);
  outline-offset: -4px;
  width: 90px;
  height: 90px;
  cursor: pointer;
  margin: 0 7px;
  background-color: rgba(0, 0, 0, 0.9);
  transition: border-color 0.2s;

  &:after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: linear-gradient(to top, rgba(127, 207, 255, 0.55), transparent);
    transition: opacity 0.2s, visibility 0.2s;
    opacity: 0;
    visibility: hidden;
  }

  &:hover {
    filter: brightness(120%);
    &:after {
      opacity: 1;
      visibility: visible;
    }
  }

  &.selected {
    border-color: #7fcfff;
    &:after {
      opacity: 1;
      visibility: visible;
    }
  }

  opacity: 0;
  margin-top: -5%;
  animation: slideIn 0.5s forwards ;

  @keyframes slideIn {
    from {
      opacity: 0;
      margin-top: -5%;
    }
    to {
      opacity: 1;
      margin-top: 0;
    }
  }
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
`;

const StarIcon = styled.span`
  position: absolute;
  font-size: 16px;
  top: -8px;
  right: 35px;
  color: #fff;
  text-shadow: 0px 0px 10px rgb(56, 158, 255);
`;

export interface Props {
  champions: Champion[];
  selectedChampion: Champion;
  onSelectChampion: (champion: Champion) => void;
}

export function ChampionSelect(props: Props) {
  const colossusProfileContext = useContext(ColossusProfileContext);

  function onChampionClick(champion: Champion) {
    props.onSelectChampion(champion);

    switch(champion.name.toLowerCase()) {
      case 'gwenllian': {
        game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_TAB_CHAMPION_CELT);
        break;
      }
      case 'aella': {
        game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_TAB_CHAMPION_AMAZON);
        break;
      }
      case 'bjorn-snur': {
        game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_TAB_CHAMPION_BERSERKER);
        break;
      }
      case 'jalb al-sulh': {
        game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_TAB_CHAMPION_KNIGHT);
        break;
      }
      default: {
        game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CLICK);
        break;
      }
    }
  }

  function onMouseEnter() {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_HOVER);
  }

  const defaultChampion = colossusProfileContext.colossusProfile.defaultChampion;
  return (
    <Container>
      {props.champions.map((champion) => {
        const selectedClassName = champion.id === props.selectedChampion.id ? 'selected' : '';
        return (
          <ChampionContainer className={selectedClassName} onClick={() => onChampionClick(champion)} onMouseEnter={onMouseEnter}>
            <Image src={champion.costumes[0].thumbnailURL} />
            {defaultChampion && defaultChampion.championID === champion.id ? <StarIcon className='fas fa-star' /> : null}
          </ChampionContainer>
        );
      })}
    </Container>
  );
}
