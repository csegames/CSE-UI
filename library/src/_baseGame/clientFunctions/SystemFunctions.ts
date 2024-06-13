/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../../_baseGame/engine';

// UI -> client (see UIViewListener.cpp)
const openBrowserCallbackName = 'system.OpenBrowser';

export interface SystemFunctions {
  openBrowser(url: string): void;
}

export interface SystemMocks {}

abstract class SystemFunctionsBase implements SystemFunctions, SystemMocks {
  abstract openBrowser(url: string): void;
}

class CoherentSystemFunctions extends SystemFunctionsBase {
  openBrowser(url: string): void {
    engine.trigger(openBrowserCallbackName, url);
  }
}

class BrowserSystemFunctions extends SystemFunctionsBase {
  openBrowser(url: string): void {}
}

export const impl: SystemFunctions & SystemMocks = engine.isAttached
  ? new CoherentSystemFunctions()
  : new BrowserSystemFunctions();
