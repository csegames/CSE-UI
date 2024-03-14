/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../engine';
import { ListenerHandle } from '../listenerHandle';
import { ClientPerformanceStats } from '../types/ClientPerformanceStats';
import { EventEmitter } from '../types/EventEmitter';

export type ClientPerformanceListener = (stats: ClientPerformanceStats) => void;

export interface ClientPerformanceMocks {
  triggerClientPerformanceStats(stats: ClientPerformanceStats): void;
}

export interface ClientPerformanceFunctions {
  bindClientPerformanceListener(listener: ClientPerformanceListener): ListenerHandle;
}

const performanceEventName = 'clientPerformanceStatsUpdate';

class ClientPerformanceFunctionsBase implements ClientPerformanceFunctions, ClientPerformanceMocks {
  private readonly events = new EventEmitter();

  bindClientPerformanceListener(listener: ClientPerformanceListener): ListenerHandle {
    return this.events.on(performanceEventName, listener);
  }
  triggerClientPerformanceStats(stats: ClientPerformanceStats) {
    this.events.trigger(performanceEventName, stats);
  }
}

class CoherentClientPerformanceFunctions extends ClientPerformanceFunctionsBase {
  bindClientPerformanceListener(listener: ClientPerformanceListener): ListenerHandle {
    const mockHandle = super.bindClientPerformanceListener(listener);
    const engineHandle = engine.on(performanceEventName, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }
}

class BrowserClientPerformanceFunctions extends ClientPerformanceFunctionsBase {}

export const impl: ClientPerformanceFunctions & ClientPerformanceMocks = engine.isAttached
  ? new CoherentClientPerformanceFunctions()
  : new BrowserClientPerformanceFunctions();
