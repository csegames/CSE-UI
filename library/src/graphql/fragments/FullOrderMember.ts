/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-13 16:32:59
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-16 12:51:02
 */
import gql from 'graphql-tag';
import {faction, race, gender, archetype} from '../..';
import PermissionInfoFragment, {PermissionInfo} from './PermissionInfo';
import CustomRankFragment, {CustomRank} from './CustomRank';

export default gql`
fragment FullOrderMember on OrderMemberQLType {
  id
  name
  rank {
    ...CustomRank
  }
  race
  gender
  class
  joined
  lastLogin
  kills
  extraPermissions {
    ...PermissionInfo
  }
  permissions {
    ...PermissionInfo
  }
}
${CustomRankFragment}
${PermissionInfoFragment}
`;

export interface FullOrderMember {
  id : string;
  name : string;
  rank : CustomRank;
  race : race;
  gender : gender;
  class : archetype;
  joined : string;
  lastLogin : string;
  kills : number;
  permissions: PermissionInfo[];
}
