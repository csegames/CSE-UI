/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useState } from 'react';
import { css } from '@csegames/linaria';
import { styled } from '@csegames/linaria/react';
import { Button } from '../../Button';
import { ChampionPick } from '../../ChampionSelect/ChampionPick';
import { Champion } from '../../ChampionSelect';
import { ChampionPreview } from './ChampionPreview';

import { champions } from './testData';

const Container = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
`;

const SaveButtonPosition = styled.div`
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 70px;
`;

const ChampionsContainer = styled.div`
  display: flex;
  justify-content: center;
`;

const SaveButton = css`
  padding: 25px 70px;
  font-size: 35px;
`;

export interface Props {
  onSaveClick: () => void;
}

export interface ChampionInfo extends Champion {
  abilities: { type: 'light' | 'heavy' | 'ultimate', name: string, description: string, iconClass: string }[];
}

export function ChampionProfile(props: Props) {
  const [selectedChampion, setSelectedChampion] = useState(champions[0]);

  function onSelectChampion(championID: string) {
    const champion = champions.find(c => c.id === championID);
    setSelectedChampion(champion);
  }

  return (
    <Container>
      <ChampionsContainer>
        {champions.map((champion) => {
          return (
            <ChampionPick
              key={champion.id}
              isSelected={selectedChampion.id === champion.id}
              id={champion.id}
              image={champion.image}
              onClick={onSelectChampion}
            />
          );
        })}
      </ChampionsContainer>
      <ChampionPreview selectedChampion={selectedChampion} />
      <SaveButtonPosition>
        <Button styles={SaveButton} type='primary' text={'Save'} onClick={props.onSaveClick} />
      </SaveButtonPosition>
    </Container>
  );
}
