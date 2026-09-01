/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../../_baseGame/engine';
import { EventEmitter } from '../../_baseGame/types/EventEmitter';
import { ListenerHandle } from '../../_baseGame/listenerHandle';
import { CharacterClassDef, CharacterRaceDef } from '../../hordetest/game/types/CharacterDef';
import { ManifestDef } from '../../camelotunchained/graphql/schema';

export type CharacterClassDefsListener = (defs: CharacterClassDef[]) => void;
export type CharacterRaceDefsListener = (defs: CharacterRaceDef[]) => void;
export type ManifestDefsListener = (defs: ManifestDef[]) => void;

// client -> UI (see UIEvents.h)
const characterClassDefsEventName = 'class.defsLoaded';
const characterRaceDefsEventName = 'race.defsLoaded';
const manifestDefsEventName = 'manifest.defsLoaded';

export interface DefFunctions {
  bindCharacterClassDefsListener(listener: CharacterClassDefsListener): ListenerHandle;
  bindCharacterRaceDefsListener(listener: CharacterRaceDefsListener): ListenerHandle;
  bindManifestDefsListener(listener: ManifestDefsListener): ListenerHandle;
}

export interface DefMocks {
  triggerCharacterClassDefsLoaded(defs: CharacterClassDef[]): void;
  triggerCharacterRaceDefsLoaded(defs: CharacterRaceDef[]): void;
  triggerManifestDefsLoaded(defs: ManifestDef[]): void;
}

abstract class DefFunctionsBase implements DefFunctions, DefMocks {
  private readonly events = new EventEmitter();

  bindCharacterClassDefsListener(listener: CharacterClassDefsListener): ListenerHandle {
    return this.events.on(characterClassDefsEventName, listener);
  }
  bindCharacterRaceDefsListener(listener: CharacterRaceDefsListener): ListenerHandle {
    return this.events.on(characterRaceDefsEventName, listener);
  }
  bindManifestDefsListener(listener: ManifestDefsListener): ListenerHandle {
    return this.events.on(manifestDefsEventName, listener);
  }

  triggerCharacterClassDefsLoaded(defs: CharacterClassDef[]): void {
    this.events.trigger(characterClassDefsEventName, defs);
  }

  triggerCharacterRaceDefsLoaded(defs: CharacterRaceDef[]): void {
    this.events.trigger(characterRaceDefsEventName, defs);
  }

  triggerManifestDefsLoaded(defs: ManifestDef[]): void {
    this.events.trigger(manifestDefsEventName, defs);
  }
}

class CoherentDefFunctions extends DefFunctionsBase {
  bindCharacterClassDefsListener(listener: CharacterClassDefsListener): ListenerHandle {
    const mockHandle = super.bindCharacterClassDefsListener(listener);
    const engineHandle = engine.on(characterClassDefsEventName, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }

  bindCharacterRaceDefsListener(listener: CharacterRaceDefsListener): ListenerHandle {
    const mockHandle = super.bindCharacterRaceDefsListener(listener);
    const engineHandle = engine.on(characterRaceDefsEventName, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }

  bindManifestDefsListener(listener: ManifestDefsListener): ListenerHandle {
    const mockHandle = super.bindManifestDefsListener(listener);
    const engineHandle = engine.on(manifestDefsEventName, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }
}

class BrowserDefFunctions extends DefFunctionsBase {}

export const impl: DefFunctions & DefMocks = engine.isAttached ? new CoherentDefFunctions() : new BrowserDefFunctions();
