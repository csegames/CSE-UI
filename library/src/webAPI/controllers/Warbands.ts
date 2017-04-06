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
    shardID,
    characterID,
  });
}

export function createWithNameV1(shardID: number, characterID: string, name: string) {
  return create(createOptions()).call('v1/warbands/createWithName', {
    shardID,
    characterID,
    name,
  });
}

export function inviteV1(shardID: number, characterID: string, targetID: string) {
  return create(createOptions()).call('v1/warbands/invite', {
    shardID,
    characterID,
    targetID,
  });
}

export function inviteByIDV1(shardID: number, characterID: string, targetID: string, warbandID: string) {
  return create(createOptions()).call('v1/warbands/inviteWithID', {
    shardID,
    characterID,
    targetID,
    warbandID,
  });
}

export function inviteByNameV1(shardID: number, characterID: string, targetName: string) {
  return create(createOptions()).call('v1/warbands/inviteByName', {
    shardID,
    characterID,
    targetName,
  });
}

export function inviteByNameWithIDV1(shardID: number, characterID: string, targetName: string, warbandID: string) {
  return create(createOptions()).call('v1/warbands/inviteByNameWithID', {
    shardID,
    characterID,
    targetName,
    warbandID,
  });
}

export function joinWithInviteV1(shardID: number, warbandID: string, characterID: string, inviteCode: string) {
  return create(createOptions()).call('v1/warbands/joinWithInvite', {
    shardID,
    warbandID,
    characterID,
    inviteCode,
  });
}

export function joinV1(shardID: number, warbandID: string, characterID: string) {
  return create(createOptions()).call('v1/warbands/join', {
    shardID,
    warbandID,
    characterID,
  });
}

export function joinByNameV1(shardID: number, warbandName: string, characterID: string) {
  return create(createOptions()).call('v1/warbands/joinByName', {
    shardID,
    warbandName,
    characterID,
  });
}

export function joinByNameWithInviteV1(shardID: number, warbandName: string, characterID: string, inviteCode: string) {
  return create(createOptions()).call('v1/warbands/joinByNameWithInvite', {
    shardID,
    warbandName,
    characterID,
    inviteCode,
  });
}

export function quitV1(shardID: number, characterID: string) {
  return create(createOptions()).call('v1/warbands/quit', {
    shardID,
    characterID,
  });
}

export function abandonByNameV1(shardID: number, characterID: string, warbandName: string) {
  return create(createOptions()).call('v1/warbands/abandonByName', {
    shardID,
    characterID,
    warbandName,
  });
}

export function abandonV1(shardID: number, characterID: string) {
  return create(createOptions()).call('v1/warbands/abandon', {
    shardID,
    characterID,
  });
}

export function abandonByIDV1(shardID: number, characterID: string, warbandID: string) {
  return create(createOptions()).call('v1/warbands/abandonByID', {
    shardID,
    characterID,
    warbandID,
  });
}

export function setRankV1(shardID: number, characterID: string, targetID: string, rank: string) {
  return create(createOptions()).call('v1/warbands/setRank', {
    shardID,
    characterID,
    targetID,
    rank,
  });
}

export function setRankWithIDV1(shardID: number, characterID: string, targetID: string, rank: string, warbandID: string) {
  return create(createOptions()).call('v1/warbands/setRankWithID', {
    shardID,
    characterID,
    targetID,
    rank,
    warbandID,
  });
}

export function setRankByNameV1(shardID: number, characterID: string, targetName: string, rank: string) {
  return create(createOptions()).call('v1/warbands/setRankByName', {
    shardID,
    characterID,
    targetName,
    rank,
  });
}

export function setRankByNameWithIDV1(
  shardID: number,
  characterID: string,
  targetName: string,
  rank: string,
  warbandID: string) {
  return create(createOptions()).call('v1/warbands/setRankByNameWithID', {
    shardID,
    characterID,
    targetName,
    rank,
    warbandID,
  });
}

export function setLeaderV1(shardID: number, characterID: string, targetID: string) {
  return create(createOptions()).call('v1/warbands/setLeader', {
    shardID,
    characterID,
    targetID,
  });
}

export function setLeaderWithIDV1(shardID: number, characterID: string, targetID: string, warbandID: string) {
  return create(createOptions()).call('v1/warbands/setLeaderWithID', {
    shardID,
    characterID,
    targetID,
    warbandID,
  });
}

export function setLeaderByNameV1(shardID: number, characterID: string, targetName: string) {
  return create(createOptions()).call('v1/warbands/setLeaderByName', {
    shardID,
    characterID,
    targetName,
  });
}

export function setLeaderByNameWithIDV1(shardID: number, characterID: string, targetName: string, warbandID: string) {
  return create(createOptions()).call('v1/warbands/setLeaderByNameWithID', {
    shardID,
    characterID,
    targetName,
    warbandID,
  });
}

export function setDisplayOrderV1(shardID: number, characterID: string, targetID: string, wantDisplayOrder: number) {
  return create(createOptions()).call('v1/warbands/setDisplayOrder', {
    shardID,
    characterID,
    targetID,
    wantDisplayOrder,
  });
}

export function setDisplayOrderWithIDV1(
  shardID: number,
  characterID: string,
  targetID: string,
  wantDisplayOrder: number,
  warbandID: string) {
  return create(createOptions()).call('v1/warbands/setDisplayOrderWithID', {
    shardID,
    characterID,
    targetID,
    wantDisplayOrder,
    warbandID,
  });
}

export function kickV1(shardID: number, characterID: string, targetID: string) {
  return create(createOptions()).call('v1/warbands/kick', {
    shardID,
    characterID,
    targetID,
  });
}

export function kicWithIDkV1(shardID: number, characterID: string, targetID: string, warbandID: string) {
  return create(createOptions()).call('v1/warbands/kickWithID', {
    shardID,
    characterID,
    targetID,
    warbandID,
  });
}

export function kickByNameV1(shardID: number, characterID: string, targetName: string) {
  return create(createOptions()).call('v1/warbands/kickByName', {
    shardID,
    characterID,
    targetName,
  });
}

export function kickByNameWithIDV1(shardID: number, characterID: string, targetName: string, warbandID: string) {
  return create(createOptions()).call('v1/warbands/kickByNameWithID', {
    shardID,
    characterID,
    targetName,
    warbandID,
  });
}

export function getInfoV1(shardID: number, warbandID: string) {
  return create(createOptions()).call('v1/groups/getWarbandInfoByID', {
    shardID,
    warbandID,
  });
}

export function getInfoByNameV1(shardID: number, warbandName: string) {
  return create(createOptions()).call('v1/groups/getWarbandInfoByName', {
    shardID,
    warbandName,
  });
}

export function getActiveInfoV1(shardID: number, characterID: string) {
  return create(createOptions()).call('v1/groups/getMyActiveWarbandInfo', {
    shardID,
    characterID,
  });
}

export function getAllWarbandsOnShardV1(shardID: number) {
  return create(createOptions()).call('v1/groups/getAllWarbands', {
    shardID,
  });
}

