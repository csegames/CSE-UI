/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../../_baseGame/engine';
import { Dictionary } from '../../_baseGame/types/ObjectMap';
import Store from '../../_baseGame/utils/local-storage';

// All valid keys for use with this local store should be defined here.
const keyLobbyHasSeenTutorial = 'HasSeenTutorial';

export interface RuneModsFunctions {
  getHasSeenRuneModsTutorial(): boolean;
  setHasSeenRuneModsTutorial(value: boolean): void;
}

export interface RuneModsMocks {}

abstract class RuneModsFunctionsBase implements RuneModsFunctions, RuneModsMocks {
  abstract getHasSeenRuneModsTutorial(): boolean;
  abstract setHasSeenRuneModsTutorial(value: boolean): void;
}

class CoherentRuneModsFunctions extends RuneModsFunctionsBase {
  private store = new Store('FSRRuneMods');

  public getHasSeenRuneModsTutorial(): boolean {
    return this.store.get<boolean>(keyLobbyHasSeenTutorial) ?? false;
  }

  public setHasSeenRuneModsTutorial(value: boolean): void {
    this.store.set(keyLobbyHasSeenTutorial, value);
  }
}

class BrowserRuneModsFunctions extends RuneModsFunctionsBase {
  public getHasSeenRuneModsTutorial(): boolean {
    return false;
  }

  public setHasSeenRuneModsTutorial(value: boolean): void {}
}

export const impl: RuneModsFunctions & RuneModsMocks = engine.isAttached
  ? new CoherentRuneModsFunctions()
  : new BrowserRuneModsFunctions();
