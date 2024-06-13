/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';
import { ItemContainer } from '../ItemContainer';
import { DropDown } from '../../../shared/DropDownField';
import { SelectOption, SelectValue } from '@csegames/library/dist/_baseGame/types/Options';
import { SoundEvents } from '@csegames/library/dist/hordetest/game/types/SoundEvents';
import { game } from '@csegames/library/dist/_baseGame';
import { toTitleCase } from '@csegames/library/dist/_baseGame/utils/textUtils';
import { cloneDeep } from '@csegames/library/dist/_baseGame/utils/objectUtils';

const ListBoxStyles = 'Settings-CategoryMenu-DropdownRow-ListBoxStyles';

export interface Props {
  option: SelectOption;
  onChange: (option: SelectOption) => void;
}

export function DropdownRow(props: Props) {
  function onSelect(selectValue: SelectValue) {
    const newOption: SelectOption = {
      ...cloneDeep(props.option),
      value: selectValue
    };

    props.onChange(newOption);
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CLICK);
  }

  function onMouseEnter() {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_HOVER);
  }

  return (
    <div className={ItemContainer} onMouseEnter={onMouseEnter}>
      <div>{toTitleCase(props.option.displayName)}</div>

      <DropDown
        items={Object.values(props.option.selectValues)}
        selected={props.option.value}
        onSelect={onSelect}
        renderItem={(optionItem) => <div>{optionItem.description}</div>}
        listBoxStyles={ListBoxStyles}
      />
    </div>
  );
}
