/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../engine';
import { ListenerHandle } from '../listenerHandle';
import { EventEmitter } from '../types/EventEmitter';
import { EntityContext } from '../types/EntityContext';
import { EntityID } from '../types/localDefinitions';
import { BaseEntityStateModel, EntityPositionMapModel } from '../../camelotunchained/game/GameClientModels/EntityState';
import { ItemActionsMessage } from '../../camelotunchained/game/types/ItemActions';

// This type must be specialized based on the game specific entity model definition, so it
// uses a factory function instead of a singleton.

export type EntityContextListener = (entityID: EntityID, context: EntityContext) => void;
export type EntityRemovedListener = (entityID: EntityID) => void;
export type EntityUpdatedListener<Model> = (newState: Model) => void;
export type EntityPositionMapUpdatedListener = (newState: EntityPositionMapModel) => void;
export type EntityShowItemActionsListener = (message: ItemActionsMessage, entityState: BaseEntityStateModel) => void;

export interface EntityFunctions<Model> {
  bindEntityContextListener(listener: EntityContextListener): ListenerHandle;
  bindEntityRemovedListener(listener: EntityRemovedListener): ListenerHandle;
  bindEntityUpdatedListener(listener: EntityUpdatedListener<Model>): ListenerHandle;
  bindEntityPositionMapUpdatedListener(listener: EntityPositionMapUpdatedListener): ListenerHandle;
  bindEntityShowItemActionsListener(listener: EntityShowItemActionsListener): ListenerHandle;
}

export interface EntityMocks<Model> {
  triggerEntityContext(entityID: EntityID, context: EntityContext): void;
  triggerEntityRemoved(entityID: EntityID): void;
  triggerEntityUpdated(newState: Model): void;
  triggerEntityPositionMapUpdated(newState: EntityPositionMapModel): void;
}

const contextEventName = 'entity.context';
const updatedEventName = 'entity.updated';
const removedEventName = 'entity.removed';
const positionMapUpdatedEventName = 'entity.positionMapUpdated';
const showItemActionsEventName = 'showItemActions';

class EntityFunctionsBase<Model> implements EntityFunctions<Model>, EntityMocks<Model> {
  private readonly events = new EventEmitter();

  public bindEntityContextListener(listener: EntityContextListener): ListenerHandle {
    return this.events.on(contextEventName, listener);
  }
  public bindEntityRemovedListener(listener: EntityRemovedListener): ListenerHandle {
    return this.events.on(removedEventName, listener);
  }
  public bindEntityUpdatedListener(listener: EntityUpdatedListener<Model>): ListenerHandle {
    return this.events.on(updatedEventName, listener);
  }
  public bindEntityPositionMapUpdatedListener(listener: EntityPositionMapUpdatedListener): ListenerHandle {
    return this.events.on(positionMapUpdatedEventName, listener);
  }
  public bindEntityShowItemActionsListener(listener: EntityShowItemActionsListener): ListenerHandle {
    return this.events.on(showItemActionsEventName, listener);
  }
  triggerEntityContext(entityID: EntityID, context: EntityContext): void {
    this.events.trigger(updatedEventName, entityID, context);
  }
  triggerEntityRemoved(entityID: EntityID): void {
    this.events.trigger(removedEventName, entityID);
  }
  triggerEntityUpdated(newState: Model): void {
    this.events.trigger(contextEventName, newState);
  }
  triggerEntityPositionMapUpdated(newState: EntityPositionMapModel): void {
    this.events.trigger(positionMapUpdatedEventName, newState);
  }
  triggerEntityShowItemActions(message: ItemActionsMessage, entityState: BaseEntityStateModel): void {
    this.events.trigger(showItemActionsEventName, message, entityState);
  }
}

class CoherentEntityFunctions<Model> extends EntityFunctionsBase<Model> {
  public override bindEntityContextListener(listener: EntityContextListener): ListenerHandle {
    const mockHandle = super.bindEntityContextListener(listener);
    const engineHandle = engine.on(contextEventName, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }

  public override bindEntityRemovedListener(listener: EntityRemovedListener): ListenerHandle {
    const mockHandle = super.bindEntityRemovedListener(listener);
    const engineHandle = engine.on(removedEventName, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }

  public override bindEntityUpdatedListener(listener: EntityUpdatedListener<Model>): ListenerHandle {
    const mockHandle = super.bindEntityUpdatedListener(listener);
    const engineHandle = engine.on(updatedEventName, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }

  public override bindEntityPositionMapUpdatedListener(listener: EntityPositionMapUpdatedListener): ListenerHandle {
    const mockHandle = super.bindEntityPositionMapUpdatedListener(listener);
    const engineHandle = engine.on(positionMapUpdatedEventName, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }

  public override bindEntityShowItemActionsListener(listener: EntityShowItemActionsListener): ListenerHandle {
    const mockHandle = super.bindEntityShowItemActionsListener(listener);
    const engineHandle = engine.on(showItemActionsEventName, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }
}

class BrowserEntityFunctions<Model> extends EntityFunctionsBase<Model> {}

export function create<Model>(): EntityFunctions<Model> & EntityMocks<Model> {
  return engine.isAttached ? new CoherentEntityFunctions<Model>() : new BrowserEntityFunctions<Model>();
}
