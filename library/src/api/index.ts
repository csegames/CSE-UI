/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {api} from 'apisauce';
import warband from './warband';
import groups from './groups';
import client from '../core/client';
import warbandRoles from '../core/constants/warbandRoles';
import warbandRanks from '../core/constants/warbandRanks';
import warbandPermissions from '../core/constants/warbandPermissions';

let combined = Object.assign({
  loginToken: client.loginToken,
  shardID: 1
}, groups, warband);

export default combined;
