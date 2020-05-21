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
    systemAnchorID: number;
    systemSlotID: number;
    systemKeyBinding: Binding;
    icon: string; // Apparent only on system anchor abilities
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
    systemAnchorID: 0,
    systemSlotID: 0,
    systemKeyBinding: { name: '', value: 0, iconClass: '' },
    icon: '',
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
  if (!camelotunchained._devGame.abilityStates[state.id]) {
    camelotunchained._devGame.abilityStates[state.id] =
      cloneDeep(withDefaults(state, initDefaults(eventName, activatedEventName), false));
    // init Updatable.
    initUpdatable(camelotunchained._devGame.abilityStates[state.id]);
  } else {
    camelotunchained._devGame.abilityStates[state.id] =
      cloneDeep(withDefaults(state, initDefaults(eventName, activatedEventName), false));
  }

  executeUpdateCallbacks(camelotunchained._devGame.abilityStates[state.id]);
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

let updateHandle = null;
let activateHandle = null;
export default function() {
  if (updateHandle) {
    updateHandle.clear();
  }

  if (activateHandle) {
    activateHandle.clear();
  }

  if (typeof engine !== 'undefined') {
    updateHandle = engine.on(AbilityState_Update, onReceiveAbilityStateUpdate);
    activateHandle = engine.on(AbilityState_Activate, onReceiveAbilityActivate);
  }
}
