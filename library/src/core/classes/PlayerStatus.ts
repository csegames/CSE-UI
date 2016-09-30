/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-09-29 16:32:36
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-09-29 16:33:13
 */

import race from '../constants/race';
import gender from '../constants/gender';
import archetype from '../constants/archetype';

export interface PlayerStatus {
  name: string;
  avatar: string;
  race: race;
  gender: gender;
  archetype: archetype;
  characterID: string;
  health: {
    current: number;
    maximum: number;
  }[];
  wounds: number[];
  stamina: {
    current: number;
    maximum: number;
  };
  blood: {
    current: number;
    maximum: number;
  };
  panic: {
    current: number;
    maximum: number;
  };
  temperature: {
    current: number;
    freezingThreshold: number;
    burningThreshold: number;
  };
}
