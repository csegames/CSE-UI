/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React, { useContext } from 'react';
import { styled } from '@csegames/linaria/react';
import { ColossusProfileContext } from 'context/ColossusProfileContext';
import { ChampionInfoContext } from 'context/ChampionInfoContext';

const Container = styled.div`
  position: fixed;
  left: 25%;
  width: 75%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

const Section = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 75px;
  margin-right: -150%;

  &.attacks {
    animation: slideIn 0.3s forwards;
  }

  &.abilities {
    animation: slideIn 0.3s forwards;
    animation-delay: 0.1s;
  }

  @keyframes slideIn {
    from {
      margin-right: -150%;
    }
    to {
      margin-right: 0;
    }
  }
`;

const Title = styled.div`
  display: flex;
  align-items: center;
  font-family: Colus;
  font-size: 26px;
  color: white;
  margin-bottom: 15px;

  &:before {
    content: '';
    height: 2px;
    width: 200px;
    background: linear-gradient(to right, transparent, white, transparent);
    margin-right: 5px;
  }

  &:after {
    content: '';
    height: 2px;
    width: 200px;
    background: linear-gradient(to right, transparent, white, transparent);
    margin-left: 5px;
  }
`;

const ItemsContainer = styled.div`
  display: flex;
`;

const Item = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  color: white;
  margin: 0 15px;
  text-align: center;
  width: 175px;
`;

const KeybindBox = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-50%, -50%) skewX(10deg);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 17px;
  background-color: rgba(0, 0, 0, 0.7);
`;

const KeybindText = styled.span`
  color: white;
  font-family: Exo;
  font-weight: bold;
  font-size: 14px;
`;

const IconContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90px;
  height: 90px;
  border: 3px solid #666666;
  transform: skewX(-10deg) translateX(10%);
  margin-bottom: 10px;
`;

const Icon = styled.div`
  font-size: 62px;
  color: white;
  transform: skewX(10deg);
`;

const Name = styled.div`
  font-size: 18px;
  font-family: Lato;
  font-weight: bold;
  color: white;
  margin-bottom: 10px;
`;

const Description = styled.div`
  font-size: 14px;
  font-family: Lato;
  color: white;
`;

export interface Props {

}

export function AbilityInfo(props: Props) {
  const colossusProfileContext = useContext(ColossusProfileContext);
  const championInfoContext = useContext(ChampionInfoContext);

  function getKeybindInfo(ability: 'primary' | 'secondary' | 'weak' | 'strong' | 'ultimate') {
    switch (ability) {
      case 'primary': {
        return hordetest.game.abilityBarState.primaryAttack.binding;
      }
      case 'secondary': {
        return hordetest.game.abilityBarState.secondaryAttack.binding;
      }
      case 'weak': {
        return hordetest.game.abilityBarState.weak.binding;
      }
      case 'strong': {
        return hordetest.game.abilityBarState.strong.binding;
      }
      case 'ultimate': {
        return hordetest.game.abilityBarState.ultimate.binding;
      }

      default: return null;
    }
  }

  function getMyChampion() {
    if (!game.isConnectedToServer) {
      // Show default champion
      if (colossusProfileContext.colossusProfile && colossusProfileContext.colossusProfile.defaultChampion) {
        const championID = colossusProfileContext.colossusProfile.defaultChampion.championID;
        return championInfoContext.champions.find(c => c.id === championID);
      }

      // If we are not connected to game server and we don't have a default champion, just dont show anything.
      return null;
    } else {
      return hordetest.game.classes.find(c => c.id === hordetest.game.selfPlayerState.classID);
    }
  }

  const myChampion = getMyChampion();
  if (!myChampion) {
    return null;
  }

  return (
    <Container>
      <Section className='attacks'>
        <Title>ATTACKS</Title>
        <ItemsContainer>
          {myChampion.abilities.slice(0, 2).map((ability, i) => {
            const abilityType = i === 0 ? 'primary' : 'secondary';
            const keybindInfo = getKeybindInfo(abilityType);
            return (
              <Item>
                <IconContainer>
                  <KeybindBox>
                    {keybindInfo.iconClass ?
                      <KeybindText className={keybindInfo.iconClass}></KeybindText> :
                      <KeybindText>{keybindInfo.name}</KeybindText>
                    }
                  </KeybindBox>
                  <Icon className={ability.iconClass} />
                </IconContainer>
                <Name>{ability.name}</Name>
                <Description>{ability.description}</Description>
              </Item>
            );
          })}
        </ItemsContainer>
      </Section>
      <Section className='abilities'>
        <Title>ABILITIES</Title>
        <ItemsContainer>
          {myChampion.abilities.slice(2, 5).map((ability, i) => {
            const abilityType = i === 0 ? 'weak' :
              i === 1 ? 'strong' :
              'ultimate';
            const keybindInfo = getKeybindInfo(abilityType);
            return (
              <Item>
                <IconContainer>
                  <KeybindBox>
                    {keybindInfo.iconClass ?
                      <KeybindText className={keybindInfo.iconClass}></KeybindText> :
                      <KeybindText>{keybindInfo.name}</KeybindText>
                    }
                  </KeybindBox>
                  <Icon className={ability.iconClass} />
                </IconContainer>
                <Name>{ability.name}</Name>
                <Description>{ability.description}</Description>
              </Item>
            );
          })}
        </ItemsContainer>
      </Section>
    </Container>
  );
}
