/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-10-13 11:07:09
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-10-13 11:08:56
 */

import race from '../../core/constants/race';
import gender from '../../core/constants/gender';
import archetype from '../../core/constants/archetype';
import faction from '../../core/constants/faction';

export interface SimpleCharacter {
  archetype: archetype;
  faction: faction;
  gender: gender;
  id: string;
  lastLogin: string;
  name: string;
  race: race;
  shardID: number;
}
