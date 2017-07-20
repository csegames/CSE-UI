/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
/* tslint:disable */
import { AxiosRequestConfig, Promise } from 'axios';
import { create } from '../../util/apisaucelite';
import createOptions from '../createOptions';
import { Character, MoveItemRequest } from '../definitions';
import { BadRequest, ExecutionError, NotAllowed, ServiceUnavailable, Unauthorized } from '../apierrors';

  

export function moveItems(shardID: number, characterID: string, request: MoveItemRequest) {
  return create(createOptions()).call('v1/items/moveitems', { 
    shardID: shardID, 
    characterID: characterID, 
    request: request
  });
}

export function matchMoveItems(shardID: number, characterID: string, requests: MoveItemRequest[]) {
  return create(createOptions()).post('v1/items/batchmoveitems', requests, {
    shardID: shardID,
    characterID: characterID,
  });
}

