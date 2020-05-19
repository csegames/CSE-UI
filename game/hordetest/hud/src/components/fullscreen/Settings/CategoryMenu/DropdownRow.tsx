/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import React from 'react';
import { css } from '@csegames/linaria';
import { ItemContainer } from '../ItemContainer';
import { DropDown } from 'cseshared/components/DropDownField';

const ListBoxStyles = css`
  padding: 0 5px;
`;

export interface Props {
  option: SelectOption;
  onChange: (option: SelectOption) => void;
}

export function DropdownRow(props: Props) {
  function onSelect(selectValue: SelectValue) {
    const newOption: SelectOption = {
      ...cloneDeep(props.option),
      value: selectValue,
    };

    props.onChange(newOption);
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_CLICK);
  }

  function onMouseEnter() {
    game.playGameSound(SoundEvents.PLAY_UI_MAIN_MENU_HOVER);
  }

  return (
    <ItemContainer onMouseEnter={onMouseEnter}>
      <div>{props.option.displayName.toTitleCase()}</div>

      <DropDown
        items={Object.values(props.option.selectValues)}
        selected={props.option.value}
        onSelect={onSelect}
        renderItem={optionItem => <div>{optionItem.description}</div>}
        listBoxStyles={ListBoxStyles}
      />
    </ItemContainer>
  );
}
