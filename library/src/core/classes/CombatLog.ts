/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 *
 * @Author: JB (jb@codecorsair.com)
 * @Date: 2016-09-29 16:29:14
 * @Last Modified by: Andrew L. Jackson (jacksonal300@gmail.com)
 * @Last Modified time: 2017-04-07 14:43:08
 */

import { Faction } from '../..';
import { bodyParts } from '../constants/bodyParts';
import { damageTypes } from '../constants/damageTypes';
import { resourceTypes } from '../constants/resourceTypes';
import { skillTracks } from '../constants/skillTracks';
import { activeEffectActions } from '../constants/activeEffectActions';

export interface CombatLog {
  fromName: string;
  fromFaction: Faction;

  toName: string;
  toFaction: Faction;

  damages?: {
    sent: number;
    received: number;
    part: bodyParts;
    type: damageTypes;
  }[];

  // damage against an abilities disruption health, high enough disruption damage causes and interrupt
  disruption?: {
    sent: number;
    received: number;
    tracksInterrupted?: skillTracks;
    source: string;
  };

  heals?: {
    sent: number;
    received: number;
    part: bodyParts;
  }[];

  // Array of body Part ids that received a cure, ie [1, 1, 2] = 2 cures on body part 1 and 1 cure ont body part 2
  cures?: bodyParts[];

  // resources spent or gained
  resources?: {
    sent: number;
    received: number;
    type: resourceTypes;
  }[];

  // impulse = knock back or a force applied to your character
  impulse?: {
    sent: number;
    received: number;
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
