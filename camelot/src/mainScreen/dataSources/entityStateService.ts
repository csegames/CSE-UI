/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
  AnyEntityStateModel,
  BaseEntityStateModel,
  EntityResource,
  PlayerEntityStateModel,
  EntityPositionMapModel
} from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import { addOrUpdateEntity, removeEntity, setEntityContext, updatePositions } from '../redux/entitiesSlice';
import { updatePlayerDelta } from '../redux/playerSlice';
import { addIfChanged, isDictionaryChanged } from '../redux/reduxUtils';
import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { EntityID } from '@csegames/library/dist/camelotunchained/graphql/schema';
import { EntityContext } from '@csegames/library/dist/_baseGame/types/EntityContext';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import ExternalDataSource from '../redux/externalDataSource';
import { ItemActionsMessage } from '@csegames/library/dist/camelotunchained/game/types/ItemActions';
import { showContextMenu } from '../redux/contextMenuSlice';
import { performItemAction } from '../components/items/itemUtils';

export class EntityStateService extends ExternalDataSource {
  protected bind(): Promise<ListenerHandle[]> {
    return Promise.resolve([
      clientAPI.bindEntityUpdatedListener(this.handleEntityUpdated.bind(this)),
      clientAPI.bindEntityRemovedListener(this.handleEntityRemoved.bind(this)),
      clientAPI.bindEntityContextListener(this.handleEntityContext.bind(this)),
      clientAPI.bindEntityShowItemActionsListener(this.handleEntityShowItemActions.bind(this)),
      clientAPI.bindEntityPositionMapUpdatedListener(this.handleEntityPositionMapUpdated.bind(this))
    ]);
  }

  private handleEntityUpdated(newState: AnyEntityStateModel) {
    // This first dispatch updates the general entity registry.
    this.dispatch(addOrUpdateEntity(newState));

    // And following dispatches are for entities that some part of the UI wants direct access to.
    if (newState.entityID === this.reduxState.player.entityID) {
      this.diffAndDispatchLocalPlayer(newState as PlayerEntityStateModel);
    }

    // TODO: Lots of possible special cases for all the various UIs that want to mark a particular entity as "special" for their purposes.
    // TODO: Not sure how many of those are actually necessary, but we'll see.
  }

  private handleEntityContext(entityID: EntityID, context: EntityContext) {
    const entities = this.reduxState.entities.entities;
    if (context == 'player' && entityID in entities) {
      this.diffAndDispatchLocalPlayer(entities[entityID] as PlayerEntityStateModel);
    }
    this.dispatch(setEntityContext({ context, entityID }));
  }

  private handleEntityRemoved(entityID: EntityID) {
    this.dispatch(removeEntity(entityID));
  }

  private handleEntityShowItemActions(message: ItemActionsMessage, entityState: BaseEntityStateModel): void {
    this.dispatch(
      showContextMenu({
        id: `ItemActions:${entityState.entityID}`,
        content: message.actions.map((action) => {
          const onClick = (): void => {
            performItemAction(
              message.itemInstanceID,
              message.numericItemDefID,
              action.id,
              action.uiReaction,
              entityState.entityID,
              { x: 0, y: 0, z: 0 },
              null,
              message.boneAlias,
              this.dispatch
            );
          };
          return {
            title: action.displayName,
            onClick: onClick.bind(this)
          };
        }),
        mouseX: this.reduxState.hud.mouseX,
        mouseY: this.reduxState.hud.mouseY
      })
    );
  }

  private handleEntityPositionMapUpdated(newState: EntityPositionMapModel): void {
    this.dispatch(updatePositions(newState));
  }

  private diffAndDispatchLocalPlayer(newState: PlayerEntityStateModel) {
    const oldState = this.reduxState.player;
    const delta: Partial<PlayerEntityStateModel> = {};

    // Extract all fields.
    const {
      // BaseEntityStateModel fields
      faction,
      // entityID inherently depends on being correct before we get into this function, so no need to diff.
      name,
      isAlive,
      statuses,
      objective,
      wounds,

      // PlayerEntityStateModel fields
      // type is always 'Player', so no need to diff.
      characterKind,
      race,
      gender,
      classID,
      resources,
      controlledEntityID
    } = newState;

    // Diff fields that need diffed.
    addIfChanged(delta, { faction }, [faction], [oldState.faction]);
    addIfChanged(delta, { name }, [name], [oldState.name]);
    addIfChanged(delta, { isAlive }, [isAlive], [oldState.isAlive]);
    this.addStatusesIfChanged(delta, statuses, oldState.statuses);
    addIfChanged(
      delta,
      { objective },
      [
        objective?.footprintRadius,
        objective?.indicator,
        objective?.indicatorLabel,
        objective?.state,
        objective?.visibility
      ],
      [
        oldState.objective?.footprintRadius,
        oldState.objective?.indicator,
        oldState.objective?.indicatorLabel,
        oldState.objective?.state,
        oldState.objective?.visibility
      ]
    );

    addIfChanged(delta, { characterKind }, [characterKind], [oldState.characterKind]);
    addIfChanged(delta, { race }, [race], [oldState.race]);
    addIfChanged(delta, { gender }, [gender], [oldState.gender]);
    addIfChanged(delta, { classID }, [classID], [oldState.classID]);
    addIfChanged(delta, { wounds }, [wounds], [oldState.wounds]);
    this.addResourcesIfChanged(delta, resources, oldState.resources);
    addIfChanged(delta, { controlledEntityID }, [controlledEntityID], [oldState.controlledEntityID]);

    if (Object.keys(delta).length > 0) {
      this.dispatch(updatePlayerDelta(delta));
    }
  }

  private addStatusesIfChanged(
    delta: Partial<PlayerEntityStateModel>,
    newStatuses: Dictionary<Status>,
    oldStatuses: Dictionary<Status>
  ): void {
    if (!newStatuses) {
      return;
    }

    if (
      isDictionaryChanged(oldStatuses, newStatuses, (a: Status, b: Status) => {
        return a.duration !== b.duration || a.startTime !== b.startTime;
      })
    ) {
      delta.statuses = newStatuses;
    }
  }

  private addResourcesIfChanged(
    delta: Partial<PlayerEntityStateModel>,
    newResources: Dictionary<EntityResource>,
    oldResources: Dictionary<EntityResource>
  ): void {
    if (
      isDictionaryChanged(oldResources, newResources, (a: EntityResource, b: EntityResource) => {
        return a.current !== b.current || a.max !== b.max || a.name !== b.name;
      })
    ) {
      delta.resources = newResources;
    }
  }
}

interface Status {
  id: number;
  duration: number;
  startTime: number;
}
