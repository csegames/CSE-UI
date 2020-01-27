/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { ChampionInfo } from '@csegames/library/lib/hordetest/graphql/schema';

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
  font-size: 48px;
`;

const AbilitiesContainer = styled.div`
  width: 320px;
  opacity: 0;
  margin-top: -50px;
  padding: 15px;
  background: linear-gradient(rgba(0, 0, 0, 1), transparent);
  transition: .5s all ease;
`;

const AbilityContainer = styled.div`
  display: flex;
  margin-bottom: 15px;
`;

const AbilityIcon = styled.div`
  font-size: 43px;
  color: white;
  margin-right: 13px;
  border: 1px solid rgba(255, 255, 255, 0.33);
  width: 45px;
  height: 45px;
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
  font-size: 18px;
  color: white;
`;

const AbilityDescriptionButton = styled.div`
  display: block;
  border: 2px solid white; 
  font-family: Lato;
  font-size: 14px;
  color: white;
  width: 130px;
  padding: 5px;
  text-align: center;
  opacity: .5;
  margin-bottom: 25px;
`;

const AbilityDescription = styled.div`
  font-family: Lato;
  font-size: 14px;
  color: rgb(185, 185, 185);
  width: 250px;
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
  selectedChampion: ChampionInfo;
}

export function ChampionInfo(props: Props) {
  function getIconClass(index: number) {
    switch (index) {
      case 0: {
        // left click icon
        return <KeyBindIcon className={'icon-mouse1'}></KeyBindIcon>
      }

      case 1: {
        // right click icon
        return <KeyBindIcon className={'icon-mouse2'}></KeyBindIcon>
      }

      case 2: {
        // 1 ability
        return <KeyBindIcon>1</KeyBindIcon>;
      }

      case 3: {
        // 2 ability
        return <KeyBindIcon>2</KeyBindIcon>;
      }

      case 4: {
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
      <AbilityDescriptionButton>Attacks & Abilities</AbilityDescriptionButton>
      <AbilitiesContainer className='abilities'>
        {props.selectedChampion.abilities.map((ability, i) => {
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
