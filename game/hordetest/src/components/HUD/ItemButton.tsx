/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';

const ItemButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-left: 10px;
`;

const ItemIcon = styled.div`
  font-size: 35px;
  color: #c9c5bc;
`;

const KeybindBox = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 5px;
  width: 20px;
  height: 20px;
  background-color: rgba(0, 0, 0, 0.5);
`;

const KeybindText = styled.span`
  color: white;
  font-size: 15px;
  text-transform: uppercase;
`;

export interface Props {
  iconClass: string;
  keybindText: string;
  stackAmount?: number;
}

export function ItemButton(props: Props) {
  return (
    <ItemButtonContainer>
      <KeybindBox>
        <KeybindText>{props.keybindText}</KeybindText>
      </KeybindBox>
      <ItemIcon className={props.iconClass} />
    </ItemButtonContainer>
  );
}
