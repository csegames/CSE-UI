/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { game } from '@csegames/library/dist/_baseGame';
import { SubscriptionSettings } from '@csegames/library/dist/_baseGame/graphql/subscription';
import { RequestConfig } from '@csegames/library/dist/_baseGame/types/Request';

export const networkConfigurationState = {
  shardID: 0
};

export function setShardID(shardID: number) {
  networkConfigurationState.shardID = shardID;
}

function combine(url: string, path: string): string {
  if (url.endsWith('/')) return url + path;
  return url + '/' + path;
}

export const webConf: RequestConfig = () => {
  return {
    url: combine(game.webAPIHost, ''),
    headers: {
      Authorization: `Bearer ${game.accessToken}`,
      shardID: String(networkConfigurationState.shardID),
      characterID: game.characterID
    }
  };
};

export const queryConf: RequestConfig = () => {
  return {
    url: combine(game.webAPIHost, 'graphql'),
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${game.accessToken}`,
      'Content-Type': 'application/json',
      characterID: game.characterID,
      shardID: String(networkConfigurationState.shardID)
    }
  };
};

type SubscriptionSettingsSource = () => SubscriptionSettings;

export const subsConf: SubscriptionSettingsSource = () => {
  return {
    getUrl: () => combine(game.webAPIHost.replace('http', 'ws'), 'graphql'),
    getInitPayload: () => {
      return {
        characterID: game.characterID,
        token: game.accessToken
      };
    }
  };
};
