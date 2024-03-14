/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as React from 'react';

const WeaponButtonContainer = 'WeaponButton-WeaponButtonContainer';
const Button = 'WeaponButton-Button';
const WeaponIcon = 'WeaponButton-WeaponIcon';
const WeaponLevel = 'WeaponButton-WeaponLevel';
const KeybindBox = 'WeaponButton-KeybindBox';

const KeybindIcon = 'WeaponButton-KeybindIcon';

export interface Props {
  selected: boolean;
  weaponIconClass: string;
  keybindIconClass: string;
  weaponLevel: number;
}

export function WeaponButton(props: Props) {
  const selectedClass = props.selected ? 'selected' : '';
  return (
    <div className={`${WeaponButtonContainer} ${selectedClass}`}>
      <div className={Button}>
        <span className={`${WeaponIcon} ${selectedClass} ${props.weaponIconClass}`} />
        <div className={WeaponLevel}>{props.weaponLevel}</div>
      </div>

      {props.selected && (
        <div className={KeybindBox}>
          <span className={`${KeybindIcon} ${props.keybindIconClass}`} />
        </div>
      )}
    </div>
  );
}
