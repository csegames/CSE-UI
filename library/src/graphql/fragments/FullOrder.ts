/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import gql from 'graphql-tag';

import { Faction, Race, Gender, Archetype } from '../../';
import FullOrderMemberFragment, { FullOrderMember } from './FullOrderMember';
import CustomRankFragment from './CustomRank';
import PermissionInfoFragment from './PermissionInfo';
import { CustomRank, PermissionInfo } from '../schema';

export default gql`
fragment FullOrder on Order {
  id
  name
  realm
  creator
  created
  ranks {
    ...CustomRank
  }
  members {
    ...FullOrderMember
  }
  myMemberInfo {
    ...FullOrderMember
  }
  permissions {
    ...PermissionInfo
  }
}
${CustomRankFragment}
${FullOrderMemberFragment}
${PermissionInfoFragment}
`;

export interface FullOrder {
  id: string;
  name: string;
  realm: Faction;
  creator: string;
  created: string;
  ranks: CustomRank[];
  members: FullOrderMember[];
  myMemberInfo: FullOrderMember;
  permissions: PermissionInfo[];
}

