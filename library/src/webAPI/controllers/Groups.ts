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

export function getInvitesForCharacterV1(shardID: number, characterID: string) {
  return create(createOptions()).call('v1/groups/getInvitesForCharacter', {
    shardID,
    characterID,
  });
}

export function createRankV1(
  shardID: number,
  characterID: string,
  groupID: string,
  name: string,
  level: number,
  permissions: string[]) {
  return create(createOptions()).call('v1/groups/createRank', {
    shardID,
    characterID,
    groupID,
    name,
    level,
    permissions,
  });
}

export function removeRankV1(shardID: number, characterID: string, groupID: string, name: string) {
  return create(createOptions()).call('v1/groups/removeRank', {
    shardID,
    characterID,
    groupID,
    name,
  });
}

export function renameRankV1(shardID: number, characterID: string, groupID: string, name: string, newName: string) {
  return create(createOptions()).call('v1/groups/renameRank', {
    shardID,
    characterID,
    groupID,
    name,
    newName,
  });
}

export function addRankPermissionsV1(
  shardID: number,
  characterID: string,
  groupID: string,
  name: string,
  permissions: string[]) {
  return create(createOptions()).call('v1/groups/addRankPermissions', {
    shardID,
    characterID,
    groupID,
    name,
    permissions,
  });
}

export function removeRankPermissionsV1(
  shardID: number,
  characterID: string,
  groupID: string,
  name: string,
  permissions: string[]) {
  return create(createOptions()).call('v1/groups/removeRankPermissions', {
    shardID,
    characterID,
    groupID,
    name,
    permissions,
  });
}

export function setRankPermissionsV1(
  shardID: number,
  characterID: string,
  groupID: string,
  name: string,
  permissions: string[]) {
  return create(createOptions()).call('v1/groups/setRankPermissions', {
    shardID,
    characterID,
    groupID,
    name,
    permissions,
  });
}

export function setRankLevelV1(shardID: number, characterID: string, groupID: string, name: string, level: number) {
  return create(createOptions()).call('v1/groups/setRankLevel', {
    shardID,
    characterID,
    groupID,
    name,
    level,
  });
}

export function assignRankV1(shardID: number, characterID: string, groupID: string, targetID: string, rankName: string) {
  return create(createOptions()).call('v1/groups/assignRank', {
    shardID,
    characterID,
    groupID,
    targetID,
    rankName,
  });
}

export function kickV1(shardID: number, characterID: string, groupID: string, targetID: string) {
  return create(createOptions()).call('v1/groups/kick', {
    shardID,
    characterID,
    groupID,
    targetID,
  });
}

export function inviteV1(shardID: number, characterID: string, groupID: string, targetID: string) {
  return create(createOptions()).call('v1/groups/invite', {
    shardID,
    characterID,
    groupID,
    targetID,
  });
}

export function inviteByNameV1(shardID: number, characterID: string, groupID: string, targetName: string) {
  return create(createOptions()).call('v1/groups/inviteByName', {
    shardID,
    characterID,
    groupID,
    targetName,
  });
}

export function acceptInviteV1(shardID: number, characterID: string, groupID: string, inviteCode: string) {
  return create(createOptions()).call('v1/groups/acceptInvite', {
    shardID,
    characterID,
    groupID,
    inviteCode,
  });
}

