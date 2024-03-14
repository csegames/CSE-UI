/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Dictionary } from '@csegames/library/dist/_baseGame/types/ObjectMap';
import { Store } from '@csegames/library/dist/_baseGame/utils/local-storage';
import { MutedPlayerData, currentFormatVersion } from '../redux/localStorageSlice';

class StoreLocalStore {
  private store = new Store('FSRStore');

  public getUnseenEquipment(): Dictionary<boolean> {
    return this.store.get<Dictionary<boolean>>(keyStoreUnseenEquipment) || {};
  }

  public setUnseenEquipment(equipmentIDs: Dictionary<Boolean>): void {
    this.store.set(keyStoreUnseenEquipment, equipmentIDs);
  }

  public getSeenPurchases(): Dictionary<Boolean> {
    return this.store.get<Dictionary<boolean>>(keyStoreSeenPurchases) || {};
  }

  public setSeenPurchases(purchaseIDs: Dictionary<Boolean>): void {
    this.store.set(keyStoreSeenPurchases, purchaseIDs);
  }

  public getTextChatBlocks(): MutedPlayerData {
    const data: MutedPlayerData = this.store.get<MutedPlayerData>(keyStoreTextChatBlocks);
    if (!data || data.formatVersion != currentFormatVersion) {
      return {
        base64AccountIDs: [],
        formatVersion: currentFormatVersion
      };
    }

    return data;
  }

  public setTextChatBlocks(accountIDs: MutedPlayerData): boolean {
    this.store.set(keyStoreTextChatBlocks, accountIDs);
    return true;
  }
}

export const storeLocalStore = new StoreLocalStore();

// All valid keys for use with this local store should be defined here.
const keyStoreSeenPurchases = 'SeenPurchases';
const keyStoreUnseenEquipment = 'UnseenEquipment';
const keyStoreTextChatBlocks = 'TextChatBlocks';
