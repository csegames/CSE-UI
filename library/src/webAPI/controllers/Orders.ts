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

export function createV1(shardID: number, characterID: string, name: string) {
  return create(createOptions()).call('v1/orders/create', {
    shardID,
    characterID,
    name,
  });
}

export function createRankV1(shardID: number, characterID: string, name: string, level: number, permissions: string[]) {
  return create(createOptions()).call('v1/orders/createRank', {
    shardID,
    characterID,
    name,
    level,
    permissions,
  });
}

export function removeRankV1(shardID: number, characterID: string, name: string) {
  return create(createOptions()).call('v1/orders/removeRank', {
    shardID,
    characterID,
    name,
  });
}

export function inviteV1(shardID: number, characterID: string, targetID: string) {
  return create(createOptions()).call('v1/orders/inviteByID', {
    shardID,
    characterID,
    targetID,
  });
}

export function inviteByNameV1(shardID: number, characterID: string, targetName: string) {
  return create(createOptions()).call('v1/orders/inviteByName', {
    shardID,
    characterID,
    targetName,
  });
}

export function acceptInvite(shardID: number, characterID: string, orderID: string, inviteCode: string) {
  return create(createOptions()).call('v1/orders/acceptInvite', {
    shardID,
    characterID,
    orderID,
    inviteCode,
  });
}

export function kickV1(shardID: number, characterID: string, targetID: string) {
  return create(createOptions()).call('v1/orders/kick', {
    shardID,
    characterID,
    targetID,
  });
}

export function abandonV1(shardID: number, characterID: string) {
  return create(createOptions()).call('v1/orders/abandon', {
    shardID,
    characterID,
  });
}

export function disbandV1(shardID: number, characterID: string) {
  return create(createOptions()).call('v1/orders/disband', {
    shardID,
    characterID,
  });
}

export function renameRankV1(shardID: number, characterID: string, name: string, newName: string) {
  return create(createOptions()).call('v1/orders/renameRank', {
    shardID,
    characterID,
    name,
    newName,
  });
}

export function addRankPermissionsV1(shardID: number, characterID: string, name: string, permissions: string[]) {
  return create(createOptions()).call('v1/orders/addRankPermissions', {
    shardID,
    characterID,
    name,
    permissions,
  });
}

export function removeRankPermissionsV1(shardID: number, characterID: string, name: string, permissions: string[]) {
  return create(createOptions()).call('v1/orders/removeRankPermissions', {
    shardID,
    characterID,
    name,
    permissions,
  });
}

export function changeRankLevelV1(shardID: number, characterID: string, name: string, level: number) {
  return create(createOptions()).call('v1/orders/changeRankLevel', {
    shardID,
    characterID,
    name,
    level,
  });
}

export function getMyRankV1(shardID: number, characterID: string) {
  return create(createOptions()).call('v1/orders/getMyRank', {
    shardID,
    characterID,
  });
}

