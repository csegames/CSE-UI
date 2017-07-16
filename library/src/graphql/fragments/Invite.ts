/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-24 10:23:06
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-06-22 15:24:40
 */

import gql from 'graphql-tag';

import FullCharacterFragment, { FullCharacter } from './FullCharacter';
import { Invite } from '../schema';

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
