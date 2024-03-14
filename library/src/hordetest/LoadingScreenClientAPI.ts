/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { LoadingScreenFunctions, impl as lsf } from '../_baseGame/clientFunctions/LoadingScreenFunctions';
import { VersionFunctions, impl as ver } from '../_baseGame/clientFunctions/VersionFunctions';

type LoadingScreenClientAPI = LoadingScreenFunctions & VersionFunctions & {};

// exposure of implementation
export const clientAPI: LoadingScreenClientAPI = {
  bindLoadingScreenListener: lsf.bindLoadingScreenListener.bind(lsf),
  clearManualLoadingScreen: lsf.clearManualLoadingScreen.bind(lsf),
  setLoadingScreenManually: lsf.setLoadingScreenManually.bind(lsf),
  getBuildNumber: ver.getBuildNumber.bind(ver)
};
