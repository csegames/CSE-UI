/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { game } from '@csegames/library/dist/_baseGame';
import { RequestConfig } from '@csegames/library/dist/_baseGame/types/Request';

export const networkConfigurationState = {
  shardID: 0
};

function combine(url: string, path: string): string | null {
  if (!url) return null;
  if (url.endsWith('/')) return url + path;
  return url + '/' + path;
}

export const webConf: RequestConfig = () => {
  return {
    url: combine(game.webAPIHost, '') ?? '',
    headers: {
      Authorization: `Bearer ${game.accessToken}`,
      shardID: String(networkConfigurationState.shardID),
      characterID: game.characterID
    }
  };
};
