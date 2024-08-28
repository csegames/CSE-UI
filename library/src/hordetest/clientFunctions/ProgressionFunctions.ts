/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../../_baseGame/engine';
import { Dictionary } from '../../_baseGame/types/ObjectMap';
import Store from '../../_baseGame/utils/local-storage';

// All valid keys for use with this local store should be defined here.
const keyProgressionSeenNodes = 'SeenNodes';
const keyProgressionUnseenUnlockedNodes = 'UnseenUnlockedNodes';

export interface ProgressionFunctions {
  getSeenProgressionNodesForChampion(championID: string): string[];
  setSeenProgressionNodesForChampion(championID: string, nodes: string[]): void;
  getUnseenUnlockedProgressionNodesForChampion(championID: string): string[];
  setUnseenUnlockedProgressionNodesForChampion(championID: string, nodes: string[]): void;
}

export interface ProgressionMocks {}

abstract class ProgressionFunctionsBase implements ProgressionFunctions, ProgressionMocks {
  abstract getSeenProgressionNodesForChampion(championID: string): string[];
  abstract setSeenProgressionNodesForChampion(championID: string, nodes: string[]): void;
  abstract getUnseenUnlockedProgressionNodesForChampion(championID: string): string[];
  abstract setUnseenUnlockedProgressionNodesForChampion(championID: string, nodes: string[]): void;
}

class CoherentProgressionFunctions extends ProgressionFunctionsBase {
  private store = new Store('FSRProgression');

  public getSeenProgressionNodesForChampion(championID: string): string[] {
    const allSeenNodes = this.store.get<Dictionary<string[]>>(keyProgressionSeenNodes) ?? {};
    return allSeenNodes[championID] ?? [];
  }

  public setSeenProgressionNodesForChampion(championID: string, nodes: string[]): void {
    const allSeenNodes = this.store.get<Dictionary<string[]>>(keyProgressionSeenNodes) ?? {};
    allSeenNodes[championID] = nodes;
    this.store.set(keyProgressionSeenNodes, allSeenNodes);
  }

  public getUnseenUnlockedProgressionNodesForChampion(championID: string): string[] {
    const allUnseenNodes = this.store.get<Dictionary<string[]>>(keyProgressionUnseenUnlockedNodes) ?? {};
    return allUnseenNodes[championID] ?? [];
  }

  public setUnseenUnlockedProgressionNodesForChampion(championID: string, nodes: string[]): void {
    const allUnseenNodes = this.store.get<Dictionary<string[]>>(keyProgressionUnseenUnlockedNodes) ?? {};
    allUnseenNodes[championID] = nodes;
    this.store.set(keyProgressionUnseenUnlockedNodes, allUnseenNodes);
  }
}

class BrowserProgressionFunctions extends ProgressionFunctionsBase {
  public getSeenProgressionNodesForChampion(championID: string): string[] {
    return [];
  }

  public setSeenProgressionNodesForChampion(championID: string, nodes: string[]): void {}

  public getUnseenUnlockedProgressionNodesForChampion(championID: string): string[] {
    return [];
  }

  public setUnseenUnlockedProgressionNodesForChampion(championID: string, nodes: string[]): void {}
}

export const impl: ProgressionFunctions & ProgressionMocks = engine.isAttached
  ? new CoherentProgressionFunctions()
  : new BrowserProgressionFunctions();
