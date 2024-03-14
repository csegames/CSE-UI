/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ItemContainer } from '../ItemContainer';
import { IntRangeOption } from '@csegames/library/dist/_baseGame/types/Options';
import { game } from '@csegames/library/dist/_baseGame';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { toTitleCase } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { cloneDeep } from '@csegames/library/dist/_baseGame/utils/objectUtils';

const SliderContainer = 'Settings-CategoryMenu-SliderRow-SliderContainer';
const Slider = 'Settings-CategoryMenu-SliderRow-Slider';

const Value = 'Settings-CategoryMenu-SliderRow-Value';

export interface Props {
  option: IntRangeOption;
  onChange: (option: IntRangeOption) => void;
}

export function SliderRow(props: Props) {
  function onChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newOption = cloneDeep(props.option);
    newOption.value = Number(e.target.value);
    props.onChange(newOption);
  }

  function onMouseEnter() {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_HOVER);
  }

  return (
    <div className={ItemContainer} onMouseEnter={onMouseEnter}>
      <div>{toTitleCase(props.option.displayName)}</div>

      <div className={SliderContainer}>
        <input
          className={Slider}
          type="range"
          value={props.option.value}
          min={props.option.minValue}
          max={props.option.maxValue}
          onChange={onChange}
        />
        <div className={Value}>{props.option.value}</div>
      </div>
    </div>
  );
}
