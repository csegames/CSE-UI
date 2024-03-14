/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../engine';
import { ListenerHandle } from '../listenerHandle';

export interface VersionFunctions {
  getBuildNumber(): Promise<number>;
}

const getBuildNumberCallbackName = 'GetBuildNumber';

class CoherentVersionFunctions implements VersionFunctions {
    getBuildNumber(): Promise<number> {
        return engine.call(getBuildNumberCallbackName);
    }
}

class BrowserVersionFunctions implements VersionFunctions {
    getBuildNumber(): Promise<number> {
        return Promise.resolve(0);
    }
}

export const impl: VersionFunctions = engine.isAttached
  ? new CoherentVersionFunctions()
  : new BrowserVersionFunctions();
