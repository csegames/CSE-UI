/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import gql from 'graphql-tag';

import InviteFragment from '../fragments/Invite';
import { Invite } from '../schema';

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
  };
}
