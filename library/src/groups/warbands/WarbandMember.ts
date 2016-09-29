/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import race from '../../core/constants/race';
import gender from '../../core/constants/gender';
import archetype from '../../core/constants/archetype';
import warbandRanks from '../../core/constants/warbandRanks';
import warbandRoles from '../../core/constants/warbandRoles';
import warbandPermissions from '../../core/constants/warbandPermissions';

export interface WarbandMember {
  name: string,
  avatar: string,
  race: race,
  gender: gender,
  archetype: archetype,
  characterID: string;
  health: {
    current: number,
    maximum: number
  }[];
  wounds: number[],
  stamina: {
    current: number,
    maximum: number
  };
  blood: {
    current: number,
    maximum: number
  };
  panic: {
    current: number,
    maximum: number
  };
  temperature: {
    current: number;
    freezingThreshold: number;
    burningThreshold: number;
  };
  joined: string;
  parted: string;
  rank: warbandRanks;
  role: warbandRoles;
  additionalPermissions: warbandPermissions[];
}
