/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {
  AnyEntityStateModel,
  EntityResource,
  EntityStat,
  isEntityPlayer
} from '@csegames/library/dist/camelotunchained/game/GameClientModels/EntityState';
import {
  addOrUpdateEntity,
  AnyEntityStateModelWithStatusInstanceCounts,
  PlayerEntityStateModelWithStatusInstanceCounts,
  removeEntity,
  setEntityContext
} from '../redux/entitiesSlice';
import { EntityContext } from '@csegames/library/dist/_baseGame/types/EntityContext';
import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { ExternalDataSource } from '../redux/externalDataSource';
import { ItemActionsMessage } from '@csegames/library/dist/camelotunchained/game/types/ItemActions';
import { showContextMenu } from '../redux/contextMenuSlice';
import { performItemAction } from '../helpers/itemHelpers';

export class EntityStateService extends ExternalDataSource {
  protected bind(): Promise<ListenerHandle[]> {
    return Promise.resolve([
      clientAPI.bindEntityUpdatedListener(this.handleEntityUpdated.bind(this)),
      clientAPI.bindEntityRemovedListener(this.handleEntityRemoved.bind(this)),
      clientAPI.bindEntityContextListener(this.handleEntityContext.bind(this)),
      clientAPI.bindEntityShowItemActionsListener(this.handleEntityShowItemActions.bind(this))
    ]);
  }

  private handleEntityUpdated(newState: AnyEntityStateModel) {
    // Duplicate status ids are legal (a reapply briefly sends old+new instances of the same status, and some
    // statuses stack via repeated instances rather than an Amount stat), so count instances per status id once
    // here instead of leaving every consumer to re-scan entity.statuses on their own.
    const statusInstanceCounts: Record<number, number> = {};
    Object.values(newState.statuses).forEach((status) => {
      statusInstanceCounts[status.id] = (statusInstanceCounts[status.id] ?? 0) + 1;
    });

    if (isEntityPlayer(newState)) {
      // The `stats` property handed to us is a map (not an array) keyed by array index.  We want it keyed by statID instead.
      const betterStats: Record<number, EntityStat> = {};
      Object.values(newState.stats).forEach((stat) => (betterStats[stat.id] = stat));

      // `resources` arrives the same way, keyed by array index instead of resource ID.
      const betterResources: Record<string, EntityResource> = {};
      Object.values(newState.resources).forEach((resource) => (betterResources[resource.id] = resource));

      const betterState: PlayerEntityStateModelWithStatusInstanceCounts = {
        ...newState,
        stats: betterStats,
        resources: betterResources,
        statusInstanceCounts
      };
      this.dispatch(addOrUpdateEntity(betterState));
    } else {
      const betterState: AnyEntityStateModelWithStatusInstanceCounts = {
        ...newState,
        statusInstanceCounts
      };
      this.dispatch(addOrUpdateEntity(betterState));
    }
  }

  private handleEntityContext(entityID: string, context: EntityContext) {
    this.dispatch(setEntityContext({ context, entityID }));
  }

  private handleEntityRemoved(entityID: string) {
    this.dispatch(removeEntity(entityID));
  }

  private handleEntityShowItemActions(message: ItemActionsMessage): void {
    const dispatch = this.dispatch;
    this.dispatch(
      showContextMenu({
        id: `ItemActions:${message.itemInstanceID}`,
        content: message.actions.map((action) => {
          const onClick = (): void => {
            performItemAction(
              message.itemInstanceID,
              message.numericItemDefID,
              action.id,
              action.uiReaction,
              message.itemEntityID,
              message.boneAlias,
              dispatch
            );
          };
          return {
            title: action.displayName,
            onClick
          };
        }),
        mouseX: message.mouseX,
        mouseY: message.mouseY
      })
    );
  }
}
