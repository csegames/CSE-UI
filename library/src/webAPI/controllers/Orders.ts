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
    shardID: shardID,
    characterID: characterID,
    name: name
  });
}

export function createRankV1(shardID: number, characterID: string, name: string, level: number, permissions: string[]) {
  return create(createOptions()).call('v1/orders/createRank', {
    shardID: shardID,
    characterID: characterID,
    name: name,
    level: level,
    permissions: permissions
  });
}

export function removeRankV1(shardID: number, characterID: string, name: string) {
  return create(createOptions()).call('v1/orders/removeRank', {
    shardID: shardID,
    characterID: characterID,
    name: name
  });
}

export function inviteV1(shardID: number, characterID: string, targetID: string) {
  return create(createOptions()).call('v1/orders/inviteByID', {
    shardID: shardID,
    characterID: characterID,
    targetID: targetID
  });
}

export function inviteByNameV1(shardID: number, characterID: string, targetName: string) {
  return create(createOptions()).call('v1/orders/inviteByName', {
    shardID: shardID,
    characterID: characterID,
    targetName: targetName
  });
}

export function acceptInvite(shardID: number, characterID: string, orderID: string, inviteCode: string) {
  return create(createOptions()).call('v1/orders/acceptInvite', {
    shardID: shardID,
    characterID: characterID,
    orderID: orderID,
    inviteCode: inviteCode
  });
}

export function kickV1(shardID: number, characterID: string, targetID: string) {
  return create(createOptions()).call('v1/orders/kick', {
    shardID: shardID,
    characterID: characterID,
    targetID: targetID
  });
}

export function abandonV1(shardID: number, characterID: string) {
  return create(createOptions()).call('v1/orders/abandon', {
    shardID: shardID,
    characterID: characterID
  });
}

export function disbandV1(shardID: number, characterID: string) {
  return create(createOptions()).call('v1/orders/disband', {
    shardID: shardID,
    characterID: characterID
  });
}

export function renameRankV1(shardID: number, characterID: string, name: string, newName: string) {
  return create(createOptions()).call('v1/orders/renameRank', {
    shardID: shardID,
    characterID: characterID,
    name: name,
    newName: newName
  });
}

export function addRankPermissionsV1(shardID: number, characterID: string, name: string, permissions: string[]) {
  return create(createOptions()).call('v1/orders/addRankPermissions', {
    shardID: shardID,
    characterID: characterID,
    name: name,
    permissions: permissions
  });
}

export function removeRankPermissionsV1(shardID: number, characterID: string, name: string, permissions: string[]) {
  return create(createOptions()).call('v1/orders/removeRankPermissions', {
    shardID: shardID,
    characterID: characterID,
    name: name,
    permissions: permissions
  });
}

export function changeRankLevelV1(shardID: number, characterID: string, name: string, level: number) {
  return create(createOptions()).call('v1/orders/changeRankLevel', {
    shardID: shardID,
    characterID: characterID,
    name: name,
    level: level
  });
}

export function getMyRankV1(shardID: number, characterID: string) {
  return create(createOptions()).call('v1/orders/getMyRank', {
    shardID: shardID,
    characterID: characterID
  });
}

