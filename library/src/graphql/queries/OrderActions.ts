/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-15 18:01:41
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-06-22 15:23:37
 */

import gql from 'graphql-tag';
import { MemberAction } from '../schema';

export default gql`
query OrderActions($id: String!, $shard: Int!) {
  order(id: $id, shard: $shard) {
    id
    recentActions {
      id
      memberID
      type
      groupID
      when
      message
    }
  }
}
`;

export interface OrderActionsQuery {
  order: {
    id: string;
    recentActions: MemberAction[];
  };
}

export interface OrderActionsQueryVariables {
  id: string;
  shard: number;
}
