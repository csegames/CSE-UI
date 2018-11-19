/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
  initUpdatable,
  Updatable,
  executeUpdateCallbacks,
  createDefaultOnReady,
  createDefaultOnUpdated,
} from './_Updatable';

declare global {
  interface AbilityStateModel {
    id: number;
    type: AbilityButtonType;
    track: AbilityTrack;
    keyActionID: number;
    boundKeyName: string;
    status: AbilityButtonState;
    error?: AbilityButtonErrorFlag;
    timing?: Timing;
    disruption?: CurrentMax;
  }

  type AbilityState = AbilityStateModel & Updatable;
  type ImmutableAbilityState = DeepImmutableObject<AbilityState>;
}

export const AbilityState_Update = 'abilityState.update';

const initDefaults = (eventName: string): AbilityState => {
  return {
    id: -1,
    type: AbilityButtonType.Standard,
    track: AbilityTrack.None,
    keyActionID: -1,
    boundKeyName: '',
    status: AbilityButtonState.None,
    isReady: true,
    onUpdated: createDefaultOnUpdated(eventName),
    onReady: createDefaultOnReady(eventName),
    updateEventName: eventName,
  };
};

function onReceiveAbilityStateUpdate(state: AbilityState) {
  if (game.debug) {
    console.groupCollapsed(`Client > ${AbilityState_Update}`);
    try {
      console.log(JSON.stringify(state));
    } catch {}
    console.groupEnd();
  }

  const eventName = `${AbilityState_Update}_${state.id}`;
  if (!_devGame.abilityStates[state.id]) {
    _devGame.abilityStates[state.id] = withDefaults(state, initDefaults(eventName), false);
    // init Updatable.
    initUpdatable(_devGame.abilityStates[state.id]);
  } else {
    _devGame.abilityStates[state.id] = withDefaults(state, initDefaults(eventName), false);
  }

  executeUpdateCallbacks(_devGame.abilityStates[state.id]);
}

export default function() {
  engine.on(AbilityState_Update, onReceiveAbilityStateUpdate);
}
