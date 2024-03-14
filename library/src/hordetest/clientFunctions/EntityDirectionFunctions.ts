/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { EntityDirection } from '../game/types/EntityDirection';
import { engine } from '../../_baseGame/engine';
import { EventEmitter } from '../../_baseGame/types/EventEmitter';
import { ListenerHandle } from '../../_baseGame/listenerHandle';

export type EntityDirectionsListener = (directions: EntityDirection[]) => void;

export interface EntityDirectionMocks {
  triggerEntityDirections(directions: EntityDirection[]): void;
}

export interface EntityDirectionFunctions {
  bindEntityDirectionListener(listener: EntityDirectionsListener): ListenerHandle;
}

const directionsEventName = 'entityDirections.update';

class EntityDirectionFunctionsBase implements EntityDirectionFunctions, EntityDirectionMocks {
  private readonly events = new EventEmitter();

  bindEntityDirectionListener(listener: EntityDirectionsListener): ListenerHandle {
    return this.events.on(directionsEventName, listener);
  }
  triggerEntityDirections(details: EntityDirection[]) {
    this.events.trigger(directionsEventName, details);
  }
}

class CoherentEntityDirectionFunctions extends EntityDirectionFunctionsBase {
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

class BrowserEntityDirectionFunctions extends EntityDirectionFunctionsBase {}

export const impl: EntityDirectionFunctions & EntityDirectionMocks = engine.isAttached
  ? new CoherentEntityDirectionFunctions()
  : new BrowserEntityDirectionFunctions();
