/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {create} from 'apisauce';
import createOptions from './createOptions';

const api = create(createOptions);

let warbandAPI = {

  createWarband: (shard: number, characterID: string, name: string = '') => {
    let params: any = {
      shardID: shard,
      characterID: characterID
    };
    if (name.length > 0) {
      params.name = name;
    }
    return api.call('groups/createWarband', params);
  },

  inviteCharacterToWarbandByID: (shard: number, warbandID: string, characterID: string, targetID: string) => {
    return api.call('groups/inviteCharacterToWarband', {
      shardID: shard,
      warbandID: warbandID,
      characterID: characterID,
      targetID: targetID
    });
  },

  inviteCharacterToWarbandByName: (shard: number, warbandID: string, characterID: string, targetName: string) => {
    return api.call('groups/inviteCharacterToWarband', {
      shardID: shard,
      warbandID: warbandID,
      characterID: characterID,
      targetName: targetName
    });
  },

  joinWarbandByID: (shard: number, warbandID: string, characterID: string, inviteCode: string = '') => {
    let params: any = {
      shardID: shard,
      warbandID: warbandID,
      characterID: characterID
    };
    if (inviteCode.length > 0) {
      params.inviteCode = inviteCode;
    }
    return api.call('groups/joinWarband', params);
  },

  joinWarbandByName: (shard: number, warbandName: string, characterID: string, inviteCode: string = '') => {
    let params: any = {
      shardID: shard,
      warbandName: warbandName,
      characterID: characterID
    };
    if (inviteCode.length > 0) {
      params.inviteCode = inviteCode;
    }
    return api.call('groups/joinWarband', params);
  },

  getWarbandInfoByID: (shard: number, warbandID: string) => {
    return api.call('groups/getWarbandInfo', {
      shardID: shard,
      warbandID: warbandID
    });
  },

  getWarbandInfoByName: (shard: number, warbandName: string) => {
    return api.call('groups/getWarbandInfo', {
      shardID: shard,
      warbandName: warbandName
    });
  },

}

export default warbandAPI;
