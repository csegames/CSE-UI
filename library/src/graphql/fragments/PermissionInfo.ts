/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
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
