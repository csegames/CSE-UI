/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 */

import { webAPI } from '@csegames/camelot-unchained';

declare const toastr: any;

export async function inviteToTrade(targetID: string) {
  try {
    const res = await webAPI.SecureTradeAPI.Invite(
      webAPI.defaultConfig,
      game.shardID,
      game.selfPlayerState.characterID,
      targetID,
    );

    if (!res.ok) {
      const resultData = typeof res.data === 'string' ? JSON.parse(res.data) : res.data;
      if (resultData && resultData.FieldCodes && resultData.FieldCodes[0]) {
        toastr.error(resultData.FieldCodes[0].Message, 'Oh No!!', { timeout: 3000 });
      }
    }
  } catch (e) {
    console.error(e);
  }
}
