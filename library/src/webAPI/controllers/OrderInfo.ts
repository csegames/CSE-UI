/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { AxiosRequestConfig, Promise } from 'axios';
import { create } from '../../util/apisaucelite';
import createOptions from '../createOptions';
import { Character } from '../definitions';


export function getOrderPublicInfoV1(shardID: number, groupID: string) {
  return create(createOptions()).call('v1/orderInfo/getPublicInfo', { 
    shardID: shardID, 
    groupID: groupID
  });
}

export function getOrderPublicInfoByNameV1(shardID: number, name: string) {
  return create(createOptions()).call('v1/orderInfo/getPublicInfoByName', { 
    shardID: shardID, 
    name: name
  });
}

export function getOrderInfoV1(shardID: number, characterID: string, groupID: string) {
  return create(createOptions()).call('v1/orderInfo/getInfo', { 
    shardID: shardID, 
    characterID: characterID, 
    groupID: groupID
  });
}

export function getOrderInfoForCharacterV1(shardID: number, characterID: string) {
  return create(createOptions()).call('v1/orderInfo/myOrder', { 
    shardID: shardID, 
    characterID: characterID
  });
}

