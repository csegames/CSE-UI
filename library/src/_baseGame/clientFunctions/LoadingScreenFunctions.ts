/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../engine';
import { ListenerHandle } from '../listenerHandle';
import { HintDef } from '../types/HintDef';
import { Dictionary } from '../types/ObjectMap';

// INTERFACE

// see UILoadingScreenState.h
export enum LoadingScreenReason {
  Initialization,
  Game
}

// see UIAPIBindings.h
export interface LoadingScreenState {
  reason: LoadingScreenReason;
  message: string;
  visible: boolean;
  hints?: Dictionary<HintDef>;
}

export type LoadingScreenListener = (state: LoadingScreenState) => void;

export interface LoadingScreenFunctions {
  setLoadingScreenManually(
    reason: LoadingScreenReason,
    message: string,
    timeout?: number,
    onTimeout?: () => void
  ): boolean;
  clearManualLoadingScreen(reason: LoadingScreenReason): boolean;
  bindLoadingScreenListener(onUpdate: LoadingScreenListener): ListenerHandle;
}

// IMPLEMENTATION

interface StateEntry {
  isManual: boolean;
  state: LoadingScreenState;
}

// base implementation - partial logic not actually handled by native code
abstract class LoadingScreenFunctionsBase implements LoadingScreenFunctions {
  private nextHandle: number = 1;
  private listeners: Dictionary<LoadingScreenListener> = {};
  private forcedDisplayTimeouts: Dictionary<number> = {};
  private entries: Dictionary<StateEntry> = {};

  setLoadingScreenManually(
    reason: LoadingScreenReason,
    message: string,
    timeout?: number,
    onTimeout?: () => void
  ): boolean {
    const entry = this.entries[reason];
    if (entry && !entry.isManual && entry.state.visible) return false; // don't override real entries
    this.sendUpdate({ message, visible: true, reason, hints: {} }, true);
    this.setManualScreenTimeout(reason, timeout, onTimeout);
    return true;
  }

  clearManualLoadingScreen(reason: LoadingScreenReason): boolean {
    const entry = this.entries[reason];
    if (!entry || !entry.isManual) return false;
    this.sendUpdate({ message: '', visible: false, reason }, false);
    return true;
  }

  bindLoadingScreenListener(onUpdate: LoadingScreenListener): ListenerHandle {
    const handle = this.nextHandle.toString();
    ++this.nextHandle;
    this.listeners[handle] = onUpdate;
    setTimeout(() => {
      // show existing loading screens once binding has completed
      for (const entry of Object.values(this.entries)) {
        if (entry.state.visible) {
          onUpdate(entry.state);
        }
      }
    }, 0);
    return {
      close() {
        if (this.listeners) {
          delete this.listeners[handle];
        }
      }
    };
  }

  protected sendUpdate(state: LoadingScreenState, isManual: boolean): void {
    this.clearManualScreenTimeout(state.reason);
    this.entries[state.reason] = { state, isManual };

    if (!state.visible) {
      // if we mark one load reason invisible, check for others
      for (const entry of Object.values(this.entries)) {
        if (entry.state.visible) {
          state = entry.state;
        }
      }
    }
    for (const listener of Object.values(this.listeners)) {
      listener(state);
    }
  }

  private clearManualScreenTimeout(reason: LoadingScreenReason): void {
    if (this.forcedDisplayTimeouts[reason]) {
      window.clearInterval(this.forcedDisplayTimeouts[reason]);
      delete this.forcedDisplayTimeouts[reason];
    }
  }

  private setManualScreenTimeout(reason: LoadingScreenReason, timeout?: number, onTimeout?: () => void): void {
    if (timeout && onTimeout) {
      this.forcedDisplayTimeouts[reason] = window.setInterval(onTimeout, timeout);
    }
  }
}

// full engine implementation -- should only reference engine.on() and engine.trigger()
class CoherentLoadingScreenFunctions extends LoadingScreenFunctionsBase {
  constructor() {
    super();
    engine.on('loadingState.update', (state: LoadingScreenState) => this.sendUpdate(state, false));
  }
}

class BrowserLoadingScreenFunctions extends LoadingScreenFunctionsBase {
  constructor() {
    super();
    setTimeout(
      () =>
        this.setLoadingScreenManually(LoadingScreenReason.Initialization, 'Initializing', 3000, () =>
          this.clearManualLoadingScreen(LoadingScreenReason.Initialization)
        ),
      0
    );
  }
}

export const impl: LoadingScreenFunctions = engine.isAttached
  ? new CoherentLoadingScreenFunctions()
  : new BrowserLoadingScreenFunctions();
