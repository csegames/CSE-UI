/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import { game } from '@csegames/library/dist/_baseGame';
import { GraphQLService } from '@csegames/library/dist/graphql/GraphQLService';

export const graphQL = GraphQLService.create({
  getBearerToken() {
    return game.accessToken;
  },
  getServiceUrl() {
    try {
      return Promise.resolve(new URL(game.webAPIHost));
    } catch {
      console.error('Could not resolve webapi host url', game.webAPIHost);
      return Promise.resolve(null);
    }
  }
});
