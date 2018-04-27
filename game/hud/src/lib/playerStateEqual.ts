/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import * as _ from 'lodash';
import { PlayerState } from '@csegames/camelot-unchained';

export function isEqualPlayerState(playerStateOne: PlayerState, playerStateTwo: PlayerState) {
  if (!playerStateOne || !playerStateTwo) {
    return false;
  }
  return playerStateOne.id === playerStateTwo.id &&
    _.isEqual(playerStateOne.health, playerStateTwo.health) &&
    _.isEqual(playerStateOne.stamina, playerStateTwo.stamina) &&
    _.isEqual(playerStateOne.blood, playerStateTwo.blood) &&
    _.isEqual(playerStateOne.statuses, playerStateTwo.statuses) &&
    playerStateOne.isAlive !== playerStateTwo.isAlive;
}