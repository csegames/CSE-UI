/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { styled } from '@csegames/linaria/react';
import { ItemContainer } from '../ItemContainer';

const BindsContainer = styled.div`
  display: flex;
`;

const Bind = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  height: fit-content;
  box-sizing: border-box!important;
  background-color: rgb(7,7,7);
  background: radial-gradient(ellipse at center, rgba(12,12,12,1) 0%,rgba(7,7,7,1) 100%);
  text-align: center;
  padding: 0 12px;
  margin: 2px 5px;
  cursor: pointer;
  min-height: 35px;
  min-width: 100px;
  filter: brightness(100%);
  transition: filter 0.2s;

  &:hover {
    filter: brightness(150%);
  }

  &.unassigned {
    color: rgb(32,32,32);
  }
`;

export interface Props {
  keybind: Keybind;
  onStartBind: (keybind: Keybind, index: number) => void;
}

export function KeybindRow(props: Props) {
  function onMouseEnter() {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_HOVER);
  }

  const { keybind, onStartBind } = props;
  return (
    <ItemContainer onMouseEnter={onMouseEnter}>
      <div>{keybind.description.toTitleCase()}</div>

      <BindsContainer>
        {keybind.binds.map((bind, i) => {
          const className = bind && bind.value ? 'assigned' : 'unassigned';
          if (bind.iconClass) {
            return (
              <Bind className={`${bind.iconClass} ${className}`} onMouseEnter={onMouseEnter} onClick={() => onStartBind(keybind, i)}></Bind>
            );
          }

          return (
            <Bind className={className} onMouseEnter={onMouseEnter} onClick={() => onStartBind(keybind, i)}>{bind.name}</Bind>
          );
        })}
      </BindsContainer>
    </ItemContainer>
  );
}
