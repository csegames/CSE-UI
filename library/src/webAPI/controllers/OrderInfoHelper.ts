/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import { create, axiosResponse } from 'apisauce';
import createOptions from '../createOptions';
import { Character } from '../definitions';


export function getOrderPublicDetailsV1(shardID: number, groupID: string) : Promise<axiosResponse> {
  return create(createOptions()).call('v1/orderInfo/getPublicDetails', { 
    shardID: shardID, 
    groupID: groupID
  });
}

export function getOrderPublicDetailsByNameV1(shardID: number, name: string) : Promise<axiosResponse> {
  return create(createOptions()).call('v1/orderInfo/getPublicDetailsByName', { 
    shardID: shardID, 
    name: name
  });
}

