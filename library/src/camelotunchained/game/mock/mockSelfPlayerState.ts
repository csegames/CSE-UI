
/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

/// <reference> ../coherent.d.ts
import { SelfPlayer_Update } from '../GameClientModels/PlayerState';

export function mockSelfPlayerState() {
  if (process.env.CUUI_ENABLE_SELF_PLAYER_STATE_MOCK) {
    console.log('MOCK.selfPlayerState', 'initialize');
    // _devcamelotunchained.game.selfPlayerState.name = 'Player Name';
    // _devcamelotunchained.game.selfPlayerState.faction = Faction.Arthurian;
    // _devcamelotunchained.game.selfPlayerState.position = {
    //   x: 0,
    //   y: 0,
    //   z: 0,
    // };
    // _devcamelotunchained.game.selfPlayerState.facing = { yaw: 0, pitch: 0 };
    // _devcamelotunchained.game.selfPlayerState.cameraFacing = { yaw: 0, pitch: 0 };
    // engine.trigger(SelfPlayer_Update, _devcamelotunchained.game.selfPlayerState);
    console.log('MOCK.selfPlayerState', camelotunchained._devGame.selfPlayerState,
      camelotunchained.game.selfPlayerState.name);
  }
}
