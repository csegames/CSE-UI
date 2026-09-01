/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { DebugHintFunctions, impl as dhf } from '../_baseGame/clientFunctions/DebugHintFunctions';
import { PerfHudFunctions, impl as phf } from '../_baseGame/clientFunctions/PerfHudFunctions';

// exposure of implementation
export const clientAPI: PerfHudFunctions & DebugHintFunctions = {
  // DebugHintFunctions
  getDebugHints: dhf.getDebugHints.bind(dhf),
  // PerfHudFunctions
  bindDevUIListener: phf.bindDevUIListener.bind(phf),
  bindPerfHUDListener: phf.bindPerfHUDListener.bind(phf),
  setPerfHUDVisible: phf.setPerfHUDVisible.bind(phf)
};
