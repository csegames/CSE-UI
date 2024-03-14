/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Keybind } from '@csegames/library/dist/_baseGame/types/Keybind';
import { Store } from '@csegames/library/dist/_baseGame/utils/local-storage';

interface KeybindSet {
  name: string;
  keybinds: Keybind[];
}

class KeybindsLocalStore {
  private store = new Store('CUKeybinds');

  public getSetIDs(): string[] {
    return this.store.get<string[]>(keyKeybindsSets) ?? [];
  }

  public setSetIDs(setIDs: string[]): void {
    this.store.set(keyKeybindsSets, setIDs);
  }

  public getKeybindSet(setID: string): KeybindSet | undefined {
    return this.store.get(this.getKeybindSetKey(setID));
  }

  public removeKeybindSet(setID: string): void {
    this.store.remove(this.getKeybindSetKey(setID));
  }

  public setKeybindSet(setID: string, keybindSet: KeybindSet): void {
    this.store.set(this.getKeybindSetKey(setID), keybindSet);
  }

  private getKeybindSetKey(setID: string): string {
    return `${keyPrefixKeybindSet}-${setID}`;
  }
}

export const keybindsLocalStore = new KeybindsLocalStore();

// All valid keys for use with this local store should be defined here.

const keyKeybindsSets = 'Sets';
const keyPrefixKeybindSet = 'Set';
