/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
  Updatable,
  initUpdatable,
  executeUpdateCallbacks,
  createDefaultOnReady,
  createDefaultOnUpdated,
} from './_Updatable';

export const UsingGamepad_Update = 'usingGamepad.update';

declare global {
  interface UsingGamepadStateModel {
    usingGamepad: boolean;
  }

  type UsingGamepadStateUpdatable = Readonly<UsingGamepadStateModel> & Updatable;
  interface UsingGamepadState extends UsingGamepadStateUpdatable {}
  type ImmutableUsingGamepadState = DeepImmutableObject<UsingGamepadState>;
}

function initDefault(): UsingGamepadState {
  return {
    usingGamepad: false,

    // Updatable
    isReady: false,
    updateEventName: UsingGamepad_Update,
    onUpdated: createDefaultOnUpdated(UsingGamepad_Update),
    onReady: createDefaultOnReady(UsingGamepad_Update),
  };
}

/**
 * Initialize this model with the game engine.
 */

function init() {
  _devGame.usingGamepadState = withDefaults(
    { usingGamepad: (_devGame as any).usingGamepad },
    initDefault(),
    true,
  );
  initUpdatable(_devGame.usingGamepadState);
}

function onReceiveUsingGamepadStateUpdate(usingGamepad: boolean) {
  if (game.debug) {
    console.groupCollapsed(`Client > ${UsingGamepad_Update}`);
    try {
      console.log(usingGamepad);
    } catch {}
    console.groupEnd();
  }

  if (!_devGame.usingGamepadState) {
    _devGame.usingGamepadState =
      withDefaults({ usingGamepad }, initDefault(), false);
    // init Updatable.
    initUpdatable(_devGame.usingGamepadState);
  } else {
    _devGame.usingGamepadState = withDefaults({ usingGamepad }, initDefault(), false);
  }

  executeUpdateCallbacks(_devGame.usingGamepadState);
}

export default function() {
  if (typeof engine !== 'undefined') {
    init();
    engine.on(UsingGamepad_Update, onReceiveUsingGamepadStateUpdate);
  }
}