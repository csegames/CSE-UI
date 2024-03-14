/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { RequestConfig } from './request';
import { patcher } from '../services/patcher';
import { SubscriptionSettings } from './subscription';

type SubscriptionSettingsSource = () => SubscriptionSettings;

function combine(url: string, path: string): string {
  if (url.endsWith('/')) return url + path;
  return url + '/' + path;
}

export const primaryConf: RequestConfig = () => {
  return {
    url: combine(patcher.getApiHost(), 'graphql'),
    headers: {
      Accept: 'application/json',
      Authorization: `Bearer ${patcher.getAccessToken()}`,
      'Content-Type': 'application/json'
    }
  };
};

export const primarySubsConf: SubscriptionSettingsSource = () => {
  return {
    getUrl: () => combine(patcher.getApiHost().replace('http', 'ws'), 'graphql'),
    getInitPayload: () => {
      return {
        token: patcher.getAccessToken()
      };
    }
  };
};

export function webapiConf(apiHost: string): RequestConfig {
  return () => {
    return {
      url: combine(apiHost, ''),
      headers: {
        Authorization: `Bearer ${patcher.getAccessToken()}`
      }
    };
  };
}

export function shardConf(apiHost: string): RequestConfig {
  return () => {
    return {
      url: combine(apiHost, 'graphql'),
      headers: {
        Accept: 'application/json',
        Authorization: `Bearer ${patcher.getAccessToken()}`,
        'Content-Type': 'application/json'
      }
    };
  };
}
