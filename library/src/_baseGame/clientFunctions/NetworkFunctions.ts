/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../engine';
import { ListenerHandle } from '../listenerHandle';
import { EventEmitter } from '../types/EventEmitter';

export type NetworkFailureListener = (errorMsg: string, errorCode: number, fatal: boolean) => void;

export interface NetworkEventMocks {
  triggerNetworkFailure(errorMsg: string, errorCode: number, fatal: boolean): void;
}

export interface NetworkFunctions {
  setInitializationComplete(): void;
  bindNetworkFailureListener(listener: NetworkFailureListener): ListenerHandle;
}

const networkFailureEventName = 'networkFailure';

class NetworkFunctionsBase implements NetworkFunctions, NetworkEventMocks {
  private readonly events = new EventEmitter();

  setInitializationComplete(): void {
    console.info('Initialization complete');
  }

  bindNetworkFailureListener(listener: NetworkFailureListener): ListenerHandle {
    return this.bindNetworkFailureInternal(listener);
  }

  triggerNetworkFailure(errorMsg: string, errorCode: number, fatal: boolean) {
    this.events.trigger(networkFailureEventName, errorMsg, errorCode, fatal);
  }

  protected bindNetworkFailureInternal(listener: NetworkFailureListener): ListenerHandle {
    return this.events.on(networkFailureEventName, listener);
  }
}

class CoherentNetworkFunctions extends NetworkFunctionsBase {
  override setInitializationComplete(): void {
    super.setInitializationComplete();
    engine.trigger('OnReadyForDisplay');
  }

  protected override bindNetworkFailureInternal(listener: NetworkFailureListener): ListenerHandle {
    const jsHandle = super.bindNetworkFailureInternal(listener);
    const engineHandle = engine.on(networkFailureEventName, listener);
    return {
      close() {
        jsHandle.close();
        engineHandle.clear();
      }
    };
  }
}

class BrowserNetworkFunctions extends NetworkFunctionsBase {}

export const impl: NetworkFunctions & NetworkEventMocks = engine.isAttached
  ? new CoherentNetworkFunctions()
  : new BrowserNetworkFunctions();
