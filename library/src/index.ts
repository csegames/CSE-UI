/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

// Import definitions first to init a whole bunch of globals
import './webAPI/definitions';
import './_baseGame/chat/chatProtoTypes';
export * from './_baseGame';

import * as camelotunchained from './camelotunchained';
import * as hordetest from './hordetest';

export {
  camelotunchained,
  hordetest,
};
