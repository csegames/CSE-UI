/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import ExternalDataSource from '../redux/externalDataSource';
import { InitTopic } from '../redux/initializationSlice';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { InventoryQueryResult } from './inventoryNetworkingConstants';
import { inventoryQuery } from './inventoryNetworkingConstants';
import { addInventoryPendingRefresh, resolveInventoryPendingRefresh, updateInventory } from '../redux/inventorySlice';
import { moveHiddenItems } from '../components/items/itemUtils';
import { EventEmitter } from '@csegames/library/dist/_baseGame/types/EventEmitter';

const inventoryServiceEventEmitter = new EventEmitter();

export class InventoryService extends ExternalDataSource {
  private refreshHandle: ListenerHandle = null;

  protected async bind(): Promise<ListenerHandle[]> {
    inventoryServiceEventEmitter.on('refresh', this.refresh.bind(this));
    return [
      await this.query<InventoryQueryResult>(
        { query: inventoryQuery },
        this.handleInventory.bind(this),
        InitTopic.Inventory
      )
    ];
  }

  private handleInventory(result: InventoryQueryResult): void {
    if (this.reduxState.inventory.inventoryPendingRefreshes > 0) {
      this.dispatch(resolveInventoryPendingRefresh());
    }
    if (this.reduxState.inventory.inventoryPendingRefreshes === 0) {
      this.dispatch(updateInventory(result.myInventory));
      this.refreshHandle?.close();
      this.refreshHandle = null;
    }
    const moveHiddenItemsInitTopics = [InitTopic.Inventory, InitTopic.GameDefs, InitTopic.EquippedItems];
    if (
      this.reduxState.initialization.uninitializedTopics.every((topic) => !moveHiddenItemsInitTopics.includes(topic))
    ) {
      moveHiddenItems(
        result.myInventory.items,
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
    this.dispatch(addInventoryPendingRefresh());
    this.refreshHandle?.close();
    this.refreshHandle = await this.query<InventoryQueryResult>(
      { query: inventoryQuery },
      this.handleInventory.bind(this)
    );
  }
}

export const refreshInventory = (): void => {
  inventoryServiceEventEmitter.trigger('refresh');
};
