/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import gql from 'graphql-tag';
import { Faction } from '../..';

export default gql`
query InlineWarband($id: String!, $shard: Int!) {
  warband(id: $id, shard: $shard) {
    id
    name
    realm
  }
}
`;

export interface InlineWarbandQuery {
  warband: {
    id: string;
    name: string;
    realm: Faction;
  };
}

export interface InlineWarbandQueryVariables {
  id: string;
  shard: number;
}
