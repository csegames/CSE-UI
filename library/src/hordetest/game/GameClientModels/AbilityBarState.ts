/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { createDefaultOnUpdated, createDefaultOnReady, Updatable } from '../../../_baseGame/GameClientModels/_Updatable';

import engineInit from '../../../_baseGame/GameClientModels/_Init';

declare global {
  interface AbilityBarItem {
    id: number;
    keyActionID: number;
    boundKeyName: string;
    status: AbilityButtonState;
    type: AbilityButtonType;
    track: AbilityTrack;
    error: string;
    timing: Timing;
    disruption: CurrentMax;
    binding: Binding;
  }

  interface AbilityBarStateModel {
    abilities: ArrayMap<AbilityBarItem>;
    primaryAttack: AbilityBarItem;
    secondaryAttack: AbilityBarItem;
    weak: AbilityBarItem;
    strong: AbilityBarItem;
    ultimate: AbilityBarItem;
  }

  type AbilityBarState = AbilityBarStateModel & Updatable;
  type ImmutableAbilityBarState = DeepImmutable<AbilityBarState>;
}

export const AbilityBarState_Update = 'abilityBarState.update';

function initDefault(): AbilityBarState {
  return {
    abilities: {},
    primaryAttack: null,
    secondaryAttack: null,
    weak: null,
    strong: null,
    ultimate: null,

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
    () => hordetest._devGame.abilityBarState,
    (model: AbilityBarState) => {
      hordetest._devGame.abilityBarState = model;
    });

}