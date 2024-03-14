/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { LoadingScreenFunctions, impl as lsf } from '../_baseGame/clientFunctions/LoadingScreenFunctions';
import { PerfHudFunctions, impl as phf } from '../_baseGame/clientFunctions/PerfHudFunctions';

type LoadingScreenClientAPI = LoadingScreenFunctions & PerfHudFunctions;

// exposure of implementation
export const clientAPI: LoadingScreenClientAPI = {
  // LoadingScreenFunctions
  bindLoadingScreenListener: lsf.bindLoadingScreenListener.bind(lsf),
  clearManualLoadingScreen: lsf.clearManualLoadingScreen.bind(lsf),
  setLoadingScreenManually: lsf.setLoadingScreenManually.bind(lsf),
  // PerfHudFunctions
  bindDevUIListener: phf.bindDevUIListener.bind(phf),
  bindPerfHUDListener: phf.bindPerfHUDListener.bind(phf),
  setPerfHUDVisible: phf.setPerfHUDVisible.bind(phf)
};
