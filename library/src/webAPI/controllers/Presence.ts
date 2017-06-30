/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
/* tslint:disable */
import { AxiosRequestConfig, Promise } from 'axios';
import { create } from '../../util/apisaucelite';
import createOptions from '../createOptions';
import { Character } from '../definitions';
import { BadRequest, ExecutionError, NotAllowed, ServiceUnavailable, Unauthorized } from '../apierrors';



export function getStartingServer(shardID: number, characterID: string) {
  return create(createOptions()).get('v1/presence/startingServer/{shardID}/{characterID}', { 
    shardID: shardID, 
    characterID: characterID
  });
}

export function getServers(shardID: number) {
  return create(createOptions()).get('v1/presence/servers/{shardID}', { 
    shardID: shardID
  });
}

export function getPlayers(shardID: number) {
  return create(createOptions()).get('v1/presence/players/{shardID}', { 
    shardID: shardID
  });
}

  