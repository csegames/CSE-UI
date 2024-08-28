/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ItemContainer } from '../ItemContainer';
import { Keybind } from '@csegames/library/dist/_baseGame/types/Keybind';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { toTitleCase } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { game } from '@csegames/library/dist/_baseGame';

const BindsContainer = 'Settings-Keybinds-KeybindRow-BindsContainer';

const Bind = 'Settings-Keybinds-KeybindRow-Bind';

export interface Props {
  keybind: Keybind;
  onStartBind: (keybind: Keybind, index: number) => void;
  onRemoveBind: (keybind: Keybind, index: number) => void;
}

export function KeybindRow(props: Props) {
  function onMouseEnter() {
    game.playGameSound(SoundEvents.PLAY_UI_MAINMENU_HOVER);
  }

  function onClick(e: React.MouseEvent, keybind: Keybind, index: number) {
    if (e.button === 0) {
      onStartBind(keybind, index);
    } else if (e.button === 2) {
      onRemoveBind(keybind, index);
    }
  }

  const { keybind, onStartBind, onRemoveBind } = props;
  return (
    <div className={ItemContainer} onMouseEnter={onMouseEnter}>
      <div>{toTitleCase(keybind.description)}</div>

      <div className={BindsContainer}>
        {keybind.binds.map((bind, i) => {
          const className = bind && bind.value ? 'assigned' : 'unassigned';
          if (bind.iconClass) {
            return (
              <div
                key={i}
                className={`${Bind} ${bind.iconClass} ${className}`}
                onMouseEnter={onMouseEnter}
                onMouseUp={(e) => onClick(e, keybind, i)}
              />
            );
          }

          return (
            <div
              key={i}
              className={`${Bind} ${className}`}
              onMouseEnter={onMouseEnter}
              onMouseUp={(e) => onClick(e, keybind, i)}
            >
              {bind.name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
