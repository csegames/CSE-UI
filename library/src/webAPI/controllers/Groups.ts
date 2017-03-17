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
    shardID: shardID,
    characterID: characterID
  });
}

export function createRankV1(shardID: number, characterID: string, groupID: string, name: string, level: number, permissions: string[]) {
  return create(createOptions()).call('v1/groups/createRank', {
    shardID: shardID,
    characterID: characterID,
    groupID: groupID,
    name: name,
    level: level,
    permissions: permissions
  });
}

export function removeRankV1(shardID: number, characterID: string, groupID: string, name: string) {
  return create(createOptions()).call('v1/groups/removeRank', {
    shardID: shardID,
    characterID: characterID,
    groupID: groupID,
    name: name
  });
}

export function renameRankV1(shardID: number, characterID: string, groupID: string, name: string, newName: string) {
  return create(createOptions()).call('v1/groups/renameRank', {
    shardID: shardID,
    characterID: characterID,
    groupID: groupID,
    name: name,
    newName: newName
  });
}

export function addRankPermissionsV1(shardID: number, characterID: string, groupID: string, name: string, permissions: string[]) {
  return create(createOptions()).call('v1/groups/addRankPermissions', {
    shardID: shardID,
    characterID: characterID,
    groupID: groupID,
    name: name,
    permissions: permissions
  });
}

export function removeRankPermissionsV1(shardID: number, characterID: string, groupID: string, name: string, permissions: string[]) {
  return create(createOptions()).call('v1/groups/removeRankPermissions', {
    shardID: shardID,
    characterID: characterID,
    groupID: groupID,
    name: name,
    permissions: permissions
  });
}

export function setRankPermissionsV1(shardID: number, characterID: string, groupID: string, name: string, permissions: string[]) {
  return create(createOptions()).call('v1/groups/setRankPermissions', {
    shardID: shardID,
    characterID: characterID,
    groupID: groupID,
    name: name,
    permissions: permissions
  });
}

export function setRankLevelV1(shardID: number, characterID: string, groupID: string, name: string, level: number) {
  return create(createOptions()).call('v1/groups/setRankLevel', {
    shardID: shardID,
    characterID: characterID,
    groupID: groupID,
    name: name,
    level: level
  });
}

export function assignRankV1(shardID: number, characterID: string, groupID: string, targetID: string, rankName: string) {
  return create(createOptions()).call('v1/groups/assignRank', {
    shardID: shardID,
    characterID: characterID,
    groupID: groupID,
    targetID: targetID,
    rankName: rankName
  });
}

export function kickV1(shardID: number, characterID: string, groupID: string, targetID: string) {
  return create(createOptions()).call('v1/groups/kick', {
    shardID: shardID,
    characterID: characterID,
    groupID: groupID,
    targetID: targetID
  });
}

export function inviteV1(shardID: number, characterID: string, groupID: string, targetID: string) {
  return create(createOptions()).call('v1/groups/invite', {
    shardID: shardID,
    characterID: characterID,
    groupID: groupID,
    targetID: targetID
  });
}

export function inviteByNameV1(shardID: number, characterID: string, groupID: string, targetName: string) {
  return create(createOptions()).call('v1/groups/inviteByName', {
    shardID: shardID,
    characterID: characterID,
    groupID: groupID,
    targetName: targetName
  });
}

export function acceptInviteV1(shardID: number, characterID: string, groupID: string, inviteCode: string) {
  return create(createOptions()).call('v1/groups/acceptInvite', {
    shardID: shardID,
    characterID: characterID,
    groupID: groupID,
    inviteCode: inviteCode
  });
}

