/*
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
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
    recieved: number;
    part: bodyParts;
    type: damageTypes;
  }[];

  // damage against an abilities disruption health, high enough disruption damage causes and interrupt
  disruption?: {
    sent: number;
    recieved: number;
    tracksInterupted?: skillTracks;
    source: string;
  };

  heals?: {
    sent: number;
    recieved: number;
    part: bodyParts;
  }[];

  // Array of body Part ids that recieved a cure, ie [1, 1, 2] = 2 cures on body part 1 and 1 cure ont body part 2
  cures?: bodyParts[];

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
