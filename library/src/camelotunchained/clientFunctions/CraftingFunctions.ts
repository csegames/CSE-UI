/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../../_baseGame/engine';
import { ListenerHandle } from '../../_baseGame/listenerHandle';
import { EventEmitter } from '../../_baseGame/types/EventEmitter';
import { EntityID } from '../../_baseGame/types/localDefinitions';

const craftingUpdatedEvent = 'crafting.updated'; // Player's tradeskill data updated
const craftingOpenedEvent = 'crafting.opened'; // Player interacted with a crafting station to open the UI
const craftingErrorEvent = 'crafting.error'; // A crafting command failed
const startCraftingCallbackName = 'crafting.StartJob';
const collectCraftingJobCallbackName = 'crafting.CollectJob';

export type CraftingErrorListener = (errorMessage: string) => void;
export type CraftingUpdatedListener = (craftingData: unknown) => void;
export declare type CraftingOpenedListener = (
  craftingStationEntityID: EntityID,
  craftingStationItemDefID: number,
  craftingStationItemInstanceID: string
) => void;

export interface CraftingMocks {
  triggerCraftingError(errorMessage: string): void;
  triggerCraftingUpdated(craftingData: unknown): void;
  triggerCraftingOpened(
    craftingStationEntityID: EntityID,
    craftingStationItemDefID: number,
    craftingStationItemInstanceID: string
  ): void;
}

export interface CraftingFunctions {
  bindCraftingErrorListener(listener: CraftingErrorListener): ListenerHandle;
  bindCraftingUpdatedListener(listener: CraftingUpdatedListener): ListenerHandle;
  bindCraftingOpenedListener(listener: CraftingOpenedListener): ListenerHandle;
  startCraftingJob(
    recipeID: string,
    craftingStationEntityID: EntityID,
    selectedIngredients: Array<SelectedIngredient>,
    batchCount: number
  ): void;
  collectCraftingJob(jobID: string, craftingStationEntityID: EntityID): void;
}

class CraftingFunctionsBase implements CraftingFunctions, CraftingMocks {
  private readonly events = new EventEmitter();

  bindCraftingErrorListener(listener: CraftingErrorListener): ListenerHandle {
    return this.events.on(craftingUpdatedEvent, listener);
  }
  triggerCraftingError(errorMessage: string): void {
    this.events.trigger(craftingErrorEvent, errorMessage);
  }

  bindCraftingUpdatedListener(listener: CraftingUpdatedListener): ListenerHandle {
    return this.events.on(craftingUpdatedEvent, listener);
  }
  triggerCraftingUpdated(craftingData: unknown): void {
    this.events.trigger(craftingUpdatedEvent, craftingData);
  }

  bindCraftingOpenedListener(listener: CraftingOpenedListener): ListenerHandle {
    return this.events.on(craftingOpenedEvent, listener);
  }
  triggerCraftingOpened(
    craftingStationEntityID: EntityID,
    craftingStationItemDefID: number,
    craftingStationItemInstanceID: string
  ): void {
    this.events.trigger(
      craftingOpenedEvent,
      craftingStationEntityID,
      craftingStationItemDefID,
      craftingStationItemInstanceID
    );
  }

  startCraftingJob(
    recipeID: string,
    craftingStationEntityID: EntityID,
    selectedIngredients: Array<SelectedIngredient>,
    batchCount: number
  ): void {}

  collectCraftingJob(jobID: string, craftingStationEntityID: EntityID): void {}
}

class CoherentCraftingFunctions extends CraftingFunctionsBase {
  bindCraftingUpdatedListener(listener: CraftingUpdatedListener): ListenerHandle {
    const mockHandle = super.bindCraftingUpdatedListener(listener);
    const engineHandle = engine.on(craftingUpdatedEvent, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }

  bindCraftingOpenedListener(listener: CraftingOpenedListener): ListenerHandle {
    const mockHandle = super.bindCraftingOpenedListener(listener);
    const engineHandle = engine.on(craftingOpenedEvent, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }

  startCraftingJob(
    recipeID: string,
    craftingStationEntityID: EntityID,
    selectedIngredients: Array<SelectedIngredient>,
    batchCount: number
  ): void {
    engine.trigger(
      startCraftingCallbackName,
      recipeID ?? '',
      craftingStationEntityID ?? '0000000000000000000000',
      selectedIngredients ?? {},
      batchCount ?? 0
    );
  }

  collectCraftingJob(jobID: string, craftingStationEntityID: EntityID) {
    engine.trigger(collectCraftingJobCallbackName, jobID ?? '', craftingStationEntityID ?? '');
  }
}

export interface SelectedIngredient {
  itemInstanceID: string;
  quantity: number;
  slot: number;
}

class BrowserCraftingFunctions extends CraftingFunctionsBase {}

export const impl: CraftingFunctions & CraftingMocks = engine.isAttached
  ? new CoherentCraftingFunctions()
  : new BrowserCraftingFunctions();
