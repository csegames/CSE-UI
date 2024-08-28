/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../../_baseGame/engine';
import Store from '../../_baseGame/utils/local-storage';

// All valid keys for use with this local store should be defined here.
const keyLastBattlePassSplashed = 'LastBattlePassSplashed';
const keyLastBattlePassEnded = 'LastBattlePassEnded';
const keyLastFreeBattlePassSeen = 'LastFreeBattlePassSeen';
const keyLastBattlePassSeen = 'LastBattlePassSeen';

export interface BattlePassFunctions {
  getLastSplashedBattlePassID(): string;
  getLastEndedBattlePassID(): string;
  setLastSplashedBattlePassID(bpID: string): void;
  setLastEndedBattlePassID(bpID: string): void;
  getLastSeenFreeBattlePassID(): string;
  setLastSeenFreeBattlePassID(bpID: string): void;
  getLastSeenBattlePassID(): string;
  setLastSeenBattlePassID(bpID: string): void;
}

export interface BattlePassMocks {}

abstract class BattlePassFunctionsBase implements BattlePassFunctions, BattlePassMocks {
  abstract getLastSplashedBattlePassID(): string;
  abstract getLastEndedBattlePassID(): string;
  abstract setLastSplashedBattlePassID(bpID: string): void;
  abstract setLastEndedBattlePassID(bpID: string): void;
  abstract getLastSeenFreeBattlePassID(): string;
  abstract setLastSeenFreeBattlePassID(bpID: string): void;
  abstract getLastSeenBattlePassID(): string;
  abstract setLastSeenBattlePassID(bpID: string): void;
}

class CoherentBattlePassFunctions extends BattlePassFunctionsBase {
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

class BrowserBattlePassFunctions extends BattlePassFunctionsBase {
  getLastSplashedBattlePassID(): string {
    return '';
  }
  getLastEndedBattlePassID(): string {
    return '';
  }
  setLastSplashedBattlePassID(bpID: string): void {}
  setLastEndedBattlePassID(bpID: string): void {}
  getLastSeenFreeBattlePassID(): string {
    return '';
  }
  setLastSeenFreeBattlePassID(bpID: string): void {}
  getLastSeenBattlePassID(): string {
    return '';
  }
  setLastSeenBattlePassID(bpID: string): void {}
}

export const impl: BattlePassFunctions & BattlePassMocks = engine.isAttached
  ? new CoherentBattlePassFunctions()
  : new BrowserBattlePassFunctions();
