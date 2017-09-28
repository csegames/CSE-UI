/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import gql from 'graphql-tag';

import { Faction, Race, Gender, Archetype } from '../..';

export default gql`
query InlineCharacter($id: String!, $shard: Int!) {
  character(id: $id, shard: $shard) {
    id
    name
    race 
    gender 
    realm
    class 
  }
}
`;

export interface InlineCharacterQuery {
  character: {
    id: string;
    name: string;
    race: Race;
    gender: Gender;
    realm: Faction;
    class: Archetype;
  };
}

export interface InlineCharacterQueryVariables {
  id: string;
  shard: number;
}
