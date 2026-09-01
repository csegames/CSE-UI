/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../../_baseGame/engine';
import { ListenerHandle } from '../listenerHandle';
import { EventEmitter } from '../types/EventEmitter';

export type CharacterUpdatedListener = (characterID: string) => void;

// client -> UI with return (see UIViewListener.cpp)
const charaterUpdatedEventName = 'character.updated';
const setCharacterFunctionName = 'auth.SetCharacter';

export interface AuthFunctions {
  bindCharacterUpdatedListener(listener: CharacterUpdatedListener): ListenerHandle;
  setCharacter(characterID: string): Promise<boolean>;
}

export interface AuthMocks {
  triggerCharacterUpdated(characterID: string): void;
}

abstract class AuthFunctionsBase implements AuthFunctions, AuthMocks {
  private readonly events = new EventEmitter();

  public bindCharacterUpdatedListener(listener: CharacterUpdatedListener): ListenerHandle {
    return this.events.on(charaterUpdatedEventName, listener);
  }

  public abstract setCharacter(characterID: string): Promise<boolean>;

  public triggerCharacterUpdated(characterID: string): void {
    this.events.trigger(charaterUpdatedEventName, characterID);
  }
}

class CoherentAuthFunctions extends AuthFunctionsBase {
  public override bindCharacterUpdatedListener(listener: CharacterUpdatedListener): ListenerHandle {
    const mockHandle = super.bindCharacterUpdatedListener(listener);
    const engineHandle = engine.on(charaterUpdatedEventName, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }

  public override setCharacter(characterID: string): Promise<boolean> {
    return engine.call(setCharacterFunctionName, characterID);
  }
}

class BrowserAuthFunctions extends AuthFunctionsBase {
  public override setCharacter(characterID: string): Promise<boolean> {
    this.triggerCharacterUpdated(characterID);
    return Promise.resolve(true);
  }
}

export const impl: AuthFunctions & AuthMocks = engine.isAttached
  ? new CoherentAuthFunctions()
  : new BrowserAuthFunctions();
