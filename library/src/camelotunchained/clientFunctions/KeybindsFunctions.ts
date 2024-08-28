/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../../_baseGame/engine';
import Store from '../../_baseGame/utils/local-storage';
import { KeybindSet } from '../game/types/KeybindsTypes';

// All valid keys for use with this local store should be defined here.
const keyKeybindsSets = 'Sets';
const keyPrefixKeybindSet = 'Set';

export interface KeybindsFunctions {
  getKeybindSetIDs(): string[];
  setKeybindSetIDs(setIDs: string[]): void;
  getKeybindSet(setID: string): KeybindSet | undefined;
  removeKeybindSet(setID: string): void;
  setKeybindSet(setID: string, keybindSet: KeybindSet): void;
  getKeybindSetKey(setID: string): string;
}

export interface KeybindsMocks {}

abstract class KeybindsFunctionsBase implements KeybindsFunctions, KeybindsMocks {
  abstract getKeybindSetIDs(): string[];
  abstract setKeybindSetIDs(setIDs: string[]): void;
  abstract getKeybindSet(setID: string): KeybindSet | undefined;
  abstract removeKeybindSet(setID: string): void;
  abstract setKeybindSet(setID: string, keybindSet: KeybindSet): void;
  abstract getKeybindSetKey(setID: string): string;
}

class CoherentKeybindsFunctions extends KeybindsFunctionsBase {
  private store = new Store('FSRKeybinds');

  public getKeybindSetIDs(): string[] {
    return this.store.get<string[]>(keyKeybindsSets) ?? [];
  }

  public setKeybindSetIDs(setIDs: string[]): void {
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

  public getKeybindSetKey(setID: string): string {
    return `${keyPrefixKeybindSet}-${setID}`;
  }
}

class BrowserKeybindsFunctions extends KeybindsFunctionsBase {
  public getKeybindSetIDs(): string[] {
    return [];
  }

  public setKeybindSetIDs(setIDs: string[]): void {}

  public getKeybindSet(setID: string): KeybindSet | undefined {
    return undefined;
  }

  public removeKeybindSet(setID: string): void {}

  public setKeybindSet(setID: string, keybindSet: KeybindSet): void {}

  public getKeybindSetKey(setID: string): string {
    return '';
  }
}

export const impl: KeybindsFunctions & KeybindsMocks = engine.isAttached
  ? new CoherentKeybindsFunctions()
  : new BrowserKeybindsFunctions();
