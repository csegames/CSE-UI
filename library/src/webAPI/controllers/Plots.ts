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

export function releasePlotV1(shardID: number, characterID: string, loginToken: string, entityID: string) {
  return create(createOptions()).call('v1/plot/releasePlot', {
    shardID: shardID,
    characterID: characterID,
    loginToken: loginToken,
    entityID: entityID
  });
}

export function modifyPermissionsV1(shardID: number, characterID: string, loginToken: string, entityID: string, newPermissions: number) {
  return create(createOptions()).call('v1/plot/modifyPermissions', {
    shardID: shardID,
    characterID: characterID,
    loginToken: loginToken,
    entityID: entityID,
    newPermissions: newPermissions
  });
}

export function removeQueuedBlueprintV1(shardID: number, characterID: string, loginToken: string, entityID: string, indexToRemove: number) {
  return create(createOptions()).call('v1/plot/removeQueuedBlueprint', {
    shardID: shardID,
    characterID: characterID,
    loginToken: loginToken,
    entityID: entityID,
    indexToRemove: indexToRemove
  });
}

export function reorderQueueV1(shardID: number, characterID: string, loginToken: string, entityID: string, indexToMove: number, destinationIndex: number) {
  return create(createOptions()).call('v1/plot/reorderQueue', {
    shardID: shardID,
    characterID: characterID,
    loginToken: loginToken,
    entityID: entityID,
    indexToMove: indexToMove,
    destinationIndex: destinationIndex
  });
}

export function getQueueStatusV1(shardID: number, characterID: string, loginToken: string) {
  return create(createOptions()).call('v1/plot/getQueueStatus', {
    shardID: shardID,
    characterID: characterID,
    loginToken: loginToken
  });
}

