/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { clientAPI } from '@csegames/library/dist/camelotunchained/MainScreenClientAPI';
import { ListenerHandle } from '@csegames/library/dist/_baseGame/listenerHandle';
import { ExternalDataSource } from '../redux/externalDataSource';
import { Item } from '@csegames/library/dist/camelotunchained/game/types/Items';
import { updateAccountBank, updateEquipment, updatePrimaryInventory, updateWallet } from '../redux/inventorySlice';

export class InventoryService extends ExternalDataSource {
  protected bind(): Promise<ListenerHandle[]> {
    return Promise.resolve([clientAPI.bindInventoryUpdatedListener(this.handleInventoryUpdated.bind(this))]);
  }

  private handleInventoryUpdated(name: string, content: Item[]) {
    switch (name) {
      case 'accountBank':
        this.dispatch(updateAccountBank(content));
        break;
      case 'equipment':
        this.dispatch(updateEquipment(content));
        break;
      case 'primary':
        this.dispatch(updatePrimaryInventory(content));
        break;
      case 'wallet':
        this.dispatch(updateWallet(content));
        break;
    }
  }
}
