/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AxiosRequestConfig, Promise } from 'axios';
import { create } from '../../util/apisaucelite';
import createOptions from '../createOptions';
import { Character } from '../definitions';


export function getInvitesForCharacterV1(shardID: number, characterID: string) {
  return create(createOptions()).call('v1/groups/getInvitesForCharacter', { 
    shardID: shardID, 
    characterID: characterID
  });
}

export function getInvitesForGroupV1(shardID: number, groupID: string) {
  return create(createOptions()).call('v1/groups/getInvitesForGroup', { 
    shardID: shardID, 
    groupID: groupID
  });
}

