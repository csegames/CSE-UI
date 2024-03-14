/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { ArrayMap } from '../../../_baseGame/types/ObjectMap';
import { ConsumableItem } from '../types/Consumables';
import { DeepImmutable } from '../../../_baseGame/types/DeepImmutable';
import {
  Updatable,
  initUpdatable,
  executeUpdateCallbacks,
  createDefaultOnReady,
  createDefaultOnUpdated
} from '../../../_baseGame/GameClientModels/Updatable';
import { withDefaults } from '../../../_baseGame/utils/withDefaults';
import { BaseGameInterface } from '../../../_baseGame/BaseGameInterface';
import { engine } from '../../../_baseGame/engine';
import { HordeTestModel } from '../HordeTestModel';

export const ConsumableItems_Update = 'consumableItems.update';

export interface ConsumableItemsStateModel {
  activeIndex: number;
  items: ArrayMap<ConsumableItem>;
  timestamp?: number;
}

type ConsumableItemsStateUpdatable = Readonly<ConsumableItemsStateModel> & Updatable;
export interface ConsumableItemsState extends ConsumableItemsStateUpdatable {}
export type ImmutableConsumableItemsState = DeepImmutable<ConsumableItemsState>;

function initDefault(): ConsumableItemsState {
  return {
    activeIndex: 0,
    items: {},
    timestamp: 0,

    // Updatable
    isReady: false,
    updateEventName: ConsumableItems_Update,
    onUpdated: (game: BaseGameInterface) => createDefaultOnUpdated(game, ConsumableItems_Update),
    onReady: (game: BaseGameInterface) => createDefaultOnReady(game, ConsumableItems_Update)
  };
}

/**
 * Initialize this model with the game engine.
 */
function onReceiveConsumableItemsStateUpdate(
  game: BaseGameInterface,
  hordetest: HordeTestModel
): (state: ConsumableItemsState) => void {
  return (state: ConsumableItemsState) => {
    if (game.debug) {
      console.groupCollapsed(`Client > ${ConsumableItems_Update}`);
      try {
        console.log(JSON.stringify(state));
      } catch {}
      console.groupEnd();
    }
    hordetest._devGame.consumableItemsState = withDefaults(state, initDefault(), false);
    executeUpdateCallbacks(game, hordetest._devGame.consumableItemsState);
  };
}

export function initConsumableItemsState(game: BaseGameInterface, hordetest: HordeTestModel) {
  hordetest._devGame.consumableItemsState = withDefaults({}, initDefault(), false);
  initUpdatable(hordetest._devGame.consumableItemsState);
  engine.on(ConsumableItems_Update, onReceiveConsumableItemsStateUpdate(game, hordetest));
}
