/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-09-06 19:01:20
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-09-07 12:44:54
 */

import {create} from 'apisauce';
import {patcher} from '../../../../services/patcher';

function createOptions() {
  return {
    baseURL: 'https://api.camelotunchained.com',
    headers: {
      'api-version': 1,
      'loginToken': patcher.getLoginToken(),
    }
  };
}

export default {

  fetchServers: () => {
    const api = create(createOptions());
    return api.get('servers');
  },

  fetchCharacters: () => {
    const api = create(createOptions());
    return api.get('characters');
  },

  fetchAlerts: () => {
    const api = create(createOptions());
    return api.get('patcheralerts');
  },

  deleteCharacter: (shardID: number, characterID: string) => {
    const api = create(createOptions());
    return api.delete(`characters/${shardID}/${characterID}`);
  },

}

