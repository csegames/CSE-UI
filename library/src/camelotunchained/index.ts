/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import initGameInterface from './game/initGameInterface';
import { CamelotUnchainedModel } from './game/CamelotUnchainedModel';
import { _devGame, loadGame } from '../_baseGame';
import { engine } from '../_baseGame/engine';

/**
 * Initializes the game client <-> UI communication layer.
 * This method should be called before the initial React render call.
 */
const loadPromise = loadGame().then(() => {
  if (camelot) {
    throw new Error('hordetest initialization has run twice, which should no longer be possible');
  }
  if (!_devGame) {
    throw new Error('out-of-order initialization between base game and hordetest detected');
  }
  camelot = initGameInterface(_devGame);
  return camelot;
});

export var camelot: CamelotUnchainedModel;
export function loadCamelot(): Promise<CamelotUnchainedModel> {
  return loadPromise;
}
