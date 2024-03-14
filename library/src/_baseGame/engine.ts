/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import returned, { Engine, ListenerHandle } from '@csegames/coherent';

// Allow only this file to read the global
declare global {
  interface Window {
    engine: Engine;
  }
}

const engine: Engine = returned || window.engine;
if (engine === undefined) {
  // the engine should load even if we're not attached to a client
  throw new Error('Unable to continue because coherent engine loading failed');
}

export { engine, ListenerHandle as EngineHandle };
