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
} from '../../../_baseGame/GameClientModels/_Updatable';

export const ConsumableItems_Update = 'consumableItems.update';

declare global {
  interface ConsumableItemsStateModel {
    activeIndex: number;
    items: ArrayMap<ConsumableItem>;
    keybindForNext: Binding;
    keybindForPrior: Binding;
    keybindToUse: Binding;
  }

  type ConsumableItemsStateUpdatable = Readonly<ConsumableItemsStateModel> & Updatable;
  interface ConsumableItemsState extends ConsumableItemsStateUpdatable {}
  type ImmutableConsumableItemsState = DeepImmutableObject<ConsumableItemsState>;
}

function noOp(...args: any[]): any {}

function initDefault(): ConsumableItemsState {
  return {
    activeIndex: 0,
    items: {},
    keybindForNext: null,
    keybindForPrior: null,
    keybindToUse: null,

    // Updatable
    isReady: false,
    updateEventName: ConsumableItems_Update,
    onUpdated: createDefaultOnUpdated(ConsumableItems_Update),
    onReady: createDefaultOnReady(ConsumableItems_Update),
  };
}

/**
 * Initialize this model with the game engine.
 */
function onReceiveConsumableItemsStateUpdate(state: ConsumableItemsState) {
  if (game.debug) {
    console.groupCollapsed(`Client > ${ConsumableItems_Update}`);
    try {
      console.log(JSON.stringify(state));
    } catch {}
    console.groupEnd();
  }

  if (!hordetest._devGame.consumableItemsState) {
    hordetest._devGame.consumableItemsState =
      withDefaults(state, initDefault(), false);
    // init Updatable.
    initUpdatable(hordetest._devGame.consumableItemsState);
  } else {
    hordetest._devGame.consumableItemsState = withDefaults(state, initDefault(), false);
  }

  executeUpdateCallbacks(hordetest._devGame.consumableItemsState);
}

export default function() {
  if (typeof engine !== 'undefined') {
    engine.on(ConsumableItems_Update, onReceiveConsumableItemsStateUpdate);
  }
}
