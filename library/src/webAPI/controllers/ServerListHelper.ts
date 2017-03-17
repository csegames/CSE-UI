/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AxiosRequestConfig, Promise } from 'axios';
import { create } from '../../util/apisaucelite';
import createOptions from '../createOptions';
import { Character } from '../definitions';
import { BadRequest, ExecutionError, NotAllowed, ServiceUnavailable, Unauthorized } from '../apierrors';

export function getServersV1() {
  return create(createOptions()).get('v1/servers/getAll', {
  });
}

export function getServersForChannelV1(channelId: number) {
  return create(createOptions()).get('v1/servers/getForChannel', {
    channelId: channelId
  });
}

export function getHostsForServerV1(channelId: number, name: string) {
  return create(createOptions()).get('v1/servers/getHosts', {
    channelId: channelId,
    name: name
  });
}

