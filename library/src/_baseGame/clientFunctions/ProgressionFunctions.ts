/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { engine } from '../engine';

// UI -> client (see UIViewListener.cpp)
const ApplySpecAllocationCallbackName = 'progression.ApplySpecAllocation';

export interface ProgressionTrackDelta {
  trackID: string;
  delta: number; // Whole numbers only.
}

export interface ProgressionFunctions {
  applySpecAllocation(deltas: ProgressionTrackDelta[]): void;
}

class CoherentProgressionFunctions implements ProgressionFunctions {
  applySpecAllocation(deltas: ProgressionTrackDelta[]): void {
    engine.call(ApplySpecAllocationCallbackName, deltas);
  }
}

class BrowserProgressionFunctions implements ProgressionFunctions {
  applySpecAllocation(deltas: ProgressionTrackDelta[]): void {}
}

export const impl: ProgressionFunctions = engine.isAttached
  ? new CoherentProgressionFunctions()
  : new BrowserProgressionFunctions();
