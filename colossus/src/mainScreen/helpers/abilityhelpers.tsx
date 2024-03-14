/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { game } from '@csegames/library/dist/_baseGame';

export enum AbilityType {
  Primary = 'Primary',
  Secondary = 'Secondary',
  Weak = 'Weak',
  Strong = 'Strong',
  Ultimate = 'Ultimate'
}

export function getKeybindInfoForAbility(abilityType: AbilityType, usingGamepad: boolean) {
  const bindIndex = usingGamepad ? 1 : 0;

  switch (abilityType) {
    case AbilityType.Primary: {
      const keybind = Object.values(game.keybinds).find((k) => k.description === 'Primary attack');
      if (!keybind) {
        return null;
      }

      return keybind.binds[bindIndex];
    }
    case AbilityType.Secondary: {
      const keybind = Object.values(game.keybinds).find((k) => k.description === 'Secondary attack');
      if (!keybind) {
        return null;
      }

      return keybind.binds[bindIndex];
    }
    case AbilityType.Weak: {
      const keybind = Object.values(game.keybinds).find((k) => k.description === 'Ability 1 (weak)');
      if (!keybind) {
        return null;
      }

      return keybind.binds[bindIndex];
    }
    case AbilityType.Strong: {
      const keybind = Object.values(game.keybinds).find((k) => k.description === 'Ability 2 (strong)');
      if (!keybind) {
        return null;
      }

      return keybind.binds[bindIndex];
    }
    case AbilityType.Ultimate: {
      const keybind = Object.values(game.keybinds).find((k) => k.description === 'Ability 3 (ultimate)');
      if (!keybind) {
        return null;
      }

      return keybind.binds[bindIndex];
    }

    default:
      return null;
  }
}
