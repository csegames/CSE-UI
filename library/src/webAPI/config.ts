/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { RequestConfig } from './definitions';
import client from '../core/client';

export const defaultConfig: RequestConfig = () => ({
  url: client.apiHost + '/',
  headers: {
    Authorization: `${client.ACCESS_TOKEN_PREFIX} ${client.accessToken}`,
  },
});
