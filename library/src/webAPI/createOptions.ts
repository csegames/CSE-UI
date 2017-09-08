/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import client from '../core/client';
import {CreateOptions} from '../util/apisaucelite';

export default function(apiHost: string = client.apiHost): CreateOptions {
  return {
    baseURL: apiHost,
    headers: {
      'api-version': client.apiVersion + '',
      loginToken: client.loginToken,
    },
  };
}
