/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createDefaultOnUpdated, createDefaultOnReady, Updatable } from './_Updatable';

import engineInit from './_Init';

declare global {
  interface AbilityBarItem {
    id: number;
    keybind: number;
    boundKeyName: string;
  }

  interface AbilityBarStateModel {
    abilities: AbilityBarItem[];
  }

  type AbilityBarState = AbilityBarStateModel & Updatable;
  type ImmutableAbilityBarState = DeepImmutable<AbilityBarState>;
}

export const AbilityBarState_Update = 'abilityBarState.update';

function initDefault(): AbilityBarState {
  return {
    abilities: [],

    isReady: false,
    updateEventName: AbilityBarState_Update,
    onUpdated: createDefaultOnUpdated(AbilityBarState_Update),
    onReady: createDefaultOnReady(AbilityBarState_Update),
  };
}

/**
 * Initialize this model with the game engine.
 */
export default function() {

  engineInit(
    AbilityBarState_Update,
    initDefault,
    () => _devGame.abilityBarState,
    (model: AbilityBarState) => {
      _devGame.abilityBarState = model;
    });

}
