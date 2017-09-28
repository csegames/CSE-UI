/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import gql from 'graphql-tag';

import { Faction, Race, Gender, Archetype } from '../../';

export default gql`
fragment CUCharacter on CUCharacter {
  id
  name
  race
  faction
  gender
  archetype
  order
}`;

export interface CUCharacter {
  id: string;
  name: string;
  race: any;
  faction: any;
  gender: any;
  archetype: any;
  order: any;
}
