/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../../_baseGame/engine';
import { EventEmitter } from '../../_baseGame/types/EventEmitter';
import { ListenerHandle } from '../../_baseGame/listenerHandle';
import { Vec3f, Euler3f } from '../../camelotunchained/webAPI/definitions';
import { BuildingMode } from '../types/Building';

export type BuildingModeChangedListener = (mode: BuildingMode) => void;
export type ItemPlacementModeChangedListener = (isActive: boolean) => void;
export type ItemPlacementCommitListener = (
  itemInstanceID: string,
  position: Vec3f,
  rotation: Euler3f,
  actionID: string | null
) => void;

// client -> UI (see UIEvents.h)
const buildingModeChangedEventName = 'buildingModeChanged';
const itemPlacementModeChanged = 'itemPlacementModeChanged';
const itemPlacementCommitEventName = 'sendItemPlacementCommitRequest';

export interface BuildModeFunctions {
  bindBuildingModeChangedListener(listener: BuildingModeChangedListener): ListenerHandle;
  bindItemPlacementModeChangedListener(listener: ItemPlacementModeChangedListener): ListenerHandle;
  bindItemPlacementCommitListener(listener: ItemPlacementCommitListener): ListenerHandle;
}

export interface BuildModeMocks {
  triggerBuildingModeChanged(mode: BuildingMode): void;
  triggerItemPlacementModeChanged(isActive: boolean): void;
  triggerItemPlacementCommit(itemInstanceID: string, position: Vec3f, rotation: Euler3f, actionID: string | null): void;
}

abstract class BuildModeFunctionsBase implements BuildModeFunctions, BuildModeMocks {
  private readonly events = new EventEmitter();

  bindBuildingModeChangedListener(listener: BuildingModeChangedListener): ListenerHandle {
    return this.events.on(buildingModeChangedEventName, listener);
  }

  bindItemPlacementModeChangedListener(listener: ItemPlacementModeChangedListener): ListenerHandle {
    return this.events.on(itemPlacementModeChanged, listener);
  }

  bindItemPlacementCommitListener(listener: ItemPlacementCommitListener): ListenerHandle {
    return this.events.on(itemPlacementCommitEventName, listener);
  }

  triggerBuildingModeChanged(mode: BuildingMode): void {
    this.events.trigger(buildingModeChangedEventName, mode);
  }

  triggerItemPlacementModeChanged(isActive: boolean): void {
    this.events.trigger(itemPlacementModeChanged, isActive);
  }

  triggerItemPlacementCommit(
    itemInstanceID: string,
    position: Vec3f,
    rotation: Euler3f,
    actionID: string | null
  ): void {
    this.events.trigger(itemPlacementCommitEventName, itemInstanceID, position, rotation, actionID);
  }
}

class CoherentBuildModeFunctions extends BuildModeFunctionsBase {
  bindBuildingModeChangedListener(listener: BuildingModeChangedListener): ListenerHandle {
    const mockHandle = super.bindBuildingModeChangedListener(listener);
    const engineHandle = engine.on(buildingModeChangedEventName, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }
  bindItemPlacementModeChangedListener(listener: ItemPlacementModeChangedListener): ListenerHandle {
    const mockHandle = super.bindItemPlacementModeChangedListener(listener);
    const engineHandle = engine.on(itemPlacementModeChanged, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }
  bindItemPlacementCommitListener(listener: ItemPlacementCommitListener): ListenerHandle {
    const mockHandle = super.bindItemPlacementCommitListener(listener);
    const engineHandle = engine.on(itemPlacementCommitEventName, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }
}

class BrowserBuildModeFunctions extends BuildModeFunctionsBase {}

export const impl: BuildModeFunctions & BuildModeMocks = engine.isAttached
  ? new CoherentBuildModeFunctions()
  : new BrowserBuildModeFunctions();
