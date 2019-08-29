/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const WeaponButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  transform: scale(0.7);

  &.selected {
    transform: scale(1);
  }
`;

const Button = styled.div`
  position: relative;
  width: 70px;
  height: 70px;
`;

const WeaponIcon = styled.span`
  font-size: 70px;
  color: #e5e3df;
`;

const WeaponLevel = styled.div`
  position: absolute;
  color: white;
  font-size: 18px;
  font-weight: bold;
  left: 0;
  bottom: 0;
`;

const KeybindBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 5px;
  width: 20px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.7);
`;

const KeybindIcon = styled.span`
  color: white;
  font-size: 15px;
`;

export interface Props {
  selected: boolean;
  weaponIconClass: string;
  keybindIconClass: string;
  weaponLevel: number;
}

export function WeaponButton(props: Props) {
  const selectedClass = props.selected ? 'selected' : '';
  return (
    <WeaponButtonContainer className={selectedClass}>
      <Button>
        <WeaponIcon className={`${selectedClass} ${props.weaponIconClass}`} />
        <WeaponLevel>{props.weaponLevel}</WeaponLevel>
      </Button>

      {props.selected &&
        <KeybindBox>
          <KeybindIcon className={props.keybindIconClass} />
        </KeybindBox>
      }
    </WeaponButtonContainer>
  );
}
