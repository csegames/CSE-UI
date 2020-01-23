/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { QueryOptions } from '@csegames/library/lib/_baseGame/graphql/query'

export function getConfig() {
  const queryConfig: QueryOptions = {
    url: game.webAPIHost + '/graphql',
    requestOptions: {
      headers: {
        Authorization: `Bearer ${game.accessToken}`,
        CharacterID: game.characterID,
      },
    },
    stringifyVariables: false,
    disableBatching: false,
  };

  return {
    queryConf: queryConfig,
    subsConf: null as any,
  };
}