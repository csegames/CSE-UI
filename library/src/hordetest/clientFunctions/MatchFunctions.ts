/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../../_baseGame/engine';
import { ListenerHandle } from '../../_baseGame/listenerHandle';
import { EventEmitter } from '../../_baseGame/types/EventEmitter';

export type DefaultQueueListener = (queueID: string) => void;

export interface MatchMocks {
  triggerDefaultQueue(queueID: string): void;
}

export interface MatchFunctions {
  bindDefaultQueueListener(listener: DefaultQueueListener): ListenerHandle;
}

const defaultQueueListener = 'defaultQueue.update';

class MatchFunctionsBase implements MatchFunctions, MatchMocks {
  private readonly events = new EventEmitter();

  bindDefaultQueueListener(listener: DefaultQueueListener): ListenerHandle {
    return this.events.on(defaultQueueListener, listener);
  }
  triggerDefaultQueue(queueID: string): void {
    this.events.trigger(defaultQueueListener, queueID);
  }
}

class CoherentMatchFunctions extends MatchFunctionsBase {
  override bindDefaultQueueListener(listener: DefaultQueueListener): ListenerHandle {
    const mockHandle = super.bindDefaultQueueListener(listener);
    const engineHandle = engine.on(defaultQueueListener, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }
}

class BrowserMatchFunctions extends MatchFunctionsBase {}

export const impl: MatchFunctions & MatchMocks = engine.isAttached
  ? new CoherentMatchFunctions()
  : new BrowserMatchFunctions();
