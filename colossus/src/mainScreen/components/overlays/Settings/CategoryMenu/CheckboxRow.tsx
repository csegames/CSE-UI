/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ItemContainer } from '../ItemContainer';
import { BooleanOption } from '@csegames/library/dist/_baseGame/types/Options';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { toTitleCase } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { cloneDeep } from '@csegames/library/dist/_baseGame/utils/objectUtils';

const ItemContainerStyles = 'Settings-CategoryMenu-CheckboxRow-ItemContainerStyles';

const Checkbox = 'Settings-CategoryMenu-CheckboxRow-Checkbox';

export interface Props {
  option: BooleanOption;
  onChange: (option: BooleanOption) => any;
}

export function CheckboxRow(props: Props) {
  function onClick() {
    const newOption = cloneDeep(props.option);
    newOption.value = !newOption.value;
    props.onChange(newOption);
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CLICK);
  }

  function onMouseEnter() {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_HOVER);
  }

  const checkboxClassName = props.option.value === true ? 'on' : 'off';
  return (
    <div className={`${ItemContainer} ${ItemContainerStyles}`} onClick={onClick} onMouseEnter={onMouseEnter}>
      <div>{toTitleCase(props.option.displayName)}</div>
      <div className={`${Checkbox} checkbox ${checkboxClassName}`} />
    </div>
  );
}
