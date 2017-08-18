/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
/* tslint:disable */
import { AxiosRequestConfig, Promise } from 'axios';
import client from '../../core/client';
import { create } from '../../util/apisaucelite';
import createOptions from '../createOptions';
import { Character, MoveItemRequest } from '../definitions';
import { BadRequest, ExecutionError, NotAllowed, ServiceUnavailable, Unauthorized } from '../apierrors';

 

export function getTraitsV1(shardID: number, apiHost: string = client.apiHost) {
  return create(createOptions(apiHost)).get('v1/traits', { 
    shardID: shardID
  });
}

 