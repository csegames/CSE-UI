/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { Champions } from '../../context/ChampionInfoContext';

const ActionButtonContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: Colus;
`;

const Button = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 75px;
  height: 75px;
  background-color: rgba(0, 0, 0, 0.5);
  transform: skewX(-10deg);

  &.disabled {
    box-shadow: inset 0 0 0 5px #AF000D;
  }

  &.activeAnim {
  }

  &.knight {
    background-color: rgba(248, 193, 5, 0.85);
  }

  &.berserker {
    background-color: rgba(5, 200, 248, 0.85);
  }

  &.amazon {
    background-color: rgba(243, 94, 5, 0.85);
  }

  &.celt {
    background-color: rgba(5, 233, 171, 0.85);
  }

  &.cooldown {
    background-color: rgba(0, 0, 0, 0.7);
  }
`;

const ActionIcon = styled.span`
  font-size: 60px;
  color: white;
  transform: skewX(10deg);

  &.disabled {
    opacity: 0.8;
  }

  &.cooldown {
    color: #777e84;
  }
`;

const KeybindBox = styled.div`
  position: absolute;
  bottom: 0;
  left: -5px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 17px;
  transform: skewX(-10deg);
  background-color: rgba(0, 0, 0, 0.7);
`;

const KeybindText = styled.span`
  color: white;
  font-family: Exo;
  font-weight: bold;
  font-size: 14px;
`;

const CooldownContainer = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left:0;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CooldownOverlay = styled.div`
  position: absolute;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
`;

const CooldownText = styled.div`
  font-family: Colus;
  color: white;
  font-size: 30px;
  transform: skewX(10deg);
  -webkit-text-stroke-width: 8px;
  -webkit-text-stroke-color: black;
`;

const DisabledSlash = styled.img`
  position: absolute;
  top: -20%;
  right: 0;
  left: -20%;
  bottom: 0;
  width: 140%;
  height: 140%;
  object-fit: contain;
  transform: rotate(-5deg)
`;

export interface Props {
  actionIconClass: string;
  keybindText: string;
  keybindIconClass?: string;
  abilityID?: number;
  className?: string;
  cooldownTimer?: CurrentMax & { progress: number };
  showActiveAnim?: boolean;
  disabled?: boolean;
}

export function ActionButton(props: Props) {
  function isOnCooldown() {
    return typeof props.cooldownTimer !== 'undefined' && props.cooldownTimer.current !== 0;
  }

  function getMyChampion() {
    const myChampion = hordetest.game.classes.find(c => c.id === hordetest.game.selfPlayerState.classID);
    if (!myChampion) return null;

    return myChampion as CharacterClassDef;
  }

  function getChampionClass() {
    const myChampion = getMyChampion();
    if (!myChampion) return '';

    switch (myChampion.id) {
      case Champions.Knight: {
        return 'knight';
      }
      case Champions.Berserker: {
        return 'berserker'
      }
      case Champions.Celt: {
        return 'celt';
      }
      case Champions.Amazon: {
        return 'amazon';
      }
      default: '';
    }
  }

  const { cooldownTimer } = props;
  const onCooldown = isOnCooldown();
  const cooldownClass = onCooldown ? 'cooldown' : '';
  const disabledClass = props.disabled ? 'disabled' : '';
  const activeAnimClass = props.showActiveAnim && !props.disabled ? 'activeAnim' : '';
  return (
    <ActionButtonContainer className={props.className}>
      <Button className={`${disabledClass} ${activeAnimClass} ${getChampionClass()} ${cooldownClass}`}>
        <ActionIcon className={`${props.actionIconClass} ${disabledClass} ${cooldownClass}`} />
        {onCooldown &&
          <CooldownContainer>
            <CooldownOverlay
              style={{ height: `${cooldownTimer.progress}%`}}
            />
            <CooldownText>{cooldownTimer.current}</CooldownText>
          </CooldownContainer>
        }
        {props.disabled && <DisabledSlash src='images/hud/disabled.svg' />}
      </Button>
      <KeybindBox>
        {props.keybindIconClass ?
          <KeybindText className={props.keybindIconClass}></KeybindText> :
          <KeybindText>{props.keybindText}</KeybindText>
        }
      </KeybindBox>
    </ActionButtonContainer>
  );
}
