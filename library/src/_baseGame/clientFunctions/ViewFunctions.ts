/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../engine';
import { ListenerHandle } from '../listenerHandle';
import { EventEmitter } from '../types/EventEmitter';

export type NotificationListener = () => void;
export type NavigateListener = (name: string) => void;

export interface ViewEventMocks {
  triggerNavigate(name: string): void;
}

export interface ViewFunctions {
  setInitializationComplete(): void;
  bindNavigateListener(listener: NotificationListener, name: string): ListenerHandle;
  bindNavigateListener(listener: NavigateListener): ListenerHandle;
}

const navigateEventName = 'navigate';

class ViewFunctionsBase implements ViewFunctions, ViewEventMocks {
  private readonly events = new EventEmitter();

  setInitializationComplete(): void {
    console.info('Initialization complete');
  }

  bindNavigateListener(listener: NavigateListener | NotificationListener, name?: string): ListenerHandle {
    if (name === undefined) {
      return this.bindNavigateInternal(listener);
    }
    return this.bindNavigateInternal((ev) => {
      if (ev === name) (listener as NotificationListener)();
    });
  }

  triggerNavigate(name: string): void {
    this.events.trigger(navigateEventName, name);
  }

  protected bindNavigateInternal(listener: NavigateListener): ListenerHandle {
    return this.events.on(navigateEventName, listener);
  }
}

class CoherentViewFunctions extends ViewFunctionsBase {
  override setInitializationComplete(): void {
    super.setInitializationComplete();
    engine.trigger('OnReadyForDisplay');
  }

  protected override bindNavigateInternal(listener: NavigateListener): ListenerHandle {
    const jsHandle = super.bindNavigateInternal(listener);
    const engineHandle = engine.on(navigateEventName, listener);
    return {
      close() {
        jsHandle.close();
        engineHandle.clear();
      }
    };
  }
}

class BrowserViewFunctions extends ViewFunctionsBase {}

export const impl: ViewFunctions & ViewEventMocks = engine.isAttached
  ? new CoherentViewFunctions()
  : new BrowserViewFunctions();
