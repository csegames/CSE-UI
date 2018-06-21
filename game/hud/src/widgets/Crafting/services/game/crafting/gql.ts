/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import 'isomorphic-fetch';
import { Promise } from 'es6-promise';
import { client } from '@csegames/camelot-unchained';

export function gql({ query, variables }: { query: string, variables?: any }) {
  const url = client.apiHost + '/graphql';
  const headers: any = {};
  headers['api-version'] = client.apiVersion;
  headers['loginToken'] = client.loginToken;
  headers['characterId'] = client.characterID;
  headers['shardId'] = client.shardID;
  headers['Accept'] = headers['Content-Type'] = 'application/json';
  const body: string = JSON.stringify({ query, variables });
  return new Promise((resolve, reject) => {
    fetch(url, { method: 'post', headers, body } as any).then((response: any) => {
      response.json().then((data: any) => {
        if (response.status === 200 && data.data) {
          resolve(data.data);
          return;
        }
        reject({ status: response.status, message: data.Message });
      });
    })
    .catch((reason: any) => {
      console.error(reason.message);
      reject({ reason: 'crafting server unavailable' });
    });
  });
}
