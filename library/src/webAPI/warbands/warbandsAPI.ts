/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-08-29 15:33:15
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-10-13 11:34:48
 */

import { create } from 'apisauce';
import createOptions from '../createOptions';

import warbandRoles from '../../core/constants/warbandRoles';
import warbandRanks from '../../core/constants/warbandRanks';
import warbandPermissions from '../../core/constants/warbandPermissions';

/**
 * Create a new Warband. If forceLeave is true, user will create new group and join regardless of what their current
 * current Warband status. If forceLeave is false (default), creation will fail if use is an active member of a Warband.
 * If a name is provided the resulting group is Permanent and will exist until all permenent members abandon the Warband.
 * 
 * @param {number} shard
 * @param {string} characterID
 * @param {boolean} [forceLeave=false]
 * @param {string} [name='']
 * @returns Promize<axiosResponse>
 */
export function createWarband(shard: number, characterID: string, forceLeave: boolean = false, name: string = '') {
  let params: any = {
    shardID: shard,
    characterID: characterID
  };
  if (name.length > 0) params.name = name;
  return create(createOptions()).call('groups/createWarband', params);
}

/**
 * Invite a character to a Warband by their character id. If no warbandID is provided, the api assumes you are
 * inviting the character to your currently actvie warband.
 * 
 * @param {number} shard
 * @param {string} warbandID
 * @param {string} characterID
 * @param {string} targetID
 * @returns Promize<axiosResponse>
 */
export function inviteCharacterToWarbandByID(shard: number, characterID: string, targetID: string, warbandID: string = '') {
  let params: any = {
    shardID: shard,
    characterID: characterID,
    targetID: targetID
  };
  if (warbandID.length > 0) params.warbandID = warbandID;
  return create(createOptions()).call('groups/inviteCharacterToWarbandByCharacterID', params);
}

/**
 * Invite a character to Warband using their character name. If no warbandID is provided, the api assumes you are
 * inviting the character to your currently actvie warband.
 * 
 * @param {number} shard
 * @param {string} characterID
 * @param {string} targetName
 * @param {string} [warbandID='']
 * @returns Promize<axiosResponse>
 */
export function inviteCharacterToWarbandByName(shard: number, characterID: string, targetName: string, warbandID: string = '') {
  let params: any = {
    shardID: shard,
    characterID: characterID,
    targetName: targetName
  };
  if (warbandID.length > 0) params.warbandID = warbandID;
  return create(createOptions()).call('groups/inviteCharacterToWarbandByName', params);
}

/**
 * Join a Warband with the given ID. If an invite code is provided, this is used for authorization, if an invite
 * code is not provided only permanent members are authorized to rejoin a permanent warband.
 * 
 * @param {number} shard
 * @param {string} warbandID
 * @param {string} characterID
 * @param {string} [inviteCode='']
 * @returns Promize<axiosResponse>
 */
export function joinWarbandByID(shard: number, warbandID: string, characterID: string, inviteCode: string = '') {
  let params: any = {
    shardID: shard,
    warbandID: warbandID,
    characterID: characterID
  };
  if (inviteCode.length > 0) params.inviteCode = inviteCode;
  return create(createOptions()).call('groups/joinWarbandByID', params);
}

/**
 * Join a Warband with the given name. If an invite code is provided, this is used for authorization, if an invite
 * code is not provided only permanent members are authorized to rejoin a permanent warband.
 * 
 * @param {number} shard
 * @param {string} warbandName
 * @param {string} characterID
 * @param {string} [inviteCode='']
 * @returns Promize<axiosResponse>
 */
export function joinWarbandByName(shard: number, warbandName: string, characterID: string, inviteCode: string = '') {
  let params: any = {
    shardID: shard,
    warbandName: warbandName,
    characterID: characterID
  };
  if (inviteCode.length > 0) params.inviteCode = inviteCode;
  return create(createOptions()).call('groups/joinWarbandByName', params);
}

/**
 * Quit your currently active Warband.
 * 
 * @param {number} shard
 * @param {string} characterID
 * @returns Promize<axiosResponse>
 */
export function quitWarband(shard: number, characterID: string) {
  return create(createOptions()).call('groups/quitWarband', {
    shardID: shard,
    characterID: characterID
  });
}

/**
 * Abandon a Warband. Abandon is different from quit in that is will leave and drop permanent status. A character
 * does not need to be an active member to Abandon, in this case they must provide the name for thw Warband they
 * wish to abandon.
 * 
 * @param {number} shard
 * @param {string} characterID
 * @param {string} [warbandName='']
 * @returns
 */
export function abandonWarbandByName(shard: number, characterID: string, warbandName: string = '') {
  let params: any = {
    shardID: shard,
    characterID: characterID
  };
  if (warbandName.length > 0) params.warbandName = warbandName;
  return create(createOptions()).call('groups/abandonWarbandByName', params);
}

/**
 * Abandon a Warband. Abandon is different from quit in that abandon will drop permanent status in addition to
 * leaving the Warband. A character does not need to be an active member to Abandon, in this case they must
 * provide the id for thw Warband they wish to abandon.
 * 
 * @param {number} shard
 * @param {string} characterID
 * @param {string} [warbandID='']
 * @returns
 */
export function abandonWarbandByID(shard: number, characterID: string, warbandID: string = '') {
  let params: any = {
    shardID: shard,
    characterID: characterID
  };
  if (warbandID.length > 0) params.warbandID = warbandID;
  return create(createOptions()).call('groups/abandonWarbandByID', params);
}

/**
 * Get Warband info by Warband id.
 * 
 * @param {number} shard
 * @param {string} warbandID
 * @returns
 */
export function getWarbandInfoByID(shard: number, warbandID: string) {
  return create(createOptions()).call('groups/getWarbandInfoByID', {
    shardID: shard,
    warbandID: warbandID
  });
}

/**
 * Get Warband info by Warband name.
 * 
 * @param {number} shard
 * @param {string} warbandName
 * @returns
 */
export function getWarbandInfoByName(shard: number, warbandName: string) {
  return create(createOptions()).call('groups/getWarbandInfoByName', {
    shardID: shard,
    warbandName: warbandName
  });
}

/**
 * Get Warband info for the currently active warband the identified character is a member of.
 * 
 * @param {number} shard
 * @param {string} characterID
 * @returns
 */
export function getActiveWarbandInfo(shard: number, characterID: string) {
  return create(createOptions()).call('groups/getMyActiveWarbandInfo', {
    shardID: shard,
    characterID: characterID
  });
}

export function setWarbandRoleByID(shard: number, characterID: string, targetID: string, role: warbandRoles, warbandID: string = '') {
  var params: any = {
    shardID: shard,
    characterID: characterID,
    targetID: targetID,
    role: role,
  }

  if (warbandID !== '') params.warbandID = warbandID;

  return create(createOptions()).call('warbands/setRoleByID', params);
}

export function setWarbandRoleByName(shard: number, characterID: string, targetName: string, role: warbandRoles, warbandID: string = '') {
  var params: any = {
    shardID: shard,
    characterID: characterID,
    targetName: targetName,
    role: role,
  }

  if (warbandID !== '') params.warbandID = warbandID;

  return create(createOptions()).call('warbands/setRoleByName', params);
}

export function setWarbandRankByID(shard: number, characterID: string, targetID: string, rank: warbandRanks, warbandID: string = '') {
  var params: any = {
    shardID: shard,
    characterID: characterID,
    targetID: targetID,
    rank: rank,
  }

  if (warbandID !== '') params.warbandID = warbandID;

  return create(createOptions()).call('warbands/setRankByID', params);
}

export function setWarbandRankByName(shard: number, characterID: string, targetName: string, rank: warbandRanks, warbandID: string = '') {
  var params: any = {
    shardID: shard,
    characterID: characterID,
    targetName: targetName,
    rank: rank,
  }

  if (warbandID !== '') params.warbandID = warbandID;

  return create(createOptions()).call('warbands/setRankByName', params);
}

export function setWarbandPermissionsByID(shard: number, characterID: string, targetID: string, permissions: warbandPermissions, warbandID: string = '') {
  var params: any = {
    shardID: shard,
    characterID: characterID,
    targetID: targetID,
    permissions: permissions,
  }

  if (warbandID !== '') params.warbandID = warbandID;

  return create(createOptions()).call('warbands/setPermissionsByID', params);
}

export function setWarbandPermissionsByName(shard: number, characterID: string, targetName: string, permissions: warbandPermissions, warbandID: string = '') {
  var params: any = {
    shardID: shard,
    characterID: characterID,
    targetName: targetName,
    permissions: permissions,
  }

  if (warbandID !== '') params.warbandID = warbandID;

  return create(createOptions()).call('warbands/setPermissionsByName', params);
}

export function addWarbandPermissionsByID(shard: number, characterID: string, targetID: string, permissions: warbandPermissions, warbandID: string = '') {
  var params: any = {
    shardID: shard,
    characterID: characterID,
    targetID: targetID,
    permissions: permissions,
  }

  if (warbandID !== '') params.warbandID = warbandID;

  return create(createOptions()).call('warbands/addPermissionsByID', params);
}

export function addWarbandPermissionsByName(shard: number, characterID: string, targetName: string, permissions: warbandPermissions, warbandID: string = '') {
  var params: any = {
    shardID: shard,
    characterID: characterID,
    targetName: targetName,
    permissions: permissions,
  }

  if (warbandID !== '') params.warbandID = warbandID;

  return create(createOptions()).call('warbands/addPermissionsByName', params);
}

export function removeWarbandPermissionsByID(shard: number, characterID: string, targetID: string, permissions: warbandPermissions, warbandID: string = '') {
  var params: any = {
    shardID: shard,
    characterID: characterID,
    targetID: targetID,
    permissions: permissions,
  }

  if (warbandID !== '') params.warbandID = warbandID;

  return create(createOptions()).call('warbands/removePermissionsByID', params);
}

export function removeWarbandPermissionsByName(shard: number, characterID: string, targetName: string, permissions: warbandPermissions, warbandID: string = '') {
  var params: any = {
    shardID: shard,
    characterID: characterID,
    targetName: targetName,
    permissions: permissions,
  }

  if (warbandID !== '') params.warbandID = warbandID;

  return create(createOptions()).call('warbands/removePermissionsByName', params);
}


export function kickFromWarbandByID(shard: number, characterID: string, targetID: string, warbandID: string = '') {
  var params: any = {
    shardID: shard,
    characterID: characterID,
    targetID: targetID,
  }

  if (warbandID !== '') params.warbandID = warbandID;

  return create(createOptions()).call('warbands/kickByID', params);
}

export function kickFromWarbandByName(shard: number, characterID: string, targetName: string, warbandID: string = '') {
  var params: any = {
    shardID: shard,
    characterID: characterID,
    targetName: targetName,
  }

  if (warbandID !== '') params.warbandID = warbandID;

  return create(createOptions()).call('warbands/kickByName', params);
}
