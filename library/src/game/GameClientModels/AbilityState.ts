/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { initUpdatable, Updatable, executeUpdateCallbacks } from './_Updatable';

declare global {
  interface AbilityStateModel {
    id: number;
    type: AbilityButtonType;
    track: AbilityTrack;
    keybind: number;
    boundKeyName: string;
    status: AbilityButtonState;
    error?: AbilityButtonErrorFlag;
    timing?: Timing;
    disruption?: Timing;
  }

  type AbilityState = AbilityStateModel & Updatable;
  type ImmutableAbilityState = DeepImmutableObject<AbilityState>;
}

export const AbilityState_Update = 'abilityState.update';

function onReceiveAbilityStateUpdate(state: AbilityState) {
  if (game.debug) console.log(`received abilityState.update with model | ${JSON.stringify(state)}`);

  if (!_devGame.abilityStates[state.id]) {
    _devGame.abilityStates[state.id] = state as AbilityState;
    _devGame.abilityStates[state.id].updateEventName = `${AbilityState_Update}_${state.id}`;
    // init Updatable.
    initUpdatable(state);
  }
  executeUpdateCallbacks(_devGame.abilityStates[state.id]);
}

export default function() {
  engine.on(AbilityState_Update, onReceiveAbilityStateUpdate);
}
