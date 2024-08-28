/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../../_baseGame/engine';
import { Dictionary } from '../../_baseGame/types/ObjectMap';
import Store from '../../_baseGame/utils/local-storage';
import { currentFormatVersion } from '../game/constants/StoreConstants';
import { MutedPlayerData } from '../game/types/StoreTypes';

// All valid keys for use with this local store should be defined here.
const keyStoreSeenPurchases = 'SeenPurchases';
const keyStoreUnseenEquipment = 'UnseenEquipment';
const keyStoreTextChatBlocks = 'TextChatBlocks';

export interface StoreFunctions {
  getUnseenEquipment(): Dictionary<boolean>;
  setUnseenEquipment(equipmentIDs: Dictionary<Boolean>): void;
  getSeenPurchases(): Dictionary<Boolean>;
  setSeenPurchases(purchaseIDs: Dictionary<Boolean>): void;
  getTextChatBlocks(): MutedPlayerData;
  setTextChatBlocks(accountIDs: MutedPlayerData): void;
}

export interface StoreMocks {}

abstract class StoreFunctionsBase implements StoreFunctions, StoreMocks {
  abstract getUnseenEquipment(): Dictionary<boolean>;
  abstract setUnseenEquipment(equipmentIDs: Dictionary<Boolean>): void;
  abstract getSeenPurchases(): Dictionary<Boolean>;
  abstract setSeenPurchases(purchaseIDs: Dictionary<Boolean>): void;
  abstract getTextChatBlocks(): MutedPlayerData;
  abstract setTextChatBlocks(accountIDs: MutedPlayerData): void;
}

class CoherentStoreFunctions extends StoreFunctionsBase {
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

class BrowserStoreFunctions extends StoreFunctionsBase {
  getUnseenEquipment(): Dictionary<boolean> {
    return {};
  }
  setUnseenEquipment(equipmentIDs: Dictionary<Boolean>): void {}
  getSeenPurchases(): Dictionary<Boolean> {
    return {};
  }
  setSeenPurchases(purchaseIDs: Dictionary<Boolean>): void {}
  getTextChatBlocks(): MutedPlayerData {
    return {
      base64AccountIDs: [],
      formatVersion: currentFormatVersion
    };
  }
  setTextChatBlocks(accountIDs: MutedPlayerData): void {}
}

export const impl: StoreFunctions & StoreMocks = engine.isAttached
  ? new CoherentStoreFunctions()
  : new BrowserStoreFunctions();
