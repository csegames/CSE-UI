/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-16 12:04:43
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-20 16:30:35
 */

import gql from 'graphql-tag';
import PermissionInfoFragment, {PermissionInfo} from './PermissionInfo';

export interface CustomRank {
  name: string;
  level: number;
  permissions: PermissionInfo[];
}

export default gql`
fragment CustomRank on CustomRank {
  name
  level
  permissions {
    ...PermissionInfo
  }
}
${PermissionInfoFragment}
`;
