/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../../_baseGame/engine';

// UI -> client (see UIViewListener.cpp)
const OpenBrowserCallbackName = 'system.OpenBrowser';
const QuitCallbackName = 'system.quit';
const ReloadUICallbackName = 'system.reloadUI';
const RequestAddImageToCacheCallbackName = 'system.requestAddImageToCache';
const RequestRemoveImageFromCacheCallbackName = 'system.requestRemoveImageFromCache';

export interface SystemFunctions {
  openBrowser(topic: string, arg?: string): void;
  quit(): void;
  reloadUI(): void;
  requestAddImageToCache(url: string);
  requestRemoveImageFromCache(url: string);
}

class CoherentSystemFunctions implements SystemFunctions {
  openBrowser(topic: string, arg?: string): void {
    if (arg) {
      engine.trigger(OpenBrowserCallbackName, topic, arg);
    } else {
      engine.trigger(OpenBrowserCallbackName, topic);
    }
  }
  quit(): void {
    engine.trigger(QuitCallbackName);
  }
  reloadUI(): void {
    engine.trigger(ReloadUICallbackName);
  }
  requestAddImageToCache(url: string) {
    engine.trigger(RequestAddImageToCacheCallbackName, url);
  }
  requestRemoveImageFromCache(url: string) {
    engine.trigger(RequestRemoveImageFromCacheCallbackName, url);
  }
}

class BrowserSystemFunctions implements SystemFunctions {
  openBrowser(topic: string, arg?: string): void {
    // simulating the window properly would require calling the shardAPI
    // and we don't have the configuration in context here
    alert(`External link requested: ${topic},${arg}`);
  }
  quit(): void {
    alert('Quit requested');
  }
  reloadUI(): void {
    window.location.reload();
  }
  requestAddImageToCache(url: string) {}
  requestRemoveImageFromCache(url: string) {}
}

export const impl: SystemFunctions = engine.isAttached ? new CoherentSystemFunctions() : new BrowserSystemFunctions();
