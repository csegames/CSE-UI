/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */
import gql from 'graphql-tag';

import { Faction, Race, Gender, Archetype } from '../../';
import FullWarbandMemberFragment, { FullWarbandMember } from './FullWarbandMember';
import CustomRankFragment from './CustomRank';
import { CustomRank } from '../schema';

export default gql`
fragment FullWarband on Warband {
  id
  name
  realm
  creator
  created
  ranks {
    ...CustomRank
  }
  members {
    ...FullWarbandMember
  }
}
${CustomRankFragment}
${FullWarbandMemberFragment}
`;

export interface FullWarband {
  id: string;
  name: string;
  realm: Faction;
  creator: string;
  created: string;
  ranks: CustomRank[];
  members: FullWarbandMember[];
}

