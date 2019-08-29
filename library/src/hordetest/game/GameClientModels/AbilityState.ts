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
} from '../../../_baseGame/GameClientModels/_Updatable';

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

  type AbilityState = AbilityStateModel & Updatable & { onActivated: (callback: Callback) => EventHandle };
  type ImmutableAbilityState = DeepImmutableObject<AbilityState>;
}

function createDefaultOnActivated(name: string) {
  return function(cb: Callback) {
    return game.on(name, cb);
  };
}

export const AbilityState_Update = 'abilityState.update';
export const AbilityState_Activate = 'abilityState.activate';

const initDefaults = (eventName: string, activatedEventName: string): AbilityState => {
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
    onActivated: createDefaultOnActivated(activatedEventName),
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
  const activatedEventName = `${AbilityState_Activate}_${state.id}`;
  if (!hordetest._devGame.abilityStates[state.id]) {
    hordetest._devGame.abilityStates[state.id] =
      withDefaults(state, initDefaults(eventName, activatedEventName), false);
    // init Updatable.
    initUpdatable(hordetest._devGame.abilityStates[state.id]);
  } else {
    hordetest._devGame.abilityStates[state.id] =
      withDefaults(state, initDefaults(eventName, activatedEventName), false);
  }

  executeUpdateCallbacks(hordetest._devGame.abilityStates[state.id]);
}

function onReceiveAbilityActivate(id: string) {
  if (game.debug) {
    console.groupCollapsed(`Client > ${AbilityState_Activate}`);
    console.log(id);
    console.groupEnd();
  }

  const eventName = `${AbilityState_Activate}_${id}`;
  game.trigger(eventName);
}

export default function() {
  if (typeof engine !== 'undefined') {
    engine.on(AbilityState_Update, onReceiveAbilityStateUpdate);
    engine.on(AbilityState_Activate, onReceiveAbilityActivate);
  }
}
