/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-24 10:18:35
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-24 14:46:40
 */

import gql from 'graphql-tag';

import { Faction, Race, Gender, Archetype } from '../..';
import FullOrderFragment, { FullOrder}  from './FullOrder';

export default gql`
fragment FullCharacter on Character {
  id
  name
  kills
  race
  gender 
  realm 
  class 
  lastLogin 
  deleted 
  order {
    ...FullOrder 
  }
}
${FullOrderFragment}
`;

export interface FullCharacter {
  id: string;
  name: string;
  kills: number;
  race: Race;
  gender: Gender;
  realm: Faction;
  class: Archetype;
  lastLogin: string;
  deleted: boolean;
  order: FullOrder;
}
