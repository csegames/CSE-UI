/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Store } from '@csegames/library/dist/_baseGame/utils/local-storage';

class BattlePassLocalStore {
  private store = new Store('FSRBattlePass');

  public getLastSplashedBattlePassID(): string {
    const last = this.store.get<string>(keyLastBattlePassSplashed);
    return last ?? '';
  }

  public getLastEndedBattlePassID(): string {
    const last = this.store.get<string>(keyLastBattlePassEnded);
    return last ?? '';
  }

  public setLastSplashedBattlePassID(bpID: string): void {
    this.store.set(keyLastBattlePassSplashed, bpID);
  }

  public setLastEndedBattlePassID(bpID: string): void {
    this.store.set(keyLastBattlePassEnded, bpID);
  }

  public getLastSeenFreeBattlePassID(): string {
    const last = this.store.get<string>(keyLastFreeBattlePassSeen);
    return last ?? '';
  }

  public setLastSeenFreeBattlePassID(bpID: string): void {
    this.store.set(keyLastFreeBattlePassSeen, bpID);
  }

  public getLastSeenBattlePassID(): string {
    const last = this.store.get<string>(keyLastBattlePassSeen);
    return last ?? '';
  }

  public setLastSeenBattlePassID(bpID: string): void {
    this.store.set(keyLastBattlePassSeen, bpID);
  }
}

export const battlePassLocalStore = new BattlePassLocalStore();

// All valid keys for use with this local store should be defined here.
const keyLastBattlePassSplashed = 'LastBattlePassSplashed';
const keyLastBattlePassEnded = 'LastBattlePassEnded';
const keyLastFreeBattlePassSeen = 'LastFreeBattlePassSeen';
const keyLastBattlePassSeen = 'LastBattlePassSeen';
