/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { ChampionInfo } from './testData';
import { ActionButton } from '../../ActionButton';

const Container = styled.div`
  width: 65%;
  height: 100%;
  display: flex;
  align-self: center;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  align-self: center;
`;

const Title = styled.div`
  font-family: Colus;
  font-size: 23px;
  color: #4c4c4c;
  width: 100%;
  margin-bottom: 25px;
  border-width: 0;
  border-bottom-width: 2px;
  border-image: url(../images/fullscreen/underline-border.png);
  border-image-slice: 2;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ListItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 30px;
`;

const IconContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 20px;
`;

const Icon = styled.div`
  font-size: 70px;
  color: #c1c1c1;
`;

const Keybind = styled.div`
  margin-top: 10px;
  font-size: 12px;
  line-height: 12px;
  background-color: black;
  width: 18px;
  height: 18px;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const AbilityType = styled.div`
  font-size: 12px;
  font-family: Lato;
  font-weight: bold;
  color: #565656;
  margin-top: 5px;
`;

const AbilityName = styled.div`
  font-size: 24px;
  font-family: Colus;
  color: #c1c1c1;
`;

const AbilityDescription = styled.div`
  font-size: 12px;
  font-family: Lato;
  font-weight: bold;
  color: #8c8c8c;
`;

const ButtonPosition = styled.div`
  position: absolute;
  bottom: 40px;
  right: 40px;
`;

export interface Props {
  selectedChampion: ChampionInfo;
}

export function SkillInfo(props: Props) {
  function onHideClick() {
    game.trigger('hide-right-modal');
  }

  return (
    <Container>
      <Title>Skills</Title>
      <ListContainer>
        {props.selectedChampion.abilities.map((ability) => {
          return (
            <ListItem>
              <IconContainer>
                <Icon className={ability.iconClass} />
                <Keybind>{ability.keybind}</Keybind>
              </IconContainer>
              <InfoContainer>
                <AbilityType>{ability.type.toUpperCase()}</AbilityType>
                <AbilityName>{ability.name}</AbilityName>
                <AbilityDescription>{ability.description}</AbilityDescription>
              </InfoContainer>
            </ListItem>
          );
        })}
      </ListContainer>
      <ButtonPosition>
        <ActionButton onClick={onHideClick}>Hide Skills</ActionButton>
      </ButtonPosition>
    </Container>
  );
}
