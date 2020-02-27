/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { ChampionInfo as SelectedChampionInfo } from '@csegames/library/lib/hordetest/graphql/schema';

const Container = styled.div`
  &:hover .abilities {
    margin-top: 0px;
    opacity:1;
  }
`;

const ChampionName = styled.div`
  font-family: Colus;
  color: white;
  text-transform: uppercase;
  font-size: 30px;
`;

const AbilitiesContainer = styled.div`
  width: 400px;
  opacity: 0;
  margin-top: -50px;
  padding: 20px;
  background: linear-gradient(to bottom right, rgba(0, 0, 0, 1), rgba(0, 0, 0, 0.7));
  transition: .4s all ease;
`;

const AbilityContainer = styled.div`
  display: flex;
  margin-bottom: 15px;
`;

const AbilityIcon = styled.div`
  font-size: 40px;
  color: white;
  margin-right: 13px;
  border: 1px solid rgba(255, 255, 255, 0.33);
  width: 40px;
  height: 40px;
  padding: 8px;
`;

const AbilityInfoContainer = styled.div`
`;

// const AbilityType = styled.div`
//   font-size: 15px;
//   color: #818080;
//   font-family: Lato;
//   font-weight: bold;
//   text-transform: uppercase;
// `;

const AbilityName = styled.div`
  font-family: Colus;
  font-size: 16px;
  color: white;
`;

const AbilityDescriptionButton = styled.div`
  display: block;
  border: 1px solid white;
  background: rgba(0, 0, 0, 0.5);
  font-family: Lato;
  font-size: 14px;
  color: white;
  width: 60px;
  padding: 5px;
  text-align: center;
  opacity: .5;
  margin-bottom: 25px;
`;

const AbilityDescription = styled.div`
  font-family: Lato;
  font-size: 14px;
  color: rgb(185, 185, 185);
  width: 320px;
`;

const KeyBindIcon = styled.span`
  font-family: exo;
  font-size: 16px;
  color: rgba(255, 255, 255, 1);
  position: absolute;
  margin: 50px 0 0 -5px;
  background: rgba(27, 27, 27, 1);
  display: block;
  padding: 2px 5px;
`;

export interface Props {
  selectedChampion: SelectedChampionInfo;
}

export function ChampionInfo(props: Props) {
  function getIconClass(index: number) {
    switch (index) {

      case 0: {
        // 1 ability
        return <KeyBindIcon>1</KeyBindIcon>;
      }

      case 1: {
        // 2 ability
        return <KeyBindIcon>2</KeyBindIcon>;
      }

      case 2: {
        // 3 ability
        return <KeyBindIcon>3</KeyBindIcon>;
      }

      default: {
        return null;
      }
    }
  }

  return (
    <Container>
      <ChampionName>{props.selectedChampion.name}</ChampionName>
      <AbilityDescriptionButton>Abilities</AbilityDescriptionButton>
      <AbilitiesContainer className='abilities'>
        {props.selectedChampion.abilities.slice(2, 5).map((ability, i) => {
          return (
            <AbilityContainer>
              <AbilityIcon className={ability.iconClass} />
              {getIconClass(i)}
              <AbilityInfoContainer>
                <AbilityName>{ability.name}</AbilityName>
                <AbilityDescription>{ability.description}</AbilityDescription>
              </AbilityInfoContainer>
            </AbilityContainer>
          );
        })}
      </AbilitiesContainer>
    </Container>
  );
}
