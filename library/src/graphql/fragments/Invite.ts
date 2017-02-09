/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-24 10:23:06
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-24 18:01:01
 */

import gql from 'graphql-tag';

import FullCharacterFragment, { FullCharacter } from './FullCharacter';

export default gql`
fragment Invite on InviteInterface {
  id 
  inviteCode
  groupID 
  groupType 
  memberID 
  member {
    ...FullCharacter
  } 
  inviteeID 
  status
}
${FullCharacterFragment}
`;

export interface Invite {
  id: string;
  inviteCode: string;
  groupID: string;
  groupType: string;
  memberID: string;
  member: FullCharacter;
  inviteID: string;
  status: string;
}
