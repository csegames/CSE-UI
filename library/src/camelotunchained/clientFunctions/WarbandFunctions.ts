/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../../_baseGame/engine';
import { ListenerHandle } from '../../_baseGame/listenerHandle';
import { EventEmitter } from '../../_baseGame/types/EventEmitter';
import { WarbandSnapshot } from '../game/GameClientModels/WarbandSnapshot';

const warbandUpdatedEvent = 'warband.updated';

export type WarbandListener = (warband: WarbandSnapshot) => void;

export interface WarbandMocks {
  triggerWarbandUpdated(warband: WarbandSnapshot): void;
}

export interface WarbandFunctions {
  bindWarbandListener(listener: WarbandListener): ListenerHandle;
}

class WarbandFunctionsBase implements WarbandFunctions, WarbandMocks {
  private readonly events = new EventEmitter();

  bindWarbandListener(listener: WarbandListener): ListenerHandle {
    return this.events.on(warbandUpdatedEvent, listener);
  }
  triggerWarbandUpdated(warband: WarbandSnapshot): void {
    this.events.trigger(warbandUpdatedEvent, warband);
  }
}

class CoherentWarbandFunctions extends WarbandFunctionsBase {
  bindWarbandListener(listener: WarbandListener): ListenerHandle {
    const mockHandle = super.bindWarbandListener(listener);
    const engineHandle = engine.on(warbandUpdatedEvent, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }
}

class BrowserWarbandFunctions extends WarbandFunctionsBase {}

export const impl: WarbandFunctions & WarbandMocks = engine.isAttached
  ? new CoherentWarbandFunctions()
  : new BrowserWarbandFunctions();
