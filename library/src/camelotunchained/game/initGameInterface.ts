/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import * as webAPI from '../webAPI/definitions';

import { GameInterface } from './GameInterface';

import initOfflineZoneSelectState from './GameClientModels/OfflineZoneSelectState';
import { Keybind, KeybindSection } from '../../_baseGame/types/Keybind';
import { CamelotUnchainedModel } from './CamelotUnchainedModel';
import { BaseDevGameInterface } from '../../_baseGame/BaseGameInterface';
import { cloneDeep } from '../../_baseGame/utils/objectUtils';

export default function (_devGame: BaseDevGameInterface): CamelotUnchainedModel {
  // TODO : I hear constructors are nice (and safer than this)
  const camelotGame = {} as GameInterface;

  const camelot = {
    _devGame: camelotGame,
    game: camelotGame
  };

  camelotGame.webAPI = webAPI;
  camelotGame.getKeybindSafe = (id: number) => getKeybindSafe(_devGame, id);

  // INIT MODELS
  initOfflineZoneSelectState(_devGame, camelot);

  return camelot;
}

function getKeybindSafe(_devGame: BaseDevGameInterface, id: number): Keybind {
  if (_devGame.keybinds[id]) {
    return cloneDeep(_devGame.keybinds[id]) as Keybind;
  }
  return {
    id,
    description: 'unknown',
    category: 'miscellaneous',
    section: KeybindSection.None,
    order: 0,
    binds: [
      { name: '', value: 0 },
      { name: '', value: 0 },
      { name: '', value: 0 }
    ]
  };
}
