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

export function createV1(shardID: number, characterID: string) {
  return create(createOptions()).call('v1/warbands/create', {
    shardID: shardID,
    characterID: characterID
  });
}

export function createWithNameV1(shardID: number, characterID: string, name: string) {
  return create(createOptions()).call('v1/warbands/createWithName', {
    shardID: shardID,
    characterID: characterID,
    name: name
  });
}

export function inviteV1(shardID: number, characterID: string, targetID: string) {
  return create(createOptions()).call('v1/warbands/invite', {
    shardID: shardID,
    characterID: characterID,
    targetID: targetID
  });
}

export function inviteByIDV1(shardID: number, characterID: string, targetID: string, warbandID: string) {
  return create(createOptions()).call('v1/warbands/inviteWithID', {
    shardID: shardID,
    characterID: characterID,
    targetID: targetID,
    warbandID: warbandID
  });
}

export function inviteByNameV1(shardID: number, characterID: string, targetName: string) {
  return create(createOptions()).call('v1/warbands/inviteByName', {
    shardID: shardID,
    characterID: characterID,
    targetName: targetName
  });
}

export function inviteByNameWithIDV1(shardID: number, characterID: string, targetName: string, warbandID: string) {
  return create(createOptions()).call('v1/warbands/inviteByNameWithID', {
    shardID: shardID,
    characterID: characterID,
    targetName: targetName,
    warbandID: warbandID
  });
}

export function joinWithInviteV1(shardID: number, warbandID: string, characterID: string, inviteCode: string) {
  return create(createOptions()).call('v1/warbands/joinWithInvite', {
    shardID: shardID,
    warbandID: warbandID,
    characterID: characterID,
    inviteCode: inviteCode
  });
}

export function joinV1(shardID: number, warbandID: string, characterID: string) {
  return create(createOptions()).call('v1/warbands/join', {
    shardID: shardID,
    warbandID: warbandID,
    characterID: characterID
  });
}

export function joinByNameV1(shardID: number, warbandName: string, characterID: string) {
  return create(createOptions()).call('v1/warbands/joinByName', {
    shardID: shardID,
    warbandName: warbandName,
    characterID: characterID
  });
}

export function joinByNameWithInviteV1(shardID: number, warbandName: string, characterID: string, inviteCode: string) {
  return create(createOptions()).call('v1/warbands/joinByNameWithInvite', {
    shardID: shardID,
    warbandName: warbandName,
    characterID: characterID,
    inviteCode: inviteCode
  });
}

export function quitV1(shardID: number, characterID: string) {
  return create(createOptions()).call('v1/warbands/quit', {
    shardID: shardID,
    characterID: characterID
  });
}

export function abandonByNameV1(shardID: number, characterID: string, warbandName: string) {
  return create(createOptions()).call('v1/warbands/abandonByName', {
    shardID: shardID,
    characterID: characterID,
    warbandName: warbandName
  });
}

export function abandonV1(shardID: number, characterID: string) {
  return create(createOptions()).call('v1/warbands/abandon', {
    shardID: shardID,
    characterID: characterID
  });
}

export function abandonByIDV1(shardID: number, characterID: string, warbandID: string) {
  return create(createOptions()).call('v1/warbands/abandonByID', {
    shardID: shardID,
    characterID: characterID,
    warbandID: warbandID
  });
}

export function setRankV1(shardID: number, characterID: string, targetID: string, rank: string) {
  return create(createOptions()).call('v1/warbands/setRank', {
    shardID: shardID,
    characterID: characterID,
    targetID: targetID,
    rank: rank
  });
}

export function setRankWithIDV1(shardID: number, characterID: string, targetID: string, rank: string, warbandID: string) {
  return create(createOptions()).call('v1/warbands/setRankWithID', {
    shardID: shardID,
    characterID: characterID,
    targetID: targetID,
    rank: rank,
    warbandID: warbandID
  });
}

export function setRankByNameV1(shardID: number, characterID: string, targetName: string, rank: string) {
  return create(createOptions()).call('v1/warbands/setRankByName', {
    shardID: shardID,
    characterID: characterID,
    targetName: targetName,
    rank: rank
  });
}

export function setRankByNameWithIDV1(shardID: number, characterID: string, targetName: string, rank: string, warbandID: string) {
  return create(createOptions()).call('v1/warbands/setRankByNameWithID', {
    shardID: shardID,
    characterID: characterID,
    targetName: targetName,
    rank: rank,
    warbandID: warbandID
  });
}

export function setLeaderV1(shardID: number, characterID: string, targetID: string) {
  return create(createOptions()).call('v1/warbands/setLeader', {
    shardID: shardID,
    characterID: characterID,
    targetID: targetID
  });
}

export function setLeaderWithIDV1(shardID: number, characterID: string, targetID: string, warbandID: string) {
  return create(createOptions()).call('v1/warbands/setLeaderWithID', {
    shardID: shardID,
    characterID: characterID,
    targetID: targetID,
    warbandID: warbandID
  });
}

export function setLeaderByNameV1(shardID: number, characterID: string, targetName: string) {
  return create(createOptions()).call('v1/warbands/setLeaderByName', {
    shardID: shardID,
    characterID: characterID,
    targetName: targetName
  });
}

export function setLeaderByNameWithIDV1(shardID: number, characterID: string, targetName: string, warbandID: string) {
  return create(createOptions()).call('v1/warbands/setLeaderByNameWithID', {
    shardID: shardID,
    characterID: characterID,
    targetName: targetName,
    warbandID: warbandID
  });
}

export function setDisplayOrderV1(shardID: number, characterID: string, targetID: string, wantDisplayOrder: number) {
  return create(createOptions()).call('v1/warbands/setDisplayOrder', {
    shardID: shardID,
    characterID: characterID,
    targetID: targetID,
    wantDisplayOrder: wantDisplayOrder
  });
}

export function setDisplayOrderWithIDV1(shardID: number, characterID: string, targetID: string, wantDisplayOrder: number, warbandID: string) {
  return create(createOptions()).call('v1/warbands/setDisplayOrderWithID', {
    shardID: shardID,
    characterID: characterID,
    targetID: targetID,
    wantDisplayOrder: wantDisplayOrder,
    warbandID: warbandID
  });
}

export function kickV1(shardID: number, characterID: string, targetID: string) {
  return create(createOptions()).call('v1/warbands/kick', {
    shardID: shardID,
    characterID: characterID,
    targetID: targetID
  });
}

export function kicWithIDkV1(shardID: number, characterID: string, targetID: string, warbandID: string) {
  return create(createOptions()).call('v1/warbands/kickWithID', {
    shardID: shardID,
    characterID: characterID,
    targetID: targetID,
    warbandID: warbandID
  });
}

export function kickByNameV1(shardID: number, characterID: string, targetName: string) {
  return create(createOptions()).call('v1/warbands/kickByName', {
    shardID: shardID,
    characterID: characterID,
    targetName: targetName
  });
}

export function kickByNameWithIDV1(shardID: number, characterID: string, targetName: string, warbandID: string) {
  return create(createOptions()).call('v1/warbands/kickByNameWithID', {
    shardID: shardID,
    characterID: characterID,
    targetName: targetName,
    warbandID: warbandID
  });
}

export function getInfoV1(shardID: number, warbandID: string) {
  return create(createOptions()).call('v1/groups/getWarbandInfoByID', {
    shardID: shardID,
    warbandID: warbandID
  });
}

export function getInfoByNameV1(shardID: number, warbandName: string) {
  return create(createOptions()).call('v1/groups/getWarbandInfoByName', {
    shardID: shardID,
    warbandName: warbandName
  });
}

export function getActiveInfoV1(shardID: number, characterID: string) {
  return create(createOptions()).call('v1/groups/getMyActiveWarbandInfo', {
    shardID: shardID,
    characterID: characterID
  });
}

export function getAllWarbandsOnShardV1(shardID: number) {
  return create(createOptions()).call('v1/groups/getAllWarbands', {
    shardID: shardID
  });
}

