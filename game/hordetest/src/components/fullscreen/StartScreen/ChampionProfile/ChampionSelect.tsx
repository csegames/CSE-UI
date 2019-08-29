/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import { styled } from '@csegames/linaria/react';
// import { EditingMode } from '.';
import { ChampionInfo } from './testData';

const Container = styled.div`
  position: relative;
`;

const SelectedChampionContainer = styled.div`
  padding: 5px;
  background-image: url(../images/fullscreen/startscreen/champion-profile/character-border.png);
  background-size: 100% 100%;
`;

const ChampionPreviewItem = styled.div`
  position: relative;
  height: 120px;
  width: 350px;
  border: 2px solid #373434;
  background-color: rgba(0, 0, 0, 0.9);
  background-size: cover;
  cursor: pointer;

  &.spacing {
    margin-bottom: 5px;
  }

  &:before {
    content: 'Change';
    position: absolute;
    height: 100%;
    width: 100%;
    background: linear-gradient(to top, rgba(102, 185, 252, 0.7), transparent);
    opacity: 0;
    transition: border 0.2s, opacity 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    font-size: 24px;
  }

  &.disable-change-text:before {
    content: '';
  }

  &:active:before {
    background: linear-gradient(to top, rgba(56, 105, 144, 0.7), transparent);
  }

  &:hover {
    border: 2px solid #66b9fc;
    &:before {
      opacity: 1;
    }
  }
`;

const BGImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ChampionName = styled.div`
  position: absolute;
  font-family: Colus;
  font-size: 18px;
  color: white;
  bottom: 5px;
  left: 5px;
`;

const DropdownContainer = styled.div`
  position: absolute;
  z-index: 1;
  background: linear-gradient(to bottom, black, transparent);
  padding: 5px;
`;

const CheckIcon = styled.span`
  position: absolute;
  top: 5px;
  right: 5px;
  font-size: 12px;
  color: #40ff00;
`;

export interface Props {
  champions: ChampionInfo[];
  selectedChampion: ChampionInfo;
  onSelectChampion: (champion: ChampionInfo) => void;
}

export function ChampionSelect(props: Props) {
  const [isOpen, setIsOpen] = useState(false);

  function onPreviewClick() {
    setIsOpen(!isOpen);
  }

  function onSelectChampion(champion: ChampionInfo) {
    setIsOpen(false);
    props.onSelectChampion(champion);
  }

  const disableChangeTextClass = isOpen ? 'disable-change-text' : '';
  return (
    <Container>
      <SelectedChampionContainer>
        <ChampionPreviewItem className={disableChangeTextClass} onClick={onPreviewClick}>
          <BGImage src={props.selectedChampion.previewImage} />
        </ChampionPreviewItem>
      </SelectedChampionContainer>
      {isOpen &&
        <DropdownContainer>
          {props.champions.map((champion) => {
            return (
              <ChampionPreviewItem
                className={`spacing ${disableChangeTextClass}`}
                onClick={() => onSelectChampion(champion)}>
                <BGImage src={champion.previewImage} />
                <ChampionName>{champion.name}</ChampionName>
                {champion.id === props.selectedChampion.id && <CheckIcon className='far fa-check' />}
              </ChampionPreviewItem>
            );
          })}
        </DropdownContainer>
      }
    </Container>
  );
}
