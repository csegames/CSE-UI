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
  width: 60px;
  height: 60px;
  background-color: rgba(0, 0, 0, 0.5);
  transform: skewX(-10deg);
`;

const ActionIcon = styled.span`
  font-size: 40px;
  color: #c9c5bc;
  transform: skewX(10deg);
`;

const KeybindBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 15px;
  width: 20px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.7);
`;

const KeybindText = styled.span`
  color: white;
  font-weight: bold;
  font-size: 15px;
`;

const CooldownOverlay = styled.div`
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left:0;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const CooldownText = styled.div`
  color: white;
  font-size: 25px;
  transform: skewX(10deg);
`;

export interface Props {
  actionIconClass: string;
  keybindText: string;
  keybindIconClass?: string;
  abilityID?: number;
  className?: string;
  cooldownTimer?: number;
}

export function ActionButton(props: Props) {
  return (
    <ActionButtonContainer className={props.className}>
      <Button>
        <ActionIcon className={props.actionIconClass} />
        {typeof props.cooldownTimer !== 'undefined' && props.cooldownTimer !== 0 &&
          <CooldownOverlay>
            <CooldownText>{props.cooldownTimer}</CooldownText>
          </CooldownOverlay>
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
