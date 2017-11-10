/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { Promise } from 'es6-promise';
import * as RestClientLegacy from './../RestClientLegacy';

// Control Game
export function getControlGame(includeControlPoints: boolean = false) {
  return RestClientLegacy.getJSON('game/controlgame', false, { includeControlPoints });
}

// Spawn Points
export function getSpawnPoints() {
  return RestClientLegacy.getJSON('game/spawnpoints');
}
