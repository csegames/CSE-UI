/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-08-29 15:33:15
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-08-29 16:46:52
 */

import {create} from 'apisauce';
import createOptions from './createOptions';

const api = create(createOptions);

let warbandAPI = {

  
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
  createWarband: (shard: number, characterID: string, forceLeave: boolean = false, name: string = '') => {
    let params: any = {
      shardID: shard,
      characterID: characterID
    };
    if (name.length > 0)params.name = name;
    return api.call('groups/createWarband', params);
  },

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
  inviteCharacterToWarbandByID: (shard: number, characterID: string, targetID: string, warbandID: string = '') => {
    let params: any = {
      shardID: shard,
      characterID: characterID,
      targetID: targetID
    };
    if (warbandID.length > 0) params.warbandID = warbandID;
    return api.call('groups/inviteCharacterToWarbandByCharacterID', params);
  },

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
  inviteCharacterToWarbandByName: (shard: number, characterID: string, targetName: string, warbandID: string = '') => {
    let params: any = {
      shardID: shard,
      characterID: characterID,
      targetName: targetName
    };
    if (warbandID.length > 0) params.warbandID = warbandID;
    return api.call('groups/inviteCharacterToWarbandByName', params);
  },

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
  joinWarbandByID: (shard: number, warbandID: string, characterID: string, inviteCode: string = '') => {
    let params: any = {
      shardID: shard,
      warbandID: warbandID,
      characterID: characterID
    };
    if (inviteCode.length > 0) params.inviteCode = inviteCode;
    return api.call('groups/joinWarbandByID', params);
  },

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
  joinWarbandByName: (shard: number, warbandName: string, characterID: string, inviteCode: string = '') => {
    let params: any = {
      shardID: shard,
      warbandName: warbandName,
      characterID: characterID
    };
    if (inviteCode.length > 0) params.inviteCode = inviteCode;
    return api.call('groups/joinWarbandByName', params);
  },

  /**
   * Quit your currently active Warband.
   * 
   * @param {number} shard
   * @param {string} characterID
   * @returns Promize<axiosResponse>
   */
  quitWarband: (shard: number, characterID: string) => {
    return api.call('groups/quitWarband', {
     shardID: shard,
     characterID: characterID
   });
  },

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
  abandonWarbandByName: (shard: number, characterID: string, warbandName: string = '') => {
    let params: any = {
      shardID: shard,
      characterID: characterID
    };
    if (warbandName.length > 0) params.warbandName = warbandName;
    return api.call('groups/abandonWarbandByName', params);
  },

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
  abandonWarbandByID: (shard: number, characterID: string, warbandID: string = '') => {
    let params: any = {
      shardID: shard,
      characterID: characterID
    };
    if (warbandID.length > 0) params.warbandID = warbandID;
    return api.call('groups/abandonWarbandByID', params);
  },

  /**
   * Get Warband info by Warband id.
   * 
   * @param {number} shard
   * @param {string} warbandID
   * @returns
   */
  getWarbandInfoByID: (shard: number, warbandID: string) => {
    return api.call('groups/getWarbandInfoByID', {
      shardID: shard,
      warbandID: warbandID
    });
  },

  /**
   * Get Warband info by Warband name.
   * 
   * @param {number} shard
   * @param {string} warbandName
   * @returns
   */
  getWarbandInfoByName: (shard: number, warbandName: string) => {
    return api.call('groups/getWarbandInfoByName', {
      shardID: shard,
      warbandName: warbandName
    });
  },

  /**
   * Get Warband info for the currently active warband the identified character is a member of.
   * 
   * @param {number} shard
   * @param {string} characterID
   * @returns
   */
  getActiveWarbandInfo: (shard: number, characterID: string) => {
    return api.call('groups/getMyActiveWarbandInfo', {
      shardID: shard,
      characterID: characterID
    });
  }

}

export default warbandAPI;
