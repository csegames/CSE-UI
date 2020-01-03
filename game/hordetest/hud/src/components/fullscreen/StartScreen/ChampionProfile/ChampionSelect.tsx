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
  border: 5px solid #494949;
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
`;

const Image = styled.img`
  width: 100%;
  height: 100%;
`;

const StarIcon = styled.span`
  position: absolute;
  font-size: 18px;
  top: 5px;
  right: 5px;
  color: #ffc400;
`;

export interface Props {
  champions: Champion[];
  selectedChampion: Champion;
  onSelectChampion: (champion: Champion) => void;
}

export function ChampionSelect(props: Props) {
  const colossusProfileContext = useContext(ColossusProfileContext);

  const defaultChampion = colossusProfileContext.colossusProfile.defaultChampion;
  return (
    <Container>
      {props.champions.map((champion) => {
        const selectedClassName = champion.id === props.selectedChampion.id ? 'selected' : '';
        return (
          <ChampionContainer className={selectedClassName} onClick={() => props.onSelectChampion(champion)}>
            <Image src={champion.costumes[0].thumbnailURL} />
            {defaultChampion && defaultChampion.championID === champion.id ? <StarIcon className='fas fa-star' /> : null}
          </ChampionContainer>
        );
      })}
    </Container>
  );
}
