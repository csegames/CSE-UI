/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-24 14:43:08
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-24 14:51:57
 */

import gql from 'graphql-tag';

import InviteFragment, { Invite } from '../fragments/Invite';

export default gql`
query MyCharacterInvites {
  myCharacter {
    id
    invites {
      ...Invite
    }
  }
}
${InviteFragment}
`;

export interface MyCharacterInvitesQuery {
  myCharacter: {
    id: string;
    invites: Invite[];
  }
}
