/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { Champion } from './index';

const Container = styled.div`

`;

const ChampionName = styled.div`
  font-family: Colus;
  color: white;
  text-transform: uppercase;
  font-size: 48px;
  margin-bottom: 25px;
`;

const AbilitiesContainer = styled.div`
  padding: 0 2px;
`;

const AbilityContainer = styled.div`
  display: flex;
  margin-bottom: 15px;
`;

const AbilityIcon = styled.div`
  font-size: 43px;
  color: white;
  margin-right: 13px;
`;

const AbilityInfoContainer = styled.div`
`;

const AbilityType = styled.div`
  font-size: 15px;
  color: #818080;
  font-family: Lato;
  font-weight: bold;
  text-transform: uppercase;
`;

const AbilityName = styled.div`
  font-family: Colus;
  font-size: 30px;
  color: white;
`;

export interface Props {
  selectedChampion: Champion;
}

export function ChampionInfo(props: Props) {
  return (
    <Container>
      <ChampionName>{props.selectedChampion.name}</ChampionName>
      <AbilitiesContainer>
        {props.selectedChampion.abilities.map((ability) => {
          return (
            <AbilityContainer>
              <AbilityIcon className={ability.iconClass} />
              <AbilityInfoContainer>
                <AbilityType>{ability.type}</AbilityType>
                <AbilityName>{ability.name}</AbilityName>
              </AbilityInfoContainer>
            </AbilityContainer>
          );
        })}
      </AbilitiesContainer>
    </Container>
  );
}
