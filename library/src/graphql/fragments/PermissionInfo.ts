/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-16 11:30:36
 * @Last Modified by: Andrew Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-06-22 15:18:09
 */

import gql from 'graphql-tag';
import { utils } from '../..';
import { PermissionInfo } from '../schema';

export default gql`
  fragment PermissionInfo on PermissionInfo {
    tag
    name
    description
    enables
  }
`;

export function hasPermission(permissions: PermissionInfo[], tag: string) {
  return utils.findIndexWhere(permissions, p => p.tag === tag || p.tag === 'everything') !== -1;
}
