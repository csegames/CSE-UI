/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import initGameInterface from './game/initGameInterface';
import { HordeTestModel } from './game/HordeTestModel';
import { _devGame, loadGame } from '../_baseGame';

/**
 * Initializes the game client <-> UI communication layer.
 * This method should be called before the initial React render call.
 */
const loadPromise = loadGame().then(() => {
  if (hordetest) {
    throw new Error('hordetest initialization has run twice, which should no longer be possible');
  }
  if (!_devGame) {
    throw new Error('out-of-order initialization between base game and hordetest detected');
  }
  hordetest = initGameInterface(_devGame);
  return hordetest;
});

export var hordetest: HordeTestModel;
export function loadHordetest(): Promise<HordeTestModel> {
  return loadPromise;
}
