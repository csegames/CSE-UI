/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../engine';
import { EventEmitter } from '../types/EventEmitter';
import { ListenerHandle } from '../listenerHandle';
import { DebugSessionConfig } from '../types/DebugSessionConfig';

export type DebugSessionConfigListener = (config: DebugSessionConfig) => void;

// client -> UI (see UIEvents.h)
const debugSessionConfigEventName = 'debugSessionConfig.update';

// todo: support writing debug session requests back to the engine
export interface DebugSessionFunctions {
  bindDebugSessionConfigListener(listener: DebugSessionConfigListener): ListenerHandle;
}

export interface DebugSessionMocks {
  triggerDebugSessionConfigUpdated(config: DebugSessionConfig): void;
}

abstract class DebugSessionFunctionsBase implements DebugSessionFunctions, DebugSessionMocks {
  private readonly events = new EventEmitter();

  bindDebugSessionConfigListener(listener: DebugSessionConfigListener): ListenerHandle {
    return this.events.on(debugSessionConfigEventName, listener);
  }

  triggerDebugSessionConfigUpdated(config: DebugSessionConfig): void {
    this.events.trigger(debugSessionConfigEventName, config);
  }
}

class CoherentDebugSessionFunctions extends DebugSessionFunctionsBase {
  bindDebugSessionConfigListener(listener: DebugSessionConfigListener): ListenerHandle {
    const mockHandle = super.bindDebugSessionConfigListener(listener);
    const engineHandle = engine.on(debugSessionConfigEventName, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }
}

class BrowserDebugSessionFunctions extends DebugSessionFunctionsBase {}

export const impl: DebugSessionFunctions & DebugSessionMocks = engine.isAttached
  ? new CoherentDebugSessionFunctions()
  : new BrowserDebugSessionFunctions();
