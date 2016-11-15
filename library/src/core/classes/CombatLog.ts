/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-09-29 16:29:14
 * @Last Modified by: JB (jb@codecorsair.com)
 * @Last Modified time: 2016-09-29 17:13:08
 */

import faction from '../constants/faction';
import {bodyParts} from '../constants/bodyParts';
import {damageTypes} from '../constants/damageTypes';
import {resourceTypes} from '../constants/resourceTypes';
import {skillTracks} from '../constants/skillTracks';
import {activeEffectActions} from '../constants/activeEffectActions';

export interface CombatLog {
  fromName: string;
  fromFaction: faction;
  
  toName: string;
  toFaction: faction;
  
  damages?: {
    sent: number;
    recieved: number;
    part: bodyParts;
    type: damageTypes;
  }[];
  
  // damage against an abilities disruption health, high enough disruption damage causes and interrupt
  disruption?: {
    sent: number;
    recieved: number;
    tracksInterupted?: skillTracks;
  };
  
  heals?: {
    sent: number;
    recieved: number;
    part: bodyParts;
  }[];
  
  cures?: bodyParts[]; // Array of body Part ids that recieved a cure, ie [1, 1, 2] = 2 cures on body part 1 and 1 cure ont body part 2
  
  // resources spent or gained
  resources?: {
    sent: number;
    recieved: number;
    type: resourceTypes;
  }[];

  // impulse = knock back or a force applied to your character
  impulse?: {
    sent: number;
    recieved: number;
  };

  activeEffects?: {
    name: string;
    action: activeEffectActions;
    duration: string;
  }[];
  
  errors?: {
    msg: string;
  }[];
}
