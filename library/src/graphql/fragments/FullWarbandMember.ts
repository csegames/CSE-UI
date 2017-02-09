/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2017-02-13 16:32:59
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2017-02-20 17:13:38
 */
import gql from 'graphql-tag';
import {Faction, Race, Gender, Archetype} from '../..';

export default gql`
fragment FullWarbandMember on WarbandMember {
  id
  name
  rank
  race
  gender
  class
  joined
  lastLogin
  kills
}
`;

export interface FullWarbandMember {
  id : string;
  name : string;
  rank : string;
  race : Race;
  gender : Gender;
  class : Archetype;
  joined : string;
  lastLogin : string;
  kills : number;
}
