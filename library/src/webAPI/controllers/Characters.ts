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

export function getCharactersV1() {
  return create(createOptions()).call('v1/characters/getAll', {
  });
}

export function getCharactersOnShardV1(shardID: number) {
  return create(createOptions()).call('v1/characters/getAllOnShard', {
    shardID: shardID
  });
}

export function getCharacterV1(shardID: number, characterID: string) {
  return create(createOptions()).call('v1/characters/get', {
    shardID: shardID,
    characterID: characterID
  });
}

export function deleteCharacterV1(shardID: number, characterID: string) {
  return create(createOptions()).call('v1/characters/delete', {
    shardID: shardID,
    characterID: characterID
  });
}

export function createCharacterV1(shardID: number, character: Character) {
  return create(createOptions()).call('v1/characters/create', {
    shardID: shardID,
    character: character
  });
}

