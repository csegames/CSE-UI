/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { DebugHintFunctions, impl as dhf } from '../_baseGame/clientFunctions/DebugHintFunctions';

export type WorldSpaceClientAPI = DebugHintFunctions;

export const clientAPI: WorldSpaceClientAPI = {
  // DebugHintFunctions
  getDebugHints: dhf.getDebugHints.bind(dhf)
};
