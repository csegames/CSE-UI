/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { EntityDirection } from '../game/types/EntityDirection';
import { ConsumableItemsState } from '../game/GameClientModels/ConsumableItemsState';
import { engine } from '../../_baseGame/engine';
import { EventEmitter } from '../../_baseGame/types/EventEmitter';
import { ListenerHandle } from '../../_baseGame/listenerHandle';

export type EntityDirectionsListener = (directions: EntityDirection[]) => void;
export type ConsumablesListener = (consumables: ConsumableItemsState) => void;

export interface TempEntityMocks {
  triggerEntityDirections(directions: EntityDirection[]): void;
  triggerConsumables(consumables: ConsumableItemsState): void;
}

export interface TempEntityFunctions {
  bindConsumeablesListener(listener: ConsumablesListener): ListenerHandle;
  bindEntityDirectionListener(listener: EntityDirectionsListener): ListenerHandle;
}

const directionsEventName = 'entityDirections.update';
const consumablesEventName = 'consumableItems.update';

class TempEntityFunctionsBase implements TempEntityFunctions, TempEntityMocks {
  private readonly events = new EventEmitter();

  bindConsumeablesListener(listener: ConsumablesListener): ListenerHandle {
    return this.events.on(consumablesEventName, listener);
  }
  bindEntityDirectionListener(listener: EntityDirectionsListener): ListenerHandle {
    return this.events.on(directionsEventName, listener);
  }
  triggerConsumables(consumables: ConsumableItemsState): void {
    this.events.trigger(consumablesEventName, consumables);
  }
  triggerEntityDirections(details: EntityDirection[]) {
    this.events.trigger(directionsEventName, details);
  }
}

class CoherentTempEntityFunctions extends TempEntityFunctionsBase {
  bindConsumeablesListener(listener: ConsumablesListener): ListenerHandle {
    const mockHandle = super.bindConsumeablesListener(listener);
    const engineHandle = engine.on(consumablesEventName, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }
  bindEntityDirectionListener(listener: EntityDirectionsListener): ListenerHandle {
    const mockHandle = super.bindEntityDirectionListener(listener);
    const engineHandle = engine.on(directionsEventName, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }
}

class BrowserTempEntityFunctions extends TempEntityFunctionsBase {}

export const impl: TempEntityFunctions & TempEntityMocks = engine.isAttached
  ? new CoherentTempEntityFunctions()
  : new BrowserTempEntityFunctions();
