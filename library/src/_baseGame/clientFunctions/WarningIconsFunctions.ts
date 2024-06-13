/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../engine';
import { ListenerHandle } from '../listenerHandle';
import { WarningIconsModel } from '../types/WarningIcons';
import { EventEmitter } from '../types/EventEmitter';

export type WarningIconsListener = (warningIcons: WarningIconsModel) => void;

export interface WarningIconsMocks {
  triggerWarningIcons(warningIcons: WarningIconsModel): void;
}

export interface WarningIconsFunctions {
  bindWarningIconsListener(listener: WarningIconsListener): ListenerHandle;
}

const warningIconsEventName = 'warningIconsUpdate';

class WarningIconsFunctionsBase implements WarningIconsFunctions, WarningIconsMocks {
  private readonly events = new EventEmitter();

  bindWarningIconsListener(listener: WarningIconsListener): ListenerHandle {
    return this.events.on(warningIconsEventName, listener);
  }
  triggerWarningIcons(warningIcons: WarningIconsModel) {
    this.events.trigger(warningIconsEventName, warningIcons);
  }
}

class CoherentWarningIconsFunctions extends WarningIconsFunctionsBase {
  bindWarningIconsListener(listener: WarningIconsListener): ListenerHandle {
    const mockHandle = super.bindWarningIconsListener(listener);
    const engineHandle = engine.on(warningIconsEventName, listener);
    return {
      close() {
        mockHandle.close();
        engineHandle.clear();
      }
    };
  }
}

class BrowserWarningIconsFunctions extends WarningIconsFunctionsBase {}

export const impl: WarningIconsFunctions & WarningIconsMocks = engine.isAttached
  ? new CoherentWarningIconsFunctions()
  : new BrowserWarningIconsFunctions();
