/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../engine';
import { ListenerHandle } from '../listenerHandle';
import { PerformanceWarningsModel } from '../types/PerformanceWarnings';
import { EventEmitter } from '../types/EventEmitter';

export type PerformanceWarningsListener = (performanceWarnings: PerformanceWarningsModel) => void;

export interface PerformanceWarningsMocks {
  triggerPerformanceWarnings(performanceWarnings: PerformanceWarningsModel): void;
}

export interface PerformanceWarningsFunctions {
  bindPerformanceWarningsListener(listener: PerformanceWarningsListener): ListenerHandle;
}

const performanceWarningsEventName = 'performanceWarningsUpdate';

class PerformanceWarningsFunctionsBase implements PerformanceWarningsFunctions, PerformanceWarningsMocks {
  private readonly events = new EventEmitter();

  bindPerformanceWarningsListener(listener: PerformanceWarningsListener): ListenerHandle {
    return this.events.on(performanceWarningsEventName, listener);
  }
  triggerPerformanceWarnings(performanceWarnings: PerformanceWarningsModel) {
    this.events.trigger(performanceWarningsEventName, performanceWarnings);
  }
}

class CoherentPerformanceWarningsFunctions extends PerformanceWarningsFunctionsBase {
  bindPerformanceWarningsListener(listener: PerformanceWarningsListener): ListenerHandle {
    const mockHandle = super.bindPerformanceWarningsListener(listener);
    const engineHandle = engine.on(performanceWarningsEventName, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }
}

class BrowserPerformanceWarningsFunctions extends PerformanceWarningsFunctionsBase {}

export const impl: PerformanceWarningsFunctions & PerformanceWarningsMocks = engine.isAttached
  ? new CoherentPerformanceWarningsFunctions()
  : new BrowserPerformanceWarningsFunctions();
