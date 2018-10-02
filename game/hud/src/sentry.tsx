/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Raven from 'raven-js';

if (process.env.ENABLE_SENTRY) {
  Raven.config('https://f7710348f19c4a0f8f8cd83ea0aa343f@sentry.io/1259561', {
    release: process.env.GIT_REVISION, // use git revision as release? {{process.env.GIT_REVISION}}
    environment: 'development-test',
    tags: {
      module: process.env.NAME,
    },
  }).install();

  if (game) {
    Raven.setTagsContext({
      shard: game.shardID,
    });
    Raven.setUserContext({
      id: game.selfPlayerState.characterID,
    });
  }
  setTimeout(() => {
    Raven.setTagsContext({
      shard: game.shardID,
    });
    Raven.setUserContext({
      id: game.selfPlayerState.characterID,
    });
  }, 1000);
}
