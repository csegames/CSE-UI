/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { DevGameInterface } from './GameInterface';
import { initPlayerState } from './GameClientModels/PlayerState';
import { initEntityState } from './GameClientModels/EntityState';
import { initConsumableItemsState } from './GameClientModels/ConsumableItemsState';
import { HordeTestModel } from './HordeTestModel';
import { initEventForwarding } from './engineEvents';
import { BaseDevGameInterface } from '../../_baseGame/BaseGameInterface';

export default function (_devGame: BaseDevGameInterface): HordeTestModel {
  if (!_devGame.isClientAttached) {
    // don't debug colossus endpoints against a camelot server
    _devGame.webAPIHost = 'https://omeletteapi.camelotunchained.com';
  }

  // TODO : I hear constructors are nice (and safer than this)
  const hordeGame = {} as DevGameInterface;

  const hordetest = {
    _devGame: hordeGame,
    game: hordeGame
  };
  initEventForwarding(hordeGame, _devGame);

  // Entity state
  hordeGame.entities = {};
  initEntityState(_devGame);

  // INIT MODELS
  initPlayerState(_devGame, hordetest);
  initConsumableItemsState(_devGame, hordetest);

  return hordetest;
}
