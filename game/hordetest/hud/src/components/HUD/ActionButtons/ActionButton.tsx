/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

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
  width: 55px;
  height: 55px;
  background-color: rgba(0, 0, 0, 0.5);
  transform: skewX(-10deg);

  &.activeAnim {
    background: linear-gradient( to bottom left, #F37326 , #FCCA21);
    animation-name: glow;
    animation-duration: .8s;
    animation-timing-function: ease-in-out;
    animation-delay: 0;
    animation-direction: alternate;
    animation-iteration-count: infinite;
    animation-fill-mode: none;
    animation-play-state: running;

    @keyframes glow {
      0% {
        filter:brightness(130%);
      }
    }
  }
`;

const ActionIcon = styled.span`
  font-size: 40px;
  color: white;
  transform: skewX(10deg);

  &.cooldown {
    color: #777e84;
  }
`;

const KeybindBox = styled.div`
  position: absolute;
  bottom: -8px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 25px;
  height: 17px;
  background-color: rgba(0, 0, 0, 0.7);
`;

const KeybindText = styled.span`
  color: white;
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

const Spark = styled.div`
  position: absolute;
  color: orange;
  margin-top: -50px;
  font-size: 15px;
  animation-name: spark;
  animation-duration: 1s;
  animation-timing-function: ease-out;
  animation-delay: 0;
  animation-direction: normal;
  animation-iteration-count: infinite;
  animation-fill-mode: none;
  animation-play-state: running;

  @keyframes spark {
    0% {
      transform: scale(0.5);
      opacity: 0.2;
      margin-top: 0px;
      margin-left: 0px;
    }
    70% {
      transform: scale(1);
      opacity: 0.8;
      color: #FBB03B;
    }
    100% {
      transform: scale(0.8);
      opacity: 0.2;
    }
  }

  &.s2 {
    left: 45%;
    font-size: 20px;
    animation-duration: .8s;
  }

  &.s3 {
    left: 15%;
    font-size: 15px;
    animation-duration: .6s;
  }

  &.s4 {
    left: 45%;
    font-size: 10px;
    animation-duration: 1.3s;
    color: #F37326;
  }

  &.s5 {
    padding-left: 5px;
    font-size: 10px;
    animation-duration: 2s;
    color :#F37326;
  }
`;

export interface Props {
  actionIconClass: string;
  keybindText: string;
  keybindIconClass?: string;
  abilityID?: number;
  className?: string;
  cooldownTimer?: CurrentMax & { progress: number };
  showActiveAnim?: boolean;
}

export function ActionButton(props: Props) {
  function isOnCooldown() {
    return typeof props.cooldownTimer !== 'undefined' && props.cooldownTimer.current !== 0;
  }

  const { cooldownTimer } = props;
  const onCooldown = isOnCooldown();
  return (
    <ActionButtonContainer className={props.className}>
      <Button className={props.showActiveAnim ? 'activeAnim' : ''}>
        <ActionIcon className={`${props.actionIconClass} ${onCooldown ? 'cooldown' : ''}`} />
        {onCooldown &&
          <CooldownContainer>
            <CooldownOverlay
              style={{ height: `${cooldownTimer.progress}%`}}
            />
            <CooldownText>{cooldownTimer.current}</CooldownText>
          </CooldownContainer>
        }
        {props.showActiveAnim &&
          <>
            <Spark>♦ </Spark>
            <Spark className='s2'>♦ </Spark>
            <Spark className='s3'>♦ </Spark>
            <Spark className='s4'>♦ </Spark>
            <Spark className='s5'>♦ </Spark>
          </>
        }
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
