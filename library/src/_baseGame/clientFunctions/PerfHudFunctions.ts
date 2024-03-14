/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { RootPageModel } from '../../devUI/RootPageModel';
import { engine } from '../engine';
import { ListenerHandle } from '../listenerHandle';

export type PerfHudListener = (pages: string, visible: boolean) => void;
export type DevUIListener = (id: string, page: RootPageModel | string) => void;

export interface PerfHudFunctions {
  bindDevUIListener(listener: DevUIListener): ListenerHandle;
  bindPerfHUDListener(listener: PerfHudListener): ListenerHandle;
  setPerfHUDVisible(visible: boolean): void;
}

class CoherentPerfHudFunctions implements PerfHudFunctions {
  setPerfHUDVisible(visible: boolean): void {
    engine.trigger('ShowPerfHUD', visible);
  }
  bindPerfHUDListener(listener: PerfHudListener): ListenerHandle {
    const innerHandle = engine.on('perfhud.update', listener);
    return {
      close() {
        innerHandle.clear();
      }
    };
  }
  bindDevUIListener(listener: DevUIListener): ListenerHandle {
    const innerHandle = engine.on('updateDevUI', listener);
    return {
      close() {
        innerHandle.clear();
      }
    };
  }
}

class BrowserPerfHudFunctions implements PerfHudFunctions {
  setPerfHUDVisible(visible: boolean): void {}
  bindPerfHUDListener(listener: PerfHudListener): ListenerHandle {
    return { close() {} };
  }
  bindDevUIListener(listener: DevUIListener): ListenerHandle {
    return { close() {} };
  }
}

export const impl: PerfHudFunctions = engine.isAttached
  ? new CoherentPerfHudFunctions()
  : new BrowserPerfHudFunctions();
