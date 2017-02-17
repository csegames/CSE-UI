/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-15 18:01:41
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-15 18:07:38
 */

import gql from 'graphql-tag';

export default gql`
query OrderActions($id: String!, $shard: Int!) {
  order(id: $id, shard: $shard) {
    recentActions {
      memberID
      type
      groupID
      when
      message
    }
  }
}
`;

export interface MemberAction {
  memberID: string;
  type: string;
  groupID: string;
  when: string; // Date
  message: string;
}

export interface OrderActions {
  order: {
    recentActions: MemberAction[];
  }
}

export interface OrderActionsVariables {
  id: string;
  shard: number;
}
