/**
 * This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/.
 */

import {race, gender, archetype} from 'camelot-unchained';

export interface PlayerStatus {
  name: string;
  avatar: string;
  race: race;
  gender: gender;
  archetype: archetype;
  characterID: string;
  health: [{
    current: number;
    maximum: number;
  }];
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

export enum BodyParts {
  Torso,
  Head,
  LeftArm,
  RightArm,
  LeftLeg,
  RightLeg
}
