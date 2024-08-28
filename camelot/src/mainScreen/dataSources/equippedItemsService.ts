/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ExternalDataSource from '../redux/externalDataSource';
import { InitTopic } from '../redux/initializationSlice';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { EquippedItemsQueryResult } from './equippedItemsNetworkingConstants';
import { equippedItemsQuery } from './equippedItemsNetworkingConstants';
import {
  addEquippedItemsPendingRefresh,
  resolveEquippedItemsPendingRefresh,
  updateEquippedItems
} from '../redux/equippedItemsSlice';
import { moveHiddenItems } from '../components/items/itemUtils';
import { EventEmitter } from '@csegames/library/dist/_baseGame/types/EventEmitter';

const equippedItemsServiceEventEmitter = new EventEmitter();

export class EquippedItemsService extends ExternalDataSource {
  private refreshHandle: ListenerHandle = null;

  protected async bind(): Promise<ListenerHandle[]> {
    equippedItemsServiceEventEmitter.on('refresh', this.refresh.bind(this));
    return [
      await this.query<EquippedItemsQueryResult>(
        { query: equippedItemsQuery },
        this.handleEquippedItems.bind(this),
        InitTopic.EquippedItems
      )
    ];
  }

  private handleEquippedItems(result: EquippedItemsQueryResult): void {
    if (this.reduxState.equippedItems.equippedItemsPendingRefreshes > 0) {
      this.dispatch(resolveEquippedItemsPendingRefresh());
    }
    if (this.reduxState.equippedItems.equippedItemsPendingRefreshes === 0) {
      this.dispatch(updateEquippedItems(result.myEquippedItems));
      this.refreshHandle?.close();
      this.refreshHandle = null;
    }
    const moveHiddenItemsInitTopics = [InitTopic.Inventory, InitTopic.GameDefs, InitTopic.EquippedItems];
    if (
      this.reduxState.initialization.uninitializedTopics.every((topic) => !moveHiddenItemsInitTopics.includes(topic))
    ) {
      moveHiddenItems(
        this.reduxState.inventory.items,
        this.reduxState.gameDefs.racesByNumericID,
        this.reduxState.gameDefs.classesByNumericID,
        this.reduxState.player.faction,
        this.reduxState.player.race,
        this.reduxState.player.classID,
        this.reduxState.inventory.items,
        this.reduxState.equippedItems.items,
        this.reduxState.gameDefs.myStats,
        this.reduxState.gameDefs.gearSlots,
        this.reduxState.inventory.stackSplit,
        this.reduxState.inventory.inventoryPendingRefreshes,
        this.reduxState.equippedItems.equippedItemsPendingRefreshes,
        this.dispatch
      );
    }
  }

  private async refresh(): Promise<void> {
    this.dispatch(addEquippedItemsPendingRefresh());
    this.refreshHandle?.close();
    this.refreshHandle = await this.query<EquippedItemsQueryResult>(
      { query: equippedItemsQuery },
      this.handleEquippedItems.bind(this)
    );
  }
}

export const refreshEquippedItems = (): void => {
  equippedItemsServiceEventEmitter.trigger('refresh');
};
