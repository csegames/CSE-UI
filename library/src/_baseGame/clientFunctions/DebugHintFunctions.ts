/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../engine';
import { DebugHints } from '../GameClientModels/DebugHints';

// Allow (only) this code to check for global injection from coherent
// TODO : pass DebugHints as part of the Ready event
declare global {
  interface Window {
    debugHints?: DebugHints;
  }
}

const hintDefaults: DebugHints = {
  drawNameplateGrids: false,
  verboseAPIErrors: false
};

export interface DebugHintFunctions {
  getDebugHints(): DebugHints;
}

class CoherentDebugHintFunctions {
  getDebugHints(): DebugHints {
    return window.debugHints ?? hintDefaults;
  }
}

class BrowserDebugHintFunctions {
  getDebugHints(): DebugHints {
    return hintDefaults;
  }
}

export const impl: DebugHintFunctions = engine.isAttached
  ? new CoherentDebugHintFunctions()
  : new BrowserDebugHintFunctions();
