/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import Raven from 'raven-js';

declare var cuAPI: any;

if (process.env.ENABLE_SENTRY) {
  Raven.config('https://f7710348f19c4a0f8f8cd83ea0aa343f@sentry.io/1259561', {
    release: process.env.GIT_REVISION, // use git revision as release? {{process.env.GIT_REVISION}}
    environment: 'development-test',
  }).install();

  if (cuAPI) {
    Raven.setTagsContext({
      shard: cuAPI.shardID,
    });
    Raven.setUserContext({
      id: cuAPI.characterID,
    });
  }
  setTimeout(() => {
    Raven.setTagsContext({
      shard: cuAPI.shardID,
    });
    Raven.setUserContext({
      id: cuAPI.characterID,
    });
  }, 1000);
}
