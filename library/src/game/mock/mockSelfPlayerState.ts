
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/// <reference> ../coherent.d.ts
import { SelfPlayer_Update } from '../GameClientModels/PlayerState';

export function mockSelfPlayerState() {
  console.log('MOCK.selfPlayerState', 'initialize');
  _devGame.selfPlayerState.name = 'Player Name';
  _devGame.selfPlayerState.position = {
    x: 0,
    y: 0,
    z: 0,
  };
  _devGame.selfPlayerState.facing = 0;
  engine.trigger(SelfPlayer_Update, _devGame.selfPlayerState);
  console.log('MOCK.selfPlayerState', _devGame.selfPlayerState, game.selfPlayerState.name);
}
