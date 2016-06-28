/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {create} from 'apisauce';
import createOptions from './createOptions';

const api = create(createOptions);

let groupsAPI = {
  getInvitesForCharacter: (shard: number, characterID: string) => {
    return api.call('groups/getInvitesForCharacter', {
      shardID: shard,
      characterID: characterID
    })
  },

  getInvitesForGroup: (shard: number, groupID: string) => {
    return api.call('groups/getInvitesForGroup', {
      shardID: shard,
      groupID: groupID
    })
  },
}

export default groupsAPI;
